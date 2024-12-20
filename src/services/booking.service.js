import httpStatus from 'http-status'
import mongoose from 'mongoose'
import Booking from '#models/booking'
import { PAGE, PER_PAGE } from '#constants/pagination'
import Flight from '#models/flight'
import User from '#models/user'
import { SEAT_STATUS } from '#constants/seatStatus'
import { BOOKING_STATUS } from '#constants/bookingStatus'

export const createBooking = async (req, res) => {
    try {
        const userId = req.user._id
        const flightId = new mongoose.Types.ObjectId(req.body.flightId)
        const booking = new Booking({
            flightId: flightId,
            userId: userId,
            seats: req.body.seats,
        })
        await booking.save()
        return res.status(httpStatus.CREATED).json({
            data: booking,
            message: 'Đặt vé thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi đặt vé',
        })
    }
}

export const getListBookings = async (req, res) => {
    try {
        let {
            page,
            perPage,
            flightNumber,
            username,
            userId,
            status,
        } = req.query
        if (!page || !perPage) {
            page = PAGE
            perPage = PER_PAGE
        }
        const flightQuery = flightNumber
            ? { number: { $regex: flightNumber, $options: 'i' } }
            : {}
        const flights = await Flight.find(flightQuery)
        const flightIds = flights.map(flight => flight._id)

        const userQuery = username
            ? { username: { $regex: username, $options: 'i' } }
            : {}
        const users = await User.find(userQuery)
        const userIds = users.map(user => user._id)

        if (flightNumber && flightIds.length === 0) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy chuyến bay nào',
            })
        }
        if (username && userIds.length === 0) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy người dùng nào',
            })
        }

        const filter = {}
        if (flightIds.length > 0) {
            filter.flightId = { $in: flightIds }
        }
        if (userId) {
            filter.userId = userId
        } else if (userIds.length > 0) {
            filter.userId = { $in: userIds }
        }
        if (status) {
            filter.status = status
        }
        let bookings, totalBookings
        if (parseInt(perPage, 10) === -1) {
            bookings = await Booking.find(filter)
            totalBookings = bookings.length
        } else {
            const skip = (page - 1) * perPage
            bookings = await Booking.find(filter).skip(skip).limit(perPage)
            totalBookings = await Booking.countDocuments(filter)
        }

        return res.status(httpStatus.OK).json({
            data: bookings,
            page: parseInt(page, 10),
            totalPages: perPage === -1 ? 1 : Math.ceil(totalBookings / perPage),
            message: 'Lấy danh sách đặt vé thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy danh sách đặt vé',
        })
    }
}


export const getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.bookingId
        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy thông tin đặt vé',
            })
        }
        return res.status(httpStatus.OK).json({
            data: booking,
            message: 'Lấy thông tin đặt vé thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy thông tin đặt vé',
        })
    }
}

export const updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            req.body,
            { new: true },
        )
        if (!updatedBooking) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy thông tin đặt vé',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Cập nhật đặt vé thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật đặt vé',
        })
    }
}

export const deleteBooking = async (req, res) => {
    try {
        const { bookingId } = req.params
        const deletedBooking = await Booking.findByIdAndDelete(bookingId)
        if (!deletedBooking) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy thông tin đặt vé',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Xóa đặt vé thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi xóa đặt vé',
        })
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params
        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy thông tin đặt vé',
            })
        }
        const createdAt = new Date(booking.createdAt)
        const now = new Date()
        const oneDayInMillis = 24 * 60 * 60 * 1000
        if (now - createdAt > oneDayInMillis) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Chỉ có thể hủy vé trong vòng 1 ngày kể từ lúc đặt',
            })
        }
        booking.status = BOOKING_STATUS.CANCELED
        if (booking.seats && Array.isArray(booking.seats)) {
            booking.seats.forEach(seat => {
                seat.status = SEAT_STATUS.AVAILABLE
            })
        }
        await booking.save()
        return res.status(httpStatus.OK).json({
            message: 'Hủy đặt vé thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi hủy đặt vé',
        })
    }
}