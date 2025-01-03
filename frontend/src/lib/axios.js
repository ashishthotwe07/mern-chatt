import axios from 'axios';

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', 
  withCredentials: true, // Allow credentials (cookies, etc.)
});

export default axiosInstance;
