import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import config from '#configs/environment'
import User from '#models/user'

const jwtOptions = {
    secretOrKey: config.auth.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
}

async function jwtHandler(payload, done) {
    try {
        const user = await User.findById(payload._id)
        if (user) return done(null, user)
        return done(null, false)
    } catch (error) {
        return done(error, false)
    }
}

const authMiddleware = passport.initialize()

passport.use('jwt', new JwtStrategy(jwtOptions, jwtHandler))

export default authMiddleware