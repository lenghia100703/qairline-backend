import * as bookingService from '#services/booking'

export async function createBooking(req, res) {
    await bookingService.createBooking(req, res)
}

export async function getListBookings(req, res) {
    await bookingService.getListBookings(req, res)
}

export async function getBookingById(req, res) {
    await bookingService.getBookingById(req, res)
}

export async function updateBooking(req, res) {
    await bookingService.updateBooking(req, res)
}

export async function deleteBooking(req, res) {
    await bookingService.deleteBooking(req, res)
}

export async function cancelBooking(req, res) {
    await bookingService.cancelBooking(req, res)
}