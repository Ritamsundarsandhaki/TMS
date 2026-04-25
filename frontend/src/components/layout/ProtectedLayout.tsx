import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";

export default function ProtectedLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">

      {/* Overlay (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-white z-50
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:shadow-none shadow-lg
        `}
      >
        <Sidebar open={open} setOpen={setOpen} />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col h-full min-w-0">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
          <button
            onClick={() => setOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>

          <h1 className="font-semibold">Dashboard</h1>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}