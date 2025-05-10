import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axiosInstance, { setAuthToken, clearAuthToken } from "@/lib/axios-setup";

/**
 * Authentication store using Zustand
 * Manages user authentication state including:
 * - User data
 * - Authentication tokens
 * - Login/logout functionality
 * - Persistent sessions
 */
// Initial token setup - runs immediately to set the token from storage if available
try {
  const savedAuth = JSON.parse(localStorage.getItem("auth-storage"));
  if (savedAuth?.state?.accessToken) {
    setAuthToken(savedAuth.state.accessToken);
  }
} catch (e) {
  console.error("Error initializing auth token:", e);
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions

      /**
       * Set user authentication data after successful login
       * @param {Object} userData - User data from API
       * @param {string} token - Access token from API
       */
      setAuth: (userData, token) => {
        // Set token in axios module
        setAuthToken(token);

        // Update store state
        set({
          user: userData,
          accessToken: token,
          isAuthenticated: true,
          error: null,
        });
      },

      /**
       * Update user information
       * @param {Object} userData - Updated user data
       */
      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      /**
       * Login user with email and password
       * @param {Object} credentials - User credentials (email, password)
       * @returns {Promise} Promise that resolves to the login result
       */
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const res = await axiosInstance.post("/api/auth/login", credentials);
          const userData = res.data?.data?.user;
          const accessToken = res.data?.data?.accessToken;

          if (userData && accessToken) {
            // Set token in axios module
            setAuthToken(accessToken);

            set({
              user: userData,
              accessToken: accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error("Invalid response format from server");
          }

          return res.data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || error.message,
          });
          throw error;
        }
      },

      /**
       * Register a new user
       * @param {Object} userData - User registration data
       * @returns {Promise} Promise that resolves to the registration result
       */
      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const res = await axiosInstance.post("/api/auth/register", userData);
          return res.data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || error.message,
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Clear authentication state on logout
       * @returns {Promise} Promise that resolves when logout is complete
       */
      logout: async () => {
        try {
          // Try to call logout endpoint if authenticated
          if (get().isAuthenticated) {
            await axiosInstance.post("/api/auth/logout");
          }
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          // Clear auth token in axios module
          clearAuthToken();

          // Clear auth state regardless of API success
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      /**
       * Clear any error state
       */
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage", // name of the item in the storage
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence

      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),

      // Called when the persisted state is hydrated into the store
      onRehydrateStorage: () => (state) => {
        // When the store is rehydrated from storage,
        // make sure to update the axios token
        if (state?.accessToken) {
          setAuthToken(state.accessToken);
        }
      },
    }
  )
);

export default useAuthStore;
