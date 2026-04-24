import { Navigate, Outlet } from "react-router-dom";

const getToken = () => {
  return localStorage.getItem("access_token");
};

export function PublicRoute() {
  const token = getToken();

  // already logged in → go to dashboard
  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}