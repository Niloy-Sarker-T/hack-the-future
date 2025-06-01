import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiService } from "@/lib/api-services";
import { toast } from "sonner";

const userStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Sign up action
      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Call the API service to sign up
          // On sucess, it will return only first name, last name, email and message
          // then show a toast message
          const res = await apiService.signup(userData);
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
        return res;
      },

      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiService.login(credentials);

          set({
            user: res.data.user,
            token: res.data.token,
            isLoading: false,
            error: null,
          });

          return { success: true, data: res.data };
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true });
        try {
          await apiService.logout();
        } catch (error) {
          // Log error but still clear local state
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,
            token: null,
            error: null,
            isLoading: false,
          });
        }
      },

      //   // Refresh token action
      //   refreshToken: async () => {
      //     try {
      //       const data = await apiService.refreshToken();
      //       set({
      //         token: data.token,
      //         user: data.user,
      //       });
      //       return { success: true };
      //     } catch (error) {
      //       // If refresh fails, logout user
      //       get().logout();
      //       return { success: false, error: error.message };
      //     }
      //   },

      // Update user profile
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await apiService.updateProfile(userData);
          set({
            user: data.user,
            isLoading: false,
          });
          return { success: true, data };
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      // update user data
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },

      // Check if user is authenticated
      isAuthenticated: () => {
        const { user } = get();
        return user ?? null;
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default userStore;
