import Flight from '#models/flight'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import { genericNumberFlight } from '#utils/genericNumberFlight'
import { PAGE, PER_PAGE } from '#constants/pagination'
import Airport from '#models/airport'
import Plane from '#models/plane'
import { SEAT_STATUS, SEAT_TYPE } from '#constants/seatStatus'
import User from '#models/user'
import { ROLES } from '#constants/role'


export const createFlight = async (req, res) => {
    try {
        const airportToId = new mongoose.Types.ObjectId(req.body.airportTo)
        const airportFromId = new mongoose.Types.ObjectId(req.body.airportFrom)
        const airlineId = new mongoose.Types.ObjectId(req.body.airline)
        const airportFrom = await Airport.findById(airportFromId)
        const airportTo = await Airport.findById(airportToId)
        const capacity = parseInt(req.body.capacity)
        const plane = await Plane.findOne({ code: req.body.planeCode })
        if (!airportFrom) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy sân bay khởi hành',
            })
        }
        if (!airportTo) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy sân bay điểm đến',
            })
        }
        if (!plane) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy máy bay được chỉ định',
            })
        }
        if (capacity < plane.numberOfSeats[0] || capacity > plane.numberOfSeats[1]) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Số lượng sức chứa không phù hợp với máy bay này',
            })
        }
        if (req.body.departureTime >= req.body.arrivalTime) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Thời gian cất cánh và hạ cánh không phù hợp',
            })
        }
        const flightNumber = genericNumberFlight()
        const seats = []
        for (let i = 1; i < capacity; i++) {
            if (i <= 20) {
                seats.push({
                    seatNumber: i,
                    status: SEAT_STATUS.AVAILABLE,
                    type: SEAT_TYPE.BUSINESS,
                })
            } else {
                seats.push({
                    seatNumber: i,
                    status: SEAT_STATUS.AVAILABLE,
                    type: SEAT_TYPE.ECONOMY,
                })
            }
        }
        const flight = new Flight({
            name: req.body.name,
            number: flightNumber,
            departureTime: req.body.departureTime,
            arrivalTime: req.body.arrivalTime,
            price: req.body.price,
            capacity: capacity,
            airportFrom: airportFromId,
            airportTo: airportToId,
            airline: airlineId,
            seats: seats,
            planeCode: req.body.planeCode,
        })
        await flight.save()
        return res.status(httpStatus.CREATED).json({
            data: flight,
            message: 'Tạo chuyến bay thành công',
        })
    } catch (e) {
        console.log(e)
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi tạo chuyến bay',
        })
    }
}

export const getListFlights = async (req, res) => {
    try {
        let {
            page,
            perPage,
            name,
            number,
            timeStart,
            timeEnd,
            airportFrom,
            airportTo,
            priceTo,
            priceFrom,
            capacityTo,
            capacityFrom,
            planeCode,
            status,
        } = req.query
        if (!page || !perPage) {
            page = PAGE
            perPage = PER_PAGE
        }
        const filter = {}
        if (name) {
            filter.name = {
                $regex: new RegExp(name, 'i'),
            }
        }
        if (number) {
            filter.number = {
                $regex: new RegExp(number, 'i'),
            }
        }
        if (airportFrom) {
            filter.airportFrom = new mongoose.Types.ObjectId(airportFrom)
        }
        if (airportTo) {
            filter.airportTo = new mongoose.Types.ObjectId(airportTo)
        }
        if (planeCode) {
            filter.planeCode = planeCode
        }
        if (timeStart || timeEnd) {
            filter.$or = []
            if (timeStart) {
                filter.$or.push({ departureTime: { $gte: new Date(timeStart) } })
                filter.$or.push({ arrivalTime: { $gte: new Date(timeStart) } })
            }
            if (timeEnd) {
                filter.$or.push({ departureTime: { $lte: new Date(timeEnd) } })
                filter.$or.push({ arrivalTime: { $lte: new Date(timeEnd) } })
            }
        }
        if (priceTo) {
            filter.price = { ...filter.price, $lte: parseFloat(priceTo) }
        }
        if (priceFrom) {
            filter.price = { ...filter.price, $gte: parseFloat(priceFrom) }
        }
        if (capacityTo) {
            filter.capacity = { ...filter.capacity, $gte: parseInt(capacityTo) }
        }
        if (capacityFrom) {
            filter.capacity = { ...filter.capacity, $lte: parseInt(capacityFrom) }
        }
        if (status) {
            filter.status = status
        }
        let flights, totalFlights
        if (parseInt(perPage, 10) === -1) {
            flights = await Flight.find(filter)
            totalFlights = flights.length
        } else {
            const skip = (page - 1) * perPage
            const limit = parseInt(perPage, 10)
            flights = await Flight.find(filter).skip(skip).limit(limit)
            totalFlights = await Flight.countDocuments(filter)
        }
        return res.status(httpStatus.OK).json({
            data: flights,
            page: parseInt(page, 10),
            totalPages: perPage === -1 ? 1 : Math.ceil(totalFlights / perPage),
            message: 'Lấy danh sách chuyến bay thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy danh sách chuyến bay',
        })
    }
}

export const getFlightById = async (req, res) => {
    try {
        const { flightId } = req.params
        const flight = await Flight.findById(flightId)
        if (!flight) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy chuyến bay',
            })
        }
        return res.status(httpStatus.OK).json({
            data: flight,
            message: 'Lấy thông tin chuyến bay thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi tìm chuyến bay',
        })
    }
}

export const getFlightByNumber = async (req, res) => {
    try {
        const { flightNumber } = req.params
        const flight = await Flight.findOne({ number: flightNumber })
        if (!flight) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy chuyến bay',
            })
        }
        return res.status(httpStatus.OK).json({
            data: flight,
            message: 'Lấy thông tin chuyến bay thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi tìm chuyến bay',
        })
    }
}

export const updateFlight = async (req, res) => {
    try {
        const { flightId } = req.params
        const updatedFlight = await Flight.findByIdAndUpdate(
            flightId,
            req.body,
            { new: true },
        )
        if (!updatedFlight) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy chuyến bay',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Cập nhật chuyến bay thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật chuyến bay',
        })
    }
}

export const deleteFlight = async (req, res) => {
    try {
        const { flightId } = req.params
        const deletedFlight = await Flight.findByIdAndDelete(flightId)
        if (!deletedFlight) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy chuyến bay',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Xóa chuyến bay thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi xóa chuyến bay',
        })
    }
}

export const updateSeatInfo = async (req, res) => {
    try {
        const { flightId } = req.params
        const userId = req.user._id
        const flight = await Flight.findById(flightId)
        const user = await User.findById(userId)
        let isValidSeat = false
        if (!flight) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy chuyến bay',
            })
        }
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy người dùng',
            })
        }
        if (!Array.isArray(flight.seats) || flight.seats.length === 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Danh sách ghế ngồi không hợp lệ',
            })
        }
        flight.seats.forEach((seat) => {
            if (seat.seatNumber === parseInt(req.body.seatNumber)) {
                if (user.role === ROLES.ADMIN) {
                    seat.seatType = req.body.seatType
                }
                seat.status = req.body.status
                isValidSeat = true
            }
        })
        if (!isValidSeat) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Ghế ngồi bạn chọn không tồn tại hoặc đã có người đặt',
            })
        }
        await flight.save()
        return res.status(httpStatus.OK).json({
            message: 'Cập nhật trạng thái ghế thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật trạng thái ghế',
        })
    }
}
