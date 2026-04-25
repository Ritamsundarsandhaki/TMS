import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/stores/store";

export function ProtectedRoute() {
  const isAuthenticated = useSelector((state: RootState) => state.global.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}