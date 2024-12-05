import express from 'express'
import * as userController from '#controllers/user'
import { authorize } from '#middlewares/auth'

const router = express.Router()

router //
    .route('/me')
    .get(authorize(), userController.getCurrentUser)

router //
    .route('/:id')
    .get(authorize(), userController.getUserById)

export default router