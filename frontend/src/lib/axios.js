import axios from 'axios';

// Use the VITE_BACKEND_URL environment variable from .env
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: `${backendUrl}/api`,  // Use the environment variable for the base URL
  withCredentials: true, // Allow credentials (cookies, etc.)
});

export default axiosInstance;
