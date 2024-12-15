import mongoose from 'mongoose'
import BaseModel from '#models/base'
import { POST_TYPE } from '#constants/postType'

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            trim: true,
            required: true,
            enum: Object.values(POST_TYPE),
        },
    },
    {
        timestamps: true,
    },
)

const baseModel = new BaseModel(postSchema)

const Post = baseModel.createModel('Post')

export default Post
