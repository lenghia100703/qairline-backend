import * as airportService from '#services/airport'

export async function createAirport(req, res) {
    await airportService.createAirport(req, res)
}

export async function getListAirports(req, res) {
    await airportService.getListAirports(req, res)
}

export async function getAirportByCode(req, res) {
    await airportService.getAirportByCode(req, res)
}

export async function getAirportById(req, res) {
    await airportService.getAirportById(req, res)
}

export async function updateAirport(req, res) {
    await airportService.updateAirport(req, res)
}

export async function deleteAirport(req, res) {
    await airportService.deleteAirport(req, res)
}

