import  { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboard.service";

function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DASHBOARD =================
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getDashboard();
      setData(res);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const summary = data?.summary || {};

  // ================= SKELETON UI =================
  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">

        {/* Header Skeleton */}
        <div className="h-8 w-48 bg-gray-300 rounded"></div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow space-y-3">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>

        {/* List Skeleton */}
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <div className="h-5 w-40 bg-gray-300 rounded"></div>

          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-full bg-gray-200 rounded"></div>
          ))}
        </div>

        {/* Progress Skeleton */}
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <div className="h-5 w-40 bg-gray-300 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded-full"></div>
        </div>

      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Total Tasks</p>
          <h2 className="text-2xl font-bold">{summary.total ?? 0}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Pending</p>
          <h2 className="text-2xl font-bold">{summary.pending ?? 0}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">In Progress</p>
          <h2 className="text-2xl font-bold">{summary.inProgress ?? 0}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Completed</p>
          <h2 className="text-2xl font-bold">{summary.completed ?? 0}</h2>
        </div>
      </div>

      {/* ================= PENDING TASKS ================= */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Pending Tasks</h2>

        <ul className="space-y-2 text-sm">
          {data?.pendingTasks?.length ? (
            data.pendingTasks.map((task: any) => (
              <li key={task.id}>✔ {task.title}</li>
            ))
          ) : (
            <p className="text-gray-400">No pending tasks</p>
          )}
        </ul>
      </div>

      {/* ================= PERFORMANCE ================= */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Performance Overview</h2>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${summary.progress ?? 0}%` }}
          />
        </div>

        <p className="text-sm text-gray-500 mt-2">
          {summary.progress ?? 0}% productivity
        </p>
      </div>

    </div>
  );
}

export default Dashboard;