import * as flightService from '#services/flight'

export async function createFlight(req, res) {
    await flightService.createFlight(req, res)
}

export async function getListFlights(req, res) {
    await flightService.getListFlights(req, res)
}

export async function getFlightById(req, res) {
    await flightService.getFlightById(req, res)
}

export async function updateFlight(req, res) {
    await flightService.updateFlight(req, res)
}

export async function deleteFlight(req, res) {
    await flightService.deleteFlight(req, res)
}
