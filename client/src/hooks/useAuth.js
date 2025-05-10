import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

/**
 * Custom hook for authentication-related functionality
 * Provides convenient access to auth state and common auth operations
 */
const useAuth = () => {
  const { user, accessToken, isAuthenticated, setAuth, updateUser, logout } =
    useAuthStore();

  const navigate = useNavigate();

  /**
   * Handles user logout with navigation
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    setAuth,
    updateUser,
    logout: handleLogout,
  };
};

export default useAuth;
