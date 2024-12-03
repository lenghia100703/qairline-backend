import AirlineService from '#services/airline'

export async function createAirline(req, res) {
    try {
        const airline = await AirlineService.createAirline(req.body)
        res.status(201).json({ airline })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function getAllAirlines(req, res) {
    try {
        const airlines = await AirlineService.getAllAirlines()
        res.status(200).json({ airlines })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function getAirlineByCode(req, res) {
    try {
        const airline = await AirlineService.getAirlineByCode(req.params.code)
        if (!airline) {
            return res.status(404).json({ error: 'Airline not found' })
        }
        res.status(200).json({ airline })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function updateAirline(req, res) {
    try {
        const airline = await AirlineService.updateAirline(
            req.params.code,
            req.body
        )
        if (!airline) {
            return res.status(404).json({ error: 'Airline not found' })
        }
        res.status(200).json({ airline })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function deleteAirline(req, res) {
    try {
        const response = await AirlineService.deleteAirline(req.params.id)
        res.status(200).json({ response })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
