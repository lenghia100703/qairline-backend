import express from 'express'
import * as flightController from '#controllers/flight'
import { authorize } from '#middlewares/auth'
import { ROLES } from '#constants/role'

const router = express.Router()

router
    .route('')
    .get(flightController.getListFlights)
    .post(authorize([ROLES.ADMIN]), flightController.createFlight)

router
    .route('/number/:flightNumber')
    .get(flightController.getFlightByNumber)

router
    .route('/update-seat/:flightId')
    .put(authorize(), flightController.updateSeatInfo)

router
    .route('/:flightId')
    .get(authorize(), flightController.getFlightById)
    .put(authorize([ROLES.ADMIN]), flightController.updateFlight)
    .delete(authorize([ROLES.ADMIN]), flightController.deleteFlight)

export default router