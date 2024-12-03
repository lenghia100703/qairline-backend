import express from 'express'
import * as airportController from '#controllers/airport'
import { authorize } from '#middlewares/auth'

const router = express.Router()

router.route('/all-airport').get(airportController.getAllAirports)

router
    .route('/create-airport')
    .post(authorize(), airportController.createAirport)

router
    .route('/airport/:code')
    .get(airportController.getAirportByCode)
    .put(authorize(), airportController.updateAirport)
    .delete(authorize(), airportController.deleteAirport)

export default router
