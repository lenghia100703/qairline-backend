import Airport from '#models/airport'
import Airline from '../models/airline.model.js'
import httpStatus from 'http-status'
import { PAGE, PER_PAGE } from '#constants/pagination'


export const createAirport = async (req, res) => {
    try {
        const airport = new Airport(req.body)
        await airport.save()
        return res.status(httpStatus.CREATED).json({
            data: airport,
            message: 'Tạo sân bay thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.BAD_REQUEST).json({
            message: 'Tạo sân bay thất bại',
        })
    }
}

export const getAirportByCode = async (req, res) => {
    try {
        const airport = await Airport.findOne({ code: req.params.code })
        if (!airport) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy sân bay',
            })
        }
        return res.status(httpStatus.OK).json({
            data: airport,
            message: 'Lấy thông tin sân bay thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Không tìm thấy sân bay',
        })
    }
}

export const getAirportById = async (req, res) => {
    try {
        const { airportId } = req.params
        const airport = await Airline.findById(airportId)
        if (!airport) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy sân bay',
            })
        }
        return res.status(httpStatus.OK).json({
            data: airport,
            message: 'Lấy thông tin sân bay thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Không tìm thấy sân bay',
        })
    }
}

export const getListAirports = async (req, res) => {
    try {
        let {
            page,
            perPage,
            code,
            name,
            country,
            location
        } = req.query
        if (!page || !perPage) {
            page = PAGE
            perPage = PER_PAGE
        }
        if (name) {
            filter.name = {
                $regex: new RegExp(name, 'i'),
            }
        }
        if (country) {
            filter.country = {
                $regex: new RegExp(country, 'i'),
            }
        }
        if (code) {
            filter.code = {
                $regex: new RegExp(code, 'i'),
            }
        }
        if (location) {
            filter.location = {
                $regex: new RegExp(location, 'i'),
            }
        }
        const filter = {}
        let airports, totalAirports
        if (parseInt(perPage, 10) === -1) {
            airports = await Airport.find(filter)
            totalAirports = airports.length
        } else {
            const skip = (page - 1) * perPage
            const limit = parseInt(perPage, 10)
            airports = await Airport.find(filter).skip(skip).limit(limit)
            totalAirports = await Airport.countDocuments(filter)
        }
        return res.status(httpStatus.OK).json({
            data: airports,
            page: parseInt(page, 10),
            totalPages: perPage === -1 ? 1 : Math.ceil(totalAirports / perPage),
            message: 'Lấy danh sách sân bay thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lấy danh sách sân bay thất bại',
        })
    }
}

export const updateAirport = async (req, res) => {
    try {
        const { airportId } = req.params
        const updatedAirport = await Airport.findByIdAndUpdate(
            airportId,
            req.body,
            { new: true },
        )
        if (!updatedAirport) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy sân bay',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Cập nhật sân bay thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Cập nhật sân bay thất bại',
        })
    }
}

export const deleteAirport = async (req, res) => {
    try {
        const { airportId } = req.params
        const deletedAirport = await Airport.findByIdAndDelete(airportId)
        if (!deletedAirport) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy hãng máy bay',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Xóa hãng máy bay thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Xóa hãng máy bay thất bại',
        })
    }
}
