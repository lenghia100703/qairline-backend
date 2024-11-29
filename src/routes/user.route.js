import express from 'express'
import * as userController from '#controllers/user'
import { authorize, LOGGED_USER } from '#middlewares/auth'

const router = express.Router()

router //
    .route('/me')
    .get(authorize(), userController.getCurrentUser)

router //
    .route('/:id')
    .get(authorize(LOGGED_USER), userController.getUserById)

export default router