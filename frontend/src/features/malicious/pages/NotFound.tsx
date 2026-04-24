import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6">
      
      <h1 className="text-8xl font-bold text-red-500">404</h1>

      <h2 className="text-2xl font-semibold mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-400 mt-2 text-center max-w-md">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition"
      >
        Go Home
      </Link>
    </div>
  );
}