import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
    timeout: 10000,
    headers: { 
        "Content-Type": "application/json",
        // Add Authorization header by default if token exists
        ...(localStorage.getItem("token") && {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        })
    }
});

export default api;