import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://fms-backend-jbws.onrender.com/api', // Your Render backend URL
});

// Add a request interceptor to include the token if available
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;