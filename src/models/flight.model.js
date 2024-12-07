import mongoose from 'mongoose'
import BaseModel from '#models/base'
import { FLIGHT_STATUS } from '#constants/flightStatus'

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
        airline: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Airline',
        },
        airportFrom: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Airport',
        },
        airportTo: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Airport',
        },
        planeCode: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        seatsStatus: [{
            type: Object
        }],
        status: {
            type: String,
            required: true,
            trim: true,
            enum: Object.values(FLIGHT_STATUS),
            default: FLIGHT_STATUS.NO_STATUS,
        },
    },
    {
        timestamps: true,
    },
)

const baseModel = new BaseModel(flightSchema)

const Flight = baseModel.createModel('Flight')

export default Flight

