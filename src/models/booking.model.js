import mongoose from 'mongoose'
import BaseModel from '#models/base'
import { BOOKING_STATUS } from '#constants/bookingStatus'

const bookingSchema = new mongoose.Schema(
    {
        flightId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Flight',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        seats: [{
            type: Object,
        }],
        status: {
            type: String,
            required: true,
            trim: true,
            enum: Object.values(BOOKING_STATUS),
            default: BOOKING_STATUS.PENDING,
        },
    },
    {
        timestamps: true,
    },
)

const baseModel = new BaseModel(bookingSchema)

const Booking = baseModel.createModel('Booking')

export default Booking