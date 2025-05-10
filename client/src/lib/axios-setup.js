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

// Token storage to avoid circular dependency
let authToken = null;

// Function to set auth token from outside
export const setAuthToken = (token) => {
  authToken = token;
};

// Function to clear auth token from outside
export const clearAuthToken = () => {
  authToken = null;
};

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    // Use the token from our module-level variable instead of importing the store
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;

      // Only log non-GET requests with auth to reduce noise
      // if (config.method !== "get") {
      //   console.log(
      //     `🔑 Using auth token for ${config.method.toUpperCase()} ${config.url}`
      //   );
      // }
    }

    // // Also check localStorage directly as fallback
    // try {
    //   const authData = JSON.parse(localStorage.getItem("auth-storage"));
    //   if (authData?.state?.accessToken && !authToken) {
    //     config.headers.Authorization = `Bearer ${authData.state.accessToken}`;
    //     console.log(
    //       `🔄 Retrieved token from localStorage for ${config.method.toUpperCase()} ${
    //         config.url
    //       }`
    //     );
    //   }
    // } catch (error) {
    //   // Silent error handling for localStorage
    // }

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
    if (error?.response?.status === 401) {
      console.log("🚫 Authentication error detected - token may be invalid");

      // You could add auto-logout logic here
      try {
        const authStore = require("../store/authStore").default;
        if (authStore.getState().isAuthenticated) {
          console.log("🔒 Logging out due to authentication error");
          // Uncomment to enable auto-logout
          authStore.getState().logout();
        }
      } catch (e) {
        console.error("Could not access auth store for logout", e);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
