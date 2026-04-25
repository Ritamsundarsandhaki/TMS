import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { taskService } from "@/services/task.service";
import { TaskStatus } from "@/types/enums";
import { FiTrash } from "react-icons/fi";
import { toastService } from "@/utils/toast.service";

function TaskList() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<any[]>([]);
  const [view, setView] = useState<"board" | "table">("board");

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(false);

  const [confirmTaskId, setConfirmTaskId] = useState<number | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);

  const totalPages = Math.ceil(total / limit);

  // ================= FETCH TASKS =================
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskService.getAllTasks({
        page,
        limit,
        status: statusFilter || undefined,
        search: search || undefined,
      });

      setTasks(res.data || []);
      setTotal(res.total || 0);
    } catch (err:any) {
        toastService.error(
        err?.response?.data?.message || "Faild Loading Data"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, [page, search, statusFilter]);

  const handleEdit = (id: number) => {
    navigate(`/tasks/${id}`);
  };

  // ================= COMPLETE TASK =================
  const handleComplete = async (id: number) => {
    try {
      await taskService.markAsCompleted(id);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, status: TaskStatus.COMPLETED, progress: 100 }
            : task
        )
      );

    toastService.success("Task completed successfully");

      setConfirmTaskId(null);
    } catch (err:any) {
    toastService.error(err?.response?.data?.message ||"Failed to complete task");
      console.error(err);
    }
  };

  // ================= DELETE TASK =================
  const handleDelete = async (id: number) => {
    try {
      await taskService.deleteTask(id);

      setTasks((prev) => prev.filter((task) => task.id !== id));

      setDeleteTaskId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= GROUP =================
  const grouped = {
    PENDING: tasks.filter((t) => t.status === TaskStatus.PENDING),
    IN_PROGRESS: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS),
    COMPLETED: tasks.filter((t) => t.status === TaskStatus.COMPLETED),
  };

  // ================= COLUMN =================
  const StatusColumn = ({ title, items, color }: any) => (
    <div className="bg-gray-100 rounded-2xl p-3 sm:p-4 w-full min-h-[60vh] shadow-sm">
      <h2 className={`font-bold mb-4 text-xs sm:text-sm uppercase ${color}`}>
        {title} ({items.length})
      </h2>

      <div className="space-y-3">
        {items.map((task: any) => (
          <div
            key={task.id}
            onClick={() => handleEdit(task.id)}
            className="bg-white p-3 sm:p-4 rounded-xl shadow border cursor-pointer hover:shadow-lg transition relative"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-sm hover:text-blue-600">
                {task.title}
              </h3>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTaskId(task.id);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash />
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-1 line-clamp-3">
              {task.description}
            </p>

            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${task.progress || 0}%` }}
              />
            </div>

            {task.status !== TaskStatus.COMPLETED && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmTaskId(task.id);
                }}
                className="mt-3 text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                ✓ Mark Completed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-3 sm:p-6 bg-gray-50">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Task Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage your tasks
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm w-full sm:w-64"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm w-full sm:w-48"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setView("board")}
              className={`px-3 py-1 rounded-md text-xs sm:text-sm ${
                view === "board" ? "bg-black text-white" : "bg-white border"
              }`}
            >
              Board
            </button>

            <button
              onClick={() => setView("table")}
              className={`px-3 py-1 rounded-md text-xs sm:text-sm ${
                view === "table" ? "bg-black text-white" : "bg-white border"
              }`}
            >
              Table
            </button>
          </div>

          <button
            onClick={() => navigate("/tasks/new")}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading tasks...
        </div>
      )}

      {/* BOARD */}
      {!loading && view === "board" && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatusColumn title="Pending" items={grouped.PENDING} color="text-gray-600" />
          <StatusColumn title="In Progress" items={grouped.IN_PROGRESS} color="text-blue-600" />
          <StatusColumn title="Completed" items={grouped.COMPLETED} color="text-green-600" />
        </div>
      )}

      {/* TABLE */}
      {!loading && view === "table" && (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => handleEdit(task.id)}
                  className="border-t cursor-pointer hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">{task.title}</td>
                  <td className="text-gray-500">{task.description}</td>
                  <td>
                    <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                      {task.status}
                    </span>
                  </td>
                  <td className="w-40 p-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${task.progress || 0}%` }}
                      />
                    </div>
                  </td>

                  <td className="p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTaskId(task.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 border rounded ${
                page === p ? "bg-black text-white" : ""
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* MODALS (UNCHANGED) */}
      {confirmTaskId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-2">Mark as Completed?</h2>
            <p className="text-sm text-gray-500 mb-4">Are you sure?</p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmTaskId(null)} className="px-3 py-1 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={() => handleComplete(confirmTaskId)} className="px-3 py-1 bg-green-600 text-white rounded">
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTaskId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-2 text-red-600">Delete Task?</h2>
            <p className="text-sm text-gray-500 mb-4">This action cannot be undone.</p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTaskId(null)} className="px-3 py-1 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteTaskId)} className="px-3 py-1 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;