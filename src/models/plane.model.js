import mongoose from 'mongoose'
import BaseModel from '#models/base'

const plainSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        airline: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        engine: {
            type: String,
            required: true,
            trim: true
        },
        numberOfSeats: [
            {
                type: Number,
                default: 0
            }
        ],
        maxSpeed: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
    },
)

const baseModel = new BaseModel(plainSchema)

const Plane = baseModel.createModel('Plane')

export default Plane
