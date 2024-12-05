import express from 'express'
import * as airlineController from '#controllers/airline'
import { authorize } from '#middlewares/auth'
import { ROLES } from '#constants/role'

const router = express.Router()

router
    .route('')
    .get(airlineController.getAllAirlines)
    .post(authorize([ROLES.ADMIN]), airlineController.createAirline)

router
    .route('/:code')
    .get(airlineController.getAirlineByCode)
    .put(authorize([ROLES.ADMIN]), airlineController.updateAirline)
    .delete(authorize([ROLES.ADMIN]), airlineController.deleteAirline)

export default router
