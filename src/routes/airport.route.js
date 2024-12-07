import express from 'express'
import * as airportController from '#controllers/airport'
import { authorize } from '#middlewares/auth'
import { ROLES } from '#constants/role'

const router = express.Router()


router
    .route('')
    .get(airportController.getListAirports)
    .post(authorize([ROLES.ADMIN]), airportController.createAirport)

router
    .route('/code/:code')
    .get(airportController.getAirportByCode)

router
    .route('/:airportId')
    .get(authorize([ROLES.ADMIN]), airportController.getAirportById)
    .put(authorize([ROLES.ADMIN]), airportController.updateAirport)
    .delete(authorize([ROLES.ADMIN]), airportController.deleteAirport)

export default router