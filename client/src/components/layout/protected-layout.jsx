import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "@/store/user-store";

export default function ProtectedRoute() {
  const isAuthenticated = useUserStore((state) => !!state.token);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
