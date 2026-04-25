import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { taskService } from "@/services/task.service";
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
} from "@/models/task.model";

import { TaskStatus } from "@/types/enums";

function AddTasks() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id && id !== "new");

  const [form, setForm] = useState<CreateTaskRequest>({
    title: "",
    description: "",
    progress: 0,
    status: TaskStatus.PENDING,
  });

  const [loading, setLoading] = useState(false);

  // ================= LOAD =================
  useEffect(() => {
    if (isEditMode && id) {
      (async () => {
        const res = await taskService.getTaskById(id);

        setForm({
          title: res.data?.title ?? "",
          description: res.data?.description ?? "",
          progress: res.data?.progress ?? 0,
          status: res.data?.status ?? TaskStatus.PENDING,
        });
      })();
    }
  }, [id, isEditMode]);

  // ================= CHANGE =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "progress" ? Number(value) : value,
    }));
  };

  const handleStatusChange = (status: TaskStatus) => {
    setForm((prev) => ({ ...prev, status }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: CreateTaskRequest | UpdateTaskRequest = {
        title: form.title,
        description: form.description,
        progress: form.progress,
        status: form.status,
      };

      if (isEditMode && id) {
        await taskService.updateTask(Number(id), payload);
      } else {
        await taskService.createTask(payload as CreateTaskRequest);
      }

      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const safeStatus = form.status ?? TaskStatus.PENDING;
  const safeProgress = form.progress ?? 0;

  const getProgressColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return "bg-gray-400";
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-500";
      case TaskStatus.COMPLETED:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getBadgeColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return "bg-gray-100 text-gray-700";
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-700";
      case TaskStatus.COMPLETED:
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">

        {/* ================= LEFT SIDE ================= */}
        <Card className="rounded-2xl shadow-xl bg-white">

          {/* HEADER WITH CANCEL BUTTON */}
          <CardHeader>
            <div className="flex justify-between items-center">

              <div>
                <h2 className="text-xl font-bold">
                  {isEditMode ? "Update Task" : "Create Task"}
                </h2>
                <p className="text-sm text-gray-500">
                  Edit your task details
                </p>
              </div>

              {/* CANCEL BUTTON */}
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                title="Cancel"
              >
                <X size={20} />
              </button>

            </div>
          </CardHeader>

          <CardContent className="space-y-4">

            <Input
              name="title"
              placeholder="Task title"
              value={form.title}
              onChange={handleChange}
            />

            <Textarea
              name="description"
              placeholder="Task description"
              value={form.description}
              onChange={handleChange}
            />

            <div>
              <label className="text-sm">
                Progress: {safeProgress}%
              </label>

              <input
                type="range"
                name="progress"
                min="0"
                max="100"
                value={safeProgress}
                onChange={handleChange}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {Object.values(TaskStatus).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-1 rounded-full text-xs border transition
                    ${
                      safeStatus === status
                        ? "bg-blue-600 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Task"
                : "Create Task"}
            </Button>

          </CardContent>
        </Card>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex justify-center">

          <div className="w-full max-w-sm">

            <p className="text-sm text-gray-500 mb-2">
              Live Preview
            </p>

            <div className="bg-white rounded-xl shadow-lg p-4 border">

              <h3 className="font-semibold text-lg">
                {form.title || "Untitled Task"}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {form.description || "No description"}
              </p>

              {/* PROGRESS BAR */}
              <div className="mt-4">

                <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full transition-all duration-300 ${getProgressColor(
                      safeStatus
                    )}`}
                    style={{ width: `${safeProgress}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{safeProgress}%</span>
                  <span className="capitalize">
                    {safeStatus.replace("_", " ")}
                  </span>
                </div>

              </div>

              {/* STATUS BADGE */}
              <div className="mt-3">
                <span
                  className={`text-xs px-2 py-1 rounded ${getBadgeColor(
                    safeStatus
                  )}`}
                >
                  {safeStatus}
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AddTasks;