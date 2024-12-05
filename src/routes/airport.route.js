import express from 'express'
import * as airportController from '#controllers/airport'
import { authorize } from '#middlewares/auth'
import { ROLES } from '#constants/role'

const router = express.Router()

router.route('/all-airport').get(airportController.getAllAirports)

router
    .route('')
    .get(airportController.getAllAirports)
    .post(authorize([ROLES.ADMIN]), airportController.createAirport)

router
    .route('/:code')
    .get(airportController.getAirportByCode)
    .put(authorize([ROLES.ADMIN]), airportController.updateAirport)
    .delete(authorize([ROLES.ADMIN]), airportController.deleteAirport)

export default router
