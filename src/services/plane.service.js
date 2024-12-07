import Plane from '#models/plane'
import httpStatus from 'http-status'
import { PAGE, PER_PAGE } from '#constants/pagination'
import mongoose from 'mongoose'


export const createPlane = async (req, res) => {
    try {
        const plane = new Plane(req.body)
        await plane.save()
        return res.status(httpStatus.CREATED).json({
            data: plane,
            message: 'Tạo máy bay thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.BAD_REQUEST).json({
            message: 'Tạo máy bay thất bại',
        })
    }
}

export const getPlaneByCode = async (req, res) => {
    try {
        const plane = await Plane.findOne({ code: req.params.code })
        if (!plane) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy máy bay',
            })
        }
        return res.status(httpStatus.OK).json({
            data: plane,
            message: 'Lấy thông tin máy bay thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Không tìm thấy máy bay',
        })
    }
}

export const getPlaneById = async (req, res) => {
    try {
        const { planeId } = req.params
        const plane = await Plane.findById(planeId)
        if (!plane) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy máy bay',
            })
        }
        return res.status(httpStatus.OK).json({
            data: plane,
            message: 'Lấy thông tin máy bay thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Không tìm thấy máy bay',
        })
    }
}

export const getListPlanes = async (req, res) => {
    try {
        let {
            page,
            perPage,
            code,
            name,
            seatFrom,
            seatTo,
            airline,
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
        if (airline) {
            filter.airline = new mongoose.Types.ObjectId(airline)
        }
        if (code) {
            filter.code = {
                $regex: new RegExp(code, 'i'),
            }
        }
        if (seatTo) {
            filter.numberOfSeats = {
                ...filter.numberOfSeats,
                $elemMatch: { $lte: parseInt(seatTo) },
            }
        }
        if (seatFrom) {
            filter.numberOfSeats = {
                ...filter.numberOfSeats,
                $elemMatch: { $gte: parseInt(seatFrom) },
            }
        }
        const filter = {}
        let planes, totalPlanes
        if (parseInt(perPage, 10) === -1) {
            planes = await Plane.find(filter)
            totalPlanes = planes.length
        } else {
            const skip = (page - 1) * perPage
            const limit = parseInt(perPage, 10)
            planes = await Plane.find(filter).skip(skip).limit(limit)
            totalPlanes = await Plane.countDocuments(filter)
        }
        return res.status(httpStatus.OK).json({
            data: planes,
            page: parseInt(page, 10),
            totalPages: perPage === -1 ? 1 : Math.ceil(totalPlanes / perPage),
            message: 'Lấy danh sách máy bay thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lấy danh sách máy bay thất bại',
        })
    }
}

export const updatePlane = async (req, res) => {
    try {
        const { planeId } = req.params
        const updatedPlane = await Plane.findByIdAndUpdate(
            planeId,
            req.body,
            { new: true },
        )
        if (!updatedPlane) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy máy bay',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Cập nhật máy bay thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Cập nhật máy bay thất bại',
        })
    }
}

export const deletePlane = async (req, res) => {
    try {
        const { planeId } = req.params
        const deletedPlane = await Plane.findByIdAndDelete(planeId)
        if (!deletedPlane) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy máy bay',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Xóa máy bay thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Xóa máy bay thất bại',
        })
    }
}
