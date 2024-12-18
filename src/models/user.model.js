import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import config from '#configs/environment'
import BaseModel from '#models/base'
import { ROLES } from '#constants/role'

const { env } = config
const roles = [ROLES.USER, ROLES.ADMIN]

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            match: /^\S+@\S+\.\S+$/,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 128,
        },
        username: {
            type: String,
            maxlength: 128,
            required: true,
            index: true,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
            default: '',
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        cardId: {
            type: String,
            trim: true,
            default: '',
        },
        services: {
            facebook: String,
            google: String,
        },
        role: {
            type: String,
            required: true,
            enum: Object.values(ROLES),
            default: ROLES.USER,
        },
        avatar: {
            type: String,
            trim: true,
            default: config.defaultAvatar,
        },
        accessToken: {
            type: String,
            trim: true,
        },
        refreshToken: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
)

userSchema.pre('save', async function save(next) {
    try {
        if (!this.isModified('password')) return next()

        const rounds = env === 'test' ? 1 : 10

        this.password = await bcrypt.hash(this.password, rounds)

        return next()
    } catch (error) {
        return next(error)
    }
})

userSchema.method({
    transform() {
        const transformed = {}
        const fields = [
            '_id',
            'username',
            'email',
            'avatar',
            'role',
            'accessToken',
            'cardId',
            'phone',
            'address',
        ]

        for (const field of fields) {
            transformed[field] = this[field]
        }

        return transformed
    },

    async passwordMatches(password) {
        return bcrypt.compare(password, this.password)
    },
})

userSchema.statics = {
    roles,
}

const baseModel = new BaseModel(userSchema)

const User = baseModel.createModel('User')

export default User