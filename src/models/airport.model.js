import mongoose from 'mongoose'
import BaseModel from '#models/base'

const AirportSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

const baseModel = new BaseModel(AirportSchema)

const Airport = baseModel.createModel('Airport')

export default Airport
