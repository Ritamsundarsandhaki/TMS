import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
  // ✅ PUBLIC ROUTES
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  // ✅ PROTECTED ROUTES (with sidebar layout)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProtectedLayout />, // sidebar + outlet
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          // add more protected pages here
           { path: "/tasks/:id", element: <AddTasks /> },
          { path: "/tasks", element: <TaskList /> },
        ],
      },
    ],
  },

  // ❌ NOT FOUND
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}