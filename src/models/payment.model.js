import mongoose from 'mongoose'
import BaseModel from '#models/base'
import { PAYMENT_STATUS } from '#constants/paymentStatus'

const paymentSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            trim: true,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.PENDING,
        },
    },
    {
        timestamps: true,
    },
)

const baseModel = new BaseModel(paymentSchema)

const Payment = baseModel.createModel('Payment')

export default Payment
