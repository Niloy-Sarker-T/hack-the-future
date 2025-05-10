import { createContext, useContext, useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { setAuthToken } from "@/lib/axios-setup";

// Create auth context
const AuthContext = createContext();

/**
 * AuthProvider component to make authentication state and functions
 * available throughout the application
 */
export const AuthProvider = ({ children }) => {
  const { user, accessToken, isAuthenticated, setAuth, updateUser, logout } =
    useAuthStore();

  // Initialize token and validate session on app startup
  useEffect(() => {
    // Set the token in axios-setup when the component mounts
    if (accessToken) {
      setAuthToken(accessToken);
    }

    const validateSession = async () => {
      // Only attempt validation if we have a token
      if (accessToken) {
        try {
          // You can add an API endpoint to validate the token
          // const res = await axiosInstance.get('/api/auth/validate-session');
          // If validation fails, you can logout the user
        } catch (error) {
          // If there's an error, clear auth state
          logout();
        }
      }
    };

    validateSession();
  }, [accessToken, logout]);

  // Values to expose through context
  const authContextValue = {
    user,
    isAuthenticated,
    accessToken,
    updateUser,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
