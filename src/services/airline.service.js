import Airline from '#models/airline'

class AirlineService {
    static async getAirlineByCode(code) {
        try {
            return await Airline.findOne({ code })
        } catch (error) {
            throw error
        }
    }

    static async createAirline(data) {
        try {
            const airline = new Airline(data)
            await airline.save()
            return airline
        } catch (error) {
            throw error
        }
    }

    static async getAllAirlines() {
        try {
            return await Airline.find()
        } catch (error) {
            throw error
        }
    }

    static async updateAirline(code, data) {
        try {
            const airline = await Airline.findOne({ code })
            if (!airline) {
                return null
            }
            Object.keys(data).forEach((key) => {
                airline[key] = data[key]
            })
        } catch (error) {
            throw error
        }
    }

    static async deleteAirline(id) {
        try {
            await Airline.findByIdAndDelete(id)
            return { message: 'Airline deleted successfully' }
        } catch (error) {
            throw error
        }
    }
}

export default AirlineService
