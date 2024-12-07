import * as airlineService from '#services/airline'

export async function createAirline(req, res) {
    await airlineService.createAirline(req, res)
}

export async function getListAirlines(req, res) {
    await airlineService.getListAirlines(req, res)
}

export async function getAirlineByCode(req, res) {
    await airlineService.getAirlineByCode(req, res)
}

export async function getAirlineById(req, res) {
    await airlineService.getAirlineById(req, res)
}

export async function updateAirline(req, res) {
    await airlineService.updateAirline(req, res)
}

export async function deleteAirline(req, res) {
    await airlineService.deleteAirline(req, res)
}
