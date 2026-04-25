
import type { Task } from "@/models/task.model"; 

// =======================
// Dashboard Summary Model
// =======================
export interface DashboardSummary {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  progress: number; // percentage (0-100)
}

// =======================
// Dashboard Response Model
// =======================
export interface DashboardResponse {
  summary: DashboardSummary;
  pendingTasks: Task[];
}
