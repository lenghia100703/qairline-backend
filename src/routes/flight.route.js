import express from 'express';
import * as flightController from '#controllers/flight';

const router = express.Router();

router
    .route('/all-flight')
    .get(flightController.getFlights);

router
    .route('/create-flight')
    .post(flightController.createFlight);

router
    .route('/flight/:id')
    .get(flightController.getFlight)
    .put(flightController.updateFlight)
    .delete(flightController.deleteFlight);

export default router;