import express from 'express'
import * as airlineController from '#controllers/airline'
import { authorize } from '#middlewares/auth'

const router = express.Router()

router.route('/all-airline').get(airlineController.getAllAirlines)

router
    .route('/create-airline')
    .post(authorize(), airlineController.createAirline)

router
    .route('/airline/:code')
    .get(airlineController.getAirlineByCode)
    .put(authorize(), airlineController.updateAirline)
    .delete(authorize(), airlineController.deleteAirline)

export default router
