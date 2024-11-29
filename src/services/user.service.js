import httpStatus from 'http-status'
import User from '#models/user'
import { getUserByToken } from '../securities/jwt.security.js'

export const getUserById = async (req, res, id) => {
    try {
        console.log('user service ' + id)
        const user = await User.findById(id)

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Người dùng không tồn tại hoặc đã bị xóa',
            })
        }

        return res.status(httpStatus.OK).json({
            data: user.transform(),
            message: 'Lấy người dùng thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.NOT_FOUND).json({
            message: e.message || 'Không thể tìm thấy người dùng',
        })
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = getUserByToken(req, res)

        await getUserById(req, res, user._id)
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message || 'Không thể lấy thông tin người dùng',
        })
    }
}