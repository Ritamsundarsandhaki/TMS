import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";

// import TaskList from "@/features/tasks/pages/TaskList";
import NotFound from "@/features/malicious/pages/NotFound";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      // { path: "/", element: <TaskList /> },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}