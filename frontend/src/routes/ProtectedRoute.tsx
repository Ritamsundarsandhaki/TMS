import { Navigate, Outlet } from "react-router-dom";

// 🔑 simple token check (you can improve later with redux/context)
const getToken = () => {
  return localStorage.getItem("access_token");
};

export function ProtectedRoute() {
  const token = getToken();

  // ❌ Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in → allow access
  return <Outlet />;
}