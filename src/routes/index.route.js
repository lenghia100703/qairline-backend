import express from 'express'
import authRoutes from '#routes/auth'
import userRoutes from '#routes/user'
import flightRoutes from '#routes/flight'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/flight', flightRoutes)

export default router