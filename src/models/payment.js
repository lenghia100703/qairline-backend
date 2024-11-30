import mongoose from "mongoose";
import BaseModel from "#models/base";

const paymentSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
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
        },
    },
    {
        timestamps: true,
    }
);

const baseModel = new BaseModel(paymentSchema);

const Payment = baseModel.createModel("Payment");

export default Payment;