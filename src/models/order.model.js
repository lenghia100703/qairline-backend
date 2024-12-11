import mongoose from 'mongoose'
import BaseModel from '#models/base'
import { ORDER_STATUS } from '#constants/orderStatus'
import { PAYMENT_METHOD } from '#constants/paymentMethod'

const orderSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        totalQuantity: {
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            trim: true,
            enum: Object.values(ORDER_STATUS),
            default: ORDER_STATUS.PENDING,
        },
        paymentMethod: {
            type: String,
            required: true,
            trim: true,
            enum: Object.values(PAYMENT_METHOD),
            default: PAYMENT_METHOD.CASH,
        },
        timeExpired: {
            type: Date,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    },
)

const baseModel = new BaseModel(orderSchema)

const Order = baseModel.createModel('Order')

export default Order