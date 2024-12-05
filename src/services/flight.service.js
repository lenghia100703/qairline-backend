import Flight from '#models/flight'
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import { genericNumberFlight } from '#utils/genericNumberFlight'
import { PAGE, PER_PAGE } from '#constants/pagination'
import User from '../models/user.model.js'


export const createFlight = async (req, res) => {
    try {
        const number = genericNumberFlight()
        const airportToId = new mongoose.Types.ObjectId(req.body.airportTo)
        const airportFromId = new mongoose.Types.ObjectId(req.body.airportFrom)
        const flight = new Flight({
            name: req.body.name,
            number: number,
            departureTime: req.body.departureTime,
            arrivalTime: req.body.arrivalTime,
            price: req.body.price,
            capacity: req.body.capacity,
            airportFrom: airportFromId,
            airportTo: airportToId,
        })
        await flight.save()
        return res.status(httpStatus.CREATED).json({
            data: flight,
            message: 'Tạo chuyến bay thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.BAD_REQUEST).json({
            message: 'Tạo chuyến bay thất bại',
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
            status,
        } = req.query
        if (!page || !perPage) {
            page = PAGE
            perPage = PER_PAGE
        }
        if (name) {
            filter.city = {
                $regex: new RegExp(name, 'i'),
            }
        }
        if (number) {
            filter.city = {
                $regex: new RegExp(number, 'i'),
            }
        }
        if (airportFrom) {
            filter.airportFrom = new mongoose.Types.ObjectId(airportFrom)
        }
        if (airportTo) {
            filter.airportTo = new mongoose.Types.ObjectId(airportTo)
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
        if (priceTo) {
            filter.price = { ...filter.price, $lte: parseFloat(priceTo) }
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
        const filter = {}
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
            message: 'Lấy danh sách chuyến bay thất bại',
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
            message: 'Không tìm thấy chuyến bay',
        })
    }
}

export const updateFlight = async (req, res) => {
    try {
        const { flightId } = req.params
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Người dùng không tồn tại',
            })
        }
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
            message: 'Cập nhật chuyến bay thất bại',
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
            message: 'Xóa chuyến bay thất bại',
        })
    }
}
