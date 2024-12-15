import express from 'express'
import authRoutes from '#routes/auth'
import userRoutes from '#routes/user'
import flightRoutes from '#routes/flight'
import airlineRoutes from '#routes/airline'
import airportRoutes from '#routes/airport'
import orderRoutes from '#routes/order'
import planeRoutes from '#routes/plane'
import postRoutes from '#routes/post'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/flight', flightRoutes)
router.use('/airline', airlineRoutes)
router.use('/airport', airportRoutes)
router.use('/order', orderRoutes)
router.use('/plane', planeRoutes)
router.use('/post', postRoutes)

export default router