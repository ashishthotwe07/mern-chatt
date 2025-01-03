import axios from 'axios';

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api", 
  withCredentials: true, // Allow credentials (cookies, etc.)
});

export default axiosInstance;
