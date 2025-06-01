import { Navigate, Outlet } from "react-router-dom";
import userStore from "@/store/user-store";

export default function ProtectedRoute() {
  const isAuthenticated = userStore((state) => state.user);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
