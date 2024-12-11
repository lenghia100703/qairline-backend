import Airline from '#models/airline'
import httpStatus from 'http-status'
import { PAGE, PER_PAGE } from '#constants/pagination'


export const createAirline = async (req, res) => {
    try {
        const airline = new Airline(req.body)
        await airline.save()
        return res.status(httpStatus.CREATED).json({
            data: airline,
            message: 'Tạo hãng máy bay thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.BAD_REQUEST).json({
            message: 'Lỗi khi tạo hãng máy bay',
        })
    }
}

export const getAirlineByCode = async (req, res) => {
    try {
        const airline = await Airline.findOne({ code: req.params.code })
        if (!airline) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy hãng máy bay',
            })
        }
        return res.status(httpStatus.OK).json({
            data: airline,
            message: 'Lấy thông tin hãng máy bay thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi tìm hãng máy bay',
        })
    }
}

export const getAirlineById = async (req, res) => {
    try {
        const { airlineId } = req.params
        const airline = await Airline.findById(airlineId)
        if (!airline) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy hãng máy bay',
            })
        }
        return res.status(httpStatus.OK).json({
            data: airline,
            message: 'Lấy thông tin hãng máy bay thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi tìm hãng máy bay',
        })
    }
}

export const getListAirlines = async (req, res) => {
    try {
        let {
            page,
            perPage,
            code,
            name,
            operatingCountry,
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
        if (code) {
            filter.code = {
                $regex: new RegExp(code, 'i'),
            }
        }
        if (operatingCountry) {
            filter.operatingCountry = {
                $regex: new RegExp(operatingCountry, 'i'),
            }
        }
        let airlines, totalAirlines
        if (parseInt(perPage, 10) === -1) {
            airlines = await Airline.find(filter)
            totalAirlines = airlines.length
        } else {
            const skip = (page - 1) * perPage
            const limit = parseInt(perPage, 10)
            airlines = await Airline.find(filter).skip(skip).limit(limit)
            totalAirlines = await Airline.countDocuments(filter)
        }
        return res.status(httpStatus.OK).json({
            data: airlines,
            page: parseInt(page, 10),
            totalPages: perPage === -1 ? 1 : Math.ceil(totalAirlines / perPage),
            message: 'Lấy danh sách hãng máy bay thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy danh sách hãng máy bay',
        })
    }
}

export const updateAirline = async (req, res) => {
    try {
        const { airlineId } = req.params
        const updatedAirline = await Airline.findByIdAndUpdate(
            airlineId,
            req.body,
            { new: true },
        )
        if (!updatedAirline) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy hãng máy bay',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Cập nhật hãng máy bay thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật hãng máy bay',
        })
    }
}

export const deleteAirline = async (req, res) => {
    try {
        const { airlineId } = req.params
        const deletedAirline = await Airline.findByIdAndDelete(airlineId)
        if (!deletedAirline) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy hãng máy bay',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Xóa hãng máy bay thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi xóa hãng máy bay',
        })
    }
}


