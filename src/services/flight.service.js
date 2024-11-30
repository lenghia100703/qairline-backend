import Flight from "#models/flight";

class FlightService {
    static async createFlight(data) {
        try {
            const flight = new Flight(data);
            await flight.save();
            return flight;
        } catch (error) {
            throw error;
        }
    }

    static async getFlights() {
        try {
            return await Flight.find();
        } catch (error) {
            throw error;
        }
    }

    static async getFlight(id) {
        try {
            return await Flight.findById(id);
        } catch (error) {
            throw error;
        }
    }

    static async updateFlight(id, data) {
        try {
            return await Flight.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw error;
        }
    }

    static async deleteFlight(id) {
        try {
            await Flight.findByIdAndDelete(id);
            return { message: "Flight deleted successfully" };
        } catch (error) {
            throw error;
        }
    }
}

export default FlightService;