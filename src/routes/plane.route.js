import express from 'express'
import * as planeController from '#controllers/plane'
import { authorize } from '#middlewares/auth'
import { ROLES } from '#constants/role'

const router = express.Router()


router
    .route('')
    .get(planeController.getListPlanes)
    .post(authorize([ROLES.ADMIN]), planeController.createPlane)

router
    .route('/code/:code')
    .get(planeController.getPlaneByCode)

router
    .route('/:planeId')
    .get(authorize([ROLES.ADMIN]), planeController.getPlaneById)
    .put(authorize([ROLES.ADMIN]), planeController.updatePlane)
    .delete(authorize([ROLES.ADMIN]), planeController.deletePlane)

export default router