import express from 'express'
import * as orderController from '#controllers/order'
import { authorize } from '#middlewares/auth'
import { ROLES } from '#constants/role'

const router = express.Router()

router
    .route('')
    .get(authorize(), orderController.getListOrders)
    .post(authorize(), orderController.createOrder)

router
    .route('/code/:code')
    .get(authorize(), orderController.getOrderByCode)

router
    .route('/check-status')
    .post(authorize(), orderController.getOrderStatus)

router
    .route('/:orderId')
    .get(authorize([ROLES.ADMIN]), orderController.getOrderById)
    .delete(authorize([ROLES.ADMIN]), orderController.deleteOrder)

export default router