import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import NotFound from "@/features/malicious/pages/NotFound";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

import AddTasks from "@/features/tasks/pages/AddTasks";
import TaskList from "@/features/tasks/pages/TaskList";

const router = createBrowserRouter([
  // ================= PUBLIC ROUTES =================
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  // ================= PROTECTED ROUTES =================
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/tasks", element: <TaskList /> },
          { path: "/tasks/:id", element: <AddTasks /> },
          { path: "/", element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },

  // ================= NOT FOUND =================
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}