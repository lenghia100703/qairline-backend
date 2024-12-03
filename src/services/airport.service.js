import Airport from '#models/airport'

class AirportService {
    static async getAirportByCode(code) {
        try {
            return await Airport.findOne({ code })
        } catch (error) {
            throw error
        }
    }

    static async createAirport(data) {
        try {
            const airport = new Airport(data)
            await airport.save()
            return airport
        } catch (error) {
            throw error
        }
    }

    static async getAllAirports() {
        try {
            return await Airport.find()
        } catch (error) {
            throw error
        }
    }

    static async updateAirport(code, data) {
        try {
            const airport = await Airport.findOne({ code })
            if (!airport) {
                return null
            }
            Object.keys(data).forEach((key) => {
                airport[key] = data[key]
            })
            await airport.save()
            return airport
        } catch (error) {
            throw error
        }
    }

    static async deleteAirport(id) {
        try {
            await Airport.findByIdAndDelete(id)
            return { message: 'Airport deleted successfully' }
        } catch (error) {
            throw error
        }
    }
}

export default AirportService
