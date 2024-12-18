import * as orderService from '#services/order'

export async function createOrder(req, res) {
    await orderService.createOrder(req, res)
}

export async function getListOrders(req, res) {
    await orderService.getListOrders(req, res)
}

export async function getOrderById(req, res) {
    await orderService.getOrderById(req, res)
}

export async function deleteOrder(req, res) {
    await orderService.deleteOrder(req, res)
}

export async function getOrderByCode(req, res) {
    await orderService.getOrderByCode(req, res)
}

export async function getOrderStatus(req, res) {
    await orderService.getOrderStatus(req, res)
}

export async function getOrderByBookingId(req, res) {
    await orderService.getOrderByBookingId(req, res)
}

