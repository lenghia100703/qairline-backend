import config from '#configs/environment'
import moment from 'moment'
import httpStatus from 'http-status'
import hmacSHA256 from 'crypto-js/hmac-sha256.js'
import axios from 'axios'
import { genericOrderCodeUtil } from '#utils/genericOrderCode'
import Flight from '#models/flight'
import { SEAT_TYPE } from '#constants/seatStatus'
import Order from '../models/order.model.js'
import { PAYMENT_METHOD } from '#constants/paymentMethod'
import qs from 'qs'
import { ORDER_STATUS } from '#constants/orderStatus'
import { PAGE, PER_PAGE } from '#constants/pagination'
import { ROLES } from '#constants/role'

export const createOrder = async (req, res) => {
    try {
        const { booking } = req.body
        const embed_data = {
            redirecturl: config.zalo.redirectUrl,
        }
        const flight = await Flight.findById(booking.flightId)
        if (!flight) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy chuyến bay',
            })
        }
        const items = []
        for (let i = 0; i < booking.seats.length; i++) {
            const price = flight.price
            if (booking.seats[i].type === SEAT_TYPE.BUSINESS) {
                items.push({
                    seatNumber: booking.seats[i].seatNumber,
                    quantity: 1,
                    user: booking.userId,
                    price: price + 2000000,
                })
            } else {
                items.push({
                    seatNumber: booking.seats[i].seatNumber,
                    quantity: 1,
                    user: booking.userId,
                    price: price,
                })
            }
        }
        const transId = genericOrderCodeUtil()
        const orderZalo = {
            app_id: config.zalo.appId,
            app_trans_id: `${moment().format('YYMMDD')}_${transId}`,
            app_user: booking.userId,
            app_time: Date.now(),
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: items.reduce((sum, item) => sum + item.price, 0),
            description: `Thanh toán ${items.length} vé máy bay với số đơn hàng ${transId}`,
            bank_code: 'zalopayapp',
        }
        const data = `${config.zalo.appId}|${orderZalo.app_trans_id}|${orderZalo.app_user}|${orderZalo.amount}|${orderZalo.app_time}|${orderZalo.embed_data}|${orderZalo.item}`
        orderZalo.mac = hmacSHA256(data, config.zalo.key1).toString()
        const order = new Order({
            code: orderZalo.app_trans_id,
            bookingId: booking._id,
            totalQuantity: items.length,
            totalPrice: orderZalo.amount,
            paymentMethod: req.body.paymentMethod,
            timeExpired:
                req.body.paymentMethod === PAYMENT_METHOD.CASH
                    ? new Date(
                          new Date(flight.arrivalTime).getTime() -
                              60 * 60 * 1000 * 24
                      )
                    : new Date(orderZalo.app_time + 15 * 60 * 1000),
        })
        await order.save()
        if (req.body.paymentMethod === PAYMENT_METHOD.CASH) {
            return res.status(httpStatus.CREATED).json({
                message: 'Tạo đơn hàng thành công',
                data: {
                    order: order,
                    banking: null,
                },
            })
        }
        const response = await axios.post(
            `${config.zalo.apiUrl}/create`,
            null,
            {
                params: orderZalo,
            }
        )
        return res.status(httpStatus.CREATED).json({
            message:
                'Tạo đơn hàng thành công' || response.data.sub_return_message,
            data: {
                order: order,
                banking: {
                    zpTransToken: response.data.zp_trans_token,
                    orderUrl: response.data.order_url,
                    orderToken: response.data.order_token,
                    qrCode: response.data.qr_code,
                },
            },
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Tạo đơn hàng thất bại' || e.sub_return_message,
        })
    }
}

export const getOrderStatus = async (req, res) => {
    try {
        const postData = {
            app_id: config.zalo.appId,
            app_trans_id: req.body.orderCode,
        }
        const data = `${postData.app_id}|${postData.app_trans_id}|${config.zalo.key1}`
        postData.mac = hmacSHA256(data, config.zalo.key1).toString()
        const response = await axios.post(
            `${config.zalo.apiUrl}/query`,
            qs.stringify(postData),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )
        const order = await Order.findOne({
            code: postData.app_trans_id,
        })
        if (response.data.return_code === 1) {
            order.status = ORDER_STATUS.SUCCESS
        } else if (response.data.return_code === 2) {
            order.status = ORDER_STATUS.FAILURE
        } else if (response.data.return_code === 3) {
            order.status = ORDER_STATUS.PENDING
        } else if (
            response.data.sub_return_code === -54 ||
            order.timeExpired > moment.now()
        ) {
            order.status = ORDER_STATUS.EXPIRED
        }
        await order.save()
        return res.status(httpStatus.OK).json({
            message:
                'Lấy trạng thái đơn hàng thành công' ||
                response.data.sub_return_message,
            data: {
                orderCode: postData.app_trans_id,
                returnCode: response.data.return_code,
                isProcess: response.data.is_process,
                totalPrice: response.data.amount,
                zpTransId: response.data.zp_trans_id,
                serverTime: response.data.server_time,
                discountAmount: response.data.discount_amount,
            },
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message:
                'Lỗi khi kiểm tra trạng thái đơn hàng' ||
                e.data.sub_return_message,
        })
    }
}

export const getListOrders = async (req, res) => {
    try {
        let { page, perPage, code, paymentMethod, status, isDeleted } =
            req.query
        if (!page || !perPage) {
            page = PAGE
            perPage = PER_PAGE
        }
        const filter = {}
        if (code) {
            filter.code = {
                $regex: new RegExp(code, 'i'),
            }
        }
        if (paymentMethod) {
            filter.paymentMethod = paymentMethod
        }
        if (status) {
            filter.status = status
        }
        if (typeof isDeleted === 'string') {
            isDeleted = isDeleted.toLowerCase() === 'true'
        }
        if (isDeleted === true) {
            if (req.user.role === ROLES.USER) {
                return res.status(httpStatus.UNAUTHORIZED).json({
                    message: 'Bạn không có đủ thẩm quyền để lấy thông tin này',
                })
            }
            filter.isDeleted = true
        } else {
            filter.isDeleted = false
        }
        let orders, totalOrders
        if (parseInt(perPage, 10) === -1) {
            orders = await Order.find(filter)
            totalOrders = orders.length
        } else {
            const skip = (page - 1) * perPage
            const limit = parseInt(perPage, 10)
            orders = await Order.find(filter).skip(skip).limit(limit)
            totalOrders = await Order.countDocuments(filter)
        }
        return res.status(httpStatus.OK).json({
            data: orders,
            page: parseInt(page, 10),
            totalPages: perPage === -1 ? 1 : Math.ceil(totalOrders / perPage),
            message: 'Lấy danh sách đơn hàng thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy danh sách đơn hàng thất bại',
        })
    }
}

export const getOrderByCode = async (req, res) => {
    try {
        const { code } = req.params
        const order = await Order.findOne({ code: code })
        if (!order) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy đơn hàng',
            })
        }
        return res.status(httpStatus.OK).json({
            data: order,
            message: 'Lấy thông tin đơn hàng thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy thông tin đơn hàng',
        })
    }
}

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy đơn hàng',
            })
        }
        return res.status(httpStatus.OK).json({
            data: order,
            message: 'Lấy thông tin đơn hàng thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy thông tin đơn hàng',
        })
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params
        const deletedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                isDeleted: true,
            },
            {
                new: true,
            }
        )
        if (!deletedOrder) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy đơn hàng',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Xóa đơn hàng thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi xóa đơn hàng',
        })
    }
}
