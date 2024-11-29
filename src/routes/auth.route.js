import express from 'express'
import * as authController from '#controllers/auth'

const router = express.Router()

router //
    .route('/register')
    .post(authController.register)

router //
    .route('/login')
    .post(authController.login)

router //
    .route('/logout')
    .post(authController.logout)

router //
    .route('/refresh-token')
    .post(authController.refreshToken)

export default router