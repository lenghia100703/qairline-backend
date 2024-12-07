import * as planeService from '#services/plane'

export async function createPlane(req, res) {
    await planeService.createPlane(req, res)
}

export async function getListPlanes(req, res) {
    await planeService.getListPlanes(req, res)
}

export async function getPlaneByCode(req, res) {
    await planeService.getPlaneByCode(req, res)
}

export async function getPlaneById(req, res) {
    await planeService.getPlaneById(req, res)
}

export async function updatePlane(req, res) {
    await planeService.updatePlane(req, res)
}

export async function deletePlane(req, res) {
    await planeService.deletePlane(req, res)
}

