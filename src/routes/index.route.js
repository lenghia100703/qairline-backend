import express from 'express'
import authRoutes from '#routes/auth'
import userRoutes from '#routes/user'
import flightRoutes from '#routes/flight'
import airlineRoutes from '#routes/airline'
import airportRoutes from '#routes/airport'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/flight', flightRoutes)
router.use('/airline', airlineRoutes)
router.use('/airport', airportRoutes)

export default router