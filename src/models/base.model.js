import mongoose from 'mongoose'

class BaseModel {
    constructor(schema) {
        this.schema = schema

        this.schema.add({
            createdBy: {
                type: String,
            },
            updatedBy: {
                type: String,
            },
        })
    }

    createModel(modelName) {
        return mongoose.model(modelName, this.schema)
    }
}

export default BaseModel
