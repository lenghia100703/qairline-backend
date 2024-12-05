import mongoose from 'mongoose'
import BaseModel from '#models/base'

const airlineSchema = new mongoose.Schema(
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
        contactNumber: {
            type: String,
            required: true,
            trim: true,
        },
        operatingCountry: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
)

const baseModel = new BaseModel(airlineSchema)

const Airline = baseModel.createModel('Airline')

export default Airline
