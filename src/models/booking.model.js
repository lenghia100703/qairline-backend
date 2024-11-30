import mongoose from "mongoose";
import BaseModel from "#models/base";

const bookingSchema = new mongoose.Schema(
    {
        flightId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flight",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        seatNumber: {
            type: String,
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

const baseModel = new BaseModel(bookingSchema);

const Booking = baseModel.createModel("Booking");

export default Booking;