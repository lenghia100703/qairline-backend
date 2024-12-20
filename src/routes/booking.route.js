import express from 'express'
import * as bookingController from '#controllers/booking'
import { authorize } from '#middlewares/auth'

const router = express.Router()

router
    .route('')
    .get(authorize(), bookingController.getListBookings)
    .post(authorize(), bookingController.createBooking)

router
    .route('/canceled/:bookingId')
    .post(authorize(), bookingController.cancelBooking)

router
    .route('/:bookingId')
    .get(authorize(), bookingController.getBookingById)
    .put(authorize(), bookingController.updateBooking)
    .delete(authorize(), bookingController.deleteBooking)

export default router