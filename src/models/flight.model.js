import mongoose from 'mongoose'
import BaseModel from '#models/base'

const flightSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        number: {
            type: String,
            required: true,
            trim: true,
        },
        departureTime: {
            type: Date,
            required: true,
        },
        arrivalTime: {
            type: Date,
            required: true,
        },
        airportFrom: {
            type: String,
            required: true,
            trim: true,
        },
        airportTo: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

const baseModel = new BaseModel(flightSchema)

const Flight = baseModel.createModel('Flight')

export default Flight

