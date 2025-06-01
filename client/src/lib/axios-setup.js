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
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 403) {
        userStore.getState().logout();
      }
      return Promise.reject(error);
    } else if (error.request) {
      return Promise.reject(
        new Error("Network error - please check your connection")
      );
    } else {
      return Promise.reject(new Error("An unexpected error occurred"));
    }
  }
);

export default apiClient;
