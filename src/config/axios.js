// src/config/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

api.interceptors.request.use(config => {
    // Check if localStorage is available (client-side only)
    if (typeof window !== "undefined" && window.localStorage) {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
