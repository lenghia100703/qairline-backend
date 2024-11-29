import APIError from '#exceptions/api'
import httpStatus from 'http-status'
import { generateAccessToken, generateRefreshToken, getUserByToken } from '#securities/jwt'
import User from '#models/user'
import jwt from 'jsonwebtoken'
import config from '#configs/environment'
import { deleteCookie } from '../utils/cookie.util.js'
import { JWT_CONSTANTS } from '#constants/index'

const { jwtSecret } = config.auth

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user || !(await user.passwordMatches(req.body.password))) {
            throw new APIError({
                message: 'Tên đăng nhập hoặc mật khẩu không đúng',
                status: httpStatus.UNAUTHORIZED,
            })
        }

        const accessToken = generateAccessToken(res, user)
        const refreshToken = generateRefreshToken(res, user)

        await User.findByIdAndUpdate(user._id,
            {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
            {
                new: true,
            },
        )

        return res.status(httpStatus.OK).json({
            message: 'Đăng nhập thành công',
            data: user.transform(),
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message || 'Đăng nhập thất bại',
        })
    }
}

export const register = async (req, res) => {
    try {
        const user = await new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            role: req.body.role,
        }).save()

        return res.status(httpStatus.CREATED).json({
            data: user.transform(),
            message: 'Đăng ký thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.BAD_REQUEST).json({
            message: e.message || 'Đăng ký thất bại',
        })
    }
}

export const logout = async (req, res) => {
    try {
        const user = getUserByToken(req, res)

        await User.findByIdAndUpdate(user._id,
            {
                accessToken: '',
                refreshToken: '',
            },
            {
                new: true,
            },
        )

        res.removeHeader(JWT_CONSTANTS.HEADER_ACCESS_TOKEN)
        res.removeHeader(JWT_CONSTANTS.HEADER_REFRESH_TOKEN)
        deleteCookie(res, JWT_CONSTANTS.COOKIE_ACCESS_TOKEN)
        deleteCookie(res, JWT_CONSTANTS.COOKIE_REFRESH_TOKEN)

        return res.status(httpStatus.OK).json({
            message: 'Đăng xuất thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message || 'Đăng xuất thất bại',
        })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Không thấy refresh token',
            })
        }

        const tokenRecord = await User.findOne({ refreshToken: refreshToken })

        if (!tokenRecord) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: 'Refresh token không hợp lệ',
            })
        }

        jwt.verify(refreshToken, jwtSecret, async (err, user) => {
            if (err) {
                return res.status(httpStatus.UNAUTHORIZED).json({
                    message: 'Refresh token không hợp lệ',
                })
            }

            const accessToken = generateAccessToken(res, user)
            const refreshToken = generateRefreshToken(res, user)

            await User.findByIdAndUpdate(user._id,
                {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                },
                {
                    new: true,
                },
            )

            return res.status(httpStatus.OK).json({
                data: {
                    accessToken: accessToken,
                },
                message: 'Làm mới token thành công',
            })
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: e.message || 'Làm mới token thất bại',
        })
    }
}

