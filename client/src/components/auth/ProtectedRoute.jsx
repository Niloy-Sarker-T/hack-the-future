import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore";

/**
 * ProtectedRoute component
 *
 * Redirects unauthenticated users to the login page
 * Allows authenticated users to access protected routes
 *
 * @returns {JSX.Element} Outlet for child routes or Navigate to redirect
 */
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
