import axios from "axios";

/**
 * Axios instance configured with base URL and credentials
 * This allows for consistent API calls across the application
 * with cookies always being sent with requests
 */
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add additional config modifications here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally here
    // For example, handle authentication errors or server issues
    return Promise.reject(error);
  }
);

export default axiosInstance;
