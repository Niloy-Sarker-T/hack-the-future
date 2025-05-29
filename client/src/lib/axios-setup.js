import axios from "axios";
import userStore from "@/store/user-store";

const API_BASE_URL = "http://localhost:3000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = userStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || "An error occurred";
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response received
      throw new Error("Network error - please check your connection");
    } else {
      // Something else happened
      throw new Error("An unexpected error occurred");
    }
  }
);

export default apiClient;
