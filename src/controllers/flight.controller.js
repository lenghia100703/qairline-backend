import FlightService from '#services/flight'

export async function createFlight(req, res) {
    try {
        const flight = await FlightService.createFlight(req.body)
        res.status(201).json({ flight })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function getFlights(req, res) {
    try {
        const flights = await FlightService.getFlights()
        res.status(200).json({ flights })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function getFlight(req, res) {
    try {
        const flight = await FlightService.getFlight(req.params.id)
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' })
        }
        res.status(200).json({ flight })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function updateFlight(req, res) {
    try {
        const flight = await FlightService.updateFlight(req.params.id, req.body)
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' })
        }
        res.status(200).json({ flight })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function deleteFlight(req, res) {
    try {
        const response = await FlightService.deleteFlight(req.params.id)
        res.status(200).json({ response })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
