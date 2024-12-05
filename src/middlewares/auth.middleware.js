import { promisify } from 'node:util'
import httpStatus from 'http-status'
import passport from 'passport'
import APIError from '#exceptions/api'
import User from '#models/user'
import { ROLES } from '#constants/role'

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
    const logIn = promisify(req.logIn)
    const error = err || info
    const apiError = new APIError({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
    })
    try {
        if (error || !user) throw error
        await logIn(user, { session: false })
    } catch (e) {
        return next(apiError)
    }
    if (user.role === ROLES.ADMIN) {
        return next()
    } else if (!roles.includes(user.role)) {
        apiError.status = httpStatus.FORBIDDEN
        apiError.message = 'Forbidden'
        return next(apiError)
    } else if (err || !user) {
        return next(apiError)
    }

    req.user = user

    return next()
}

export function authorize(roles = User.roles) {
    return (...params) =>
        passport.authenticate('jwt', { session: false }, handleJWT(...params, roles))(...params)
}

export function oAuth(service) {
    return passport.authenticate(service, { session: false })
}