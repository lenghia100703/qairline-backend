import express from 'express'
import * as airlineController from '#controllers/airline'
import { authorize } from '#middlewares/auth'
import { ROLES } from '#constants/role'

const router = express.Router()

router
    .route('')
    .get(airlineController.getListAirlines)
    .post(authorize([ROLES.ADMIN]), airlineController.createAirline)

router
    .route('/code/:code')
    .get(airlineController.getAirlineByCode)

router
    .route('/:airlineId')
    .get(authorize([ROLES.ADMIN]), airlineController.getAirlineById)
    .put(authorize([ROLES.ADMIN]), airlineController.updateAirline)
    .delete(authorize([ROLES.ADMIN]), airlineController.deleteAirline)

export default router
