import mongoose from 'mongoose'
import BaseModel from '#models/base'

const AirportSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        location: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
)

const baseModel = new BaseModel(AirportSchema)

const Airport = baseModel.createModel('Airport')

export default Airport
