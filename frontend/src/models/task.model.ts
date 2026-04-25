import { TaskStatus, TaskPriority } from "@/types/enums";

// =======================
// Request Model
// =======================
export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  progress?: number; // 0 - 100
  dueDate?: string; // ISO string
}

// =======================
// Update Task Request (optional but useful)
// =======================
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  progress?: number;
  dueDate?: string;
}

// =======================
// Task Model (DB Response)
// =======================
export interface Task {
  id: string;
  title: string;
  description?: string;

  status: TaskStatus;
  priority: TaskPriority;

  progress: number;

  dueDate?: string;

  createdAt: string;
  updatedAt: string;

  userId?: string;
}

// =======================
// API Response Models
// =======================
export interface TaskResponse {
  data: Task;
  message?: string;
}

export interface TaskListResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}