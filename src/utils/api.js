import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000/api" });

// Driver APIs
export const registerDriver = (data) => API.post("/admin/register", data);
export const loginDriver = (data) => API.post("/admin/login", data);
// export const fetchDriverRoutes = (driverId) => API.get(`/driver/${driverId}/routes`);

// Trip APIs
export const startTrip = (data) => {
    console.log(data);
    
    API.post("/driver/start", data)
};
export const updateTripStatus = (tripId, status) => API.patch(`/trips/${tripId}`, { status });
export const fetchTrips = () => API.get("/trips");

// Admin APIs
export const fetchDrivers = () => API.get("/admin/drivers");