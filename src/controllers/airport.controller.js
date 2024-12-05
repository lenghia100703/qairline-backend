import AirportService from '#services/airport'

export async function createAirport(req, res) {
    try {
        const airport = await AirportService.createAirport(req.body)
        res.status(201).json({
            airport,
        })
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
}

export async function getAllAirports(req, res) {
    try {
        const airports = await AirportService.getAllAirports()
        res.status(200).json({
            airports,
        })
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
}

export async function getAirportByCode(req, res) {
    try {
        const airport = await AirportService.getAirportByCode(req.params.code)
        if (!airport) {
            return res.status(404).json({
                error: 'Airport not found',
            })
        }
        res.status(200).json({
            airport,
        })
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
}

export async function updateAirport(req, res) {
    try {
        const airport = await AirportService.updateAirport(
            req.params.code,
            req.body,
        )
        if (!airport) {
            return res.status(404).json({
                error: 'Airport not found',
            })
        }
        res.status(200).json({
            airport,
        })
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
}

export async function deleteAirport(req, res) {
    try {
        const response = await AirportService.deleteAirport(req.params.id)
        res.status(200).json({
            response,
        })
    } catch (error) {
        res.status(500).json({
            error: error.message,
        })
    }
}
