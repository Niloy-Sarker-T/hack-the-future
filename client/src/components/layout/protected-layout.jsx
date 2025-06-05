import { Navigate, Outlet } from "react-router-dom";
import userStore from "@/store/user-store";

export default function ProtectedRoute({ role }) {
  const user = userStore((state) => state.user);
  if (role && role === user?.role) {
    return <Outlet />;
  }
  if (!role && user) {
    // access to all authenticated users
    return <Outlet />;
  }
  return <Navigate to="/login" replace />;
}
