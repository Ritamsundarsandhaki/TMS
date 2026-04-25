import api from "@/utils/api";
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
  TaskListResponse,
} from "@/models/task.model";

class TaskService {
  private baseUrl = "/tasks";

  // ================= CREATE TASK =================
  async createTask(data: CreateTaskRequest): Promise<TaskResponse> {
    const response = await api.post<TaskResponse>(`${this.baseUrl}`, data);
    return response.data;
  }

  async getAllTasks(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<TaskListResponse> {
    const response = await api.get<TaskListResponse>(this.baseUrl, {
      params,
    });

    return response.data;
  }

  // ================= MARK AS COMPLETED =================
  async markAsCompleted(id:number): Promise<TaskResponse> {
    const response = await api.patch<TaskResponse>(
      `${this.baseUrl}/${id}/complete`,
    );

    return response.data;
  }

  // ================= GET SINGLE TASK =================
  async getTaskById(id: string): Promise<TaskResponse> {
    const response = await api.get<TaskResponse>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // ================= UPDATE TASK =================
  async updateTask(id:number, data: UpdateTaskRequest): Promise<TaskResponse> {
    const response = await api.patch<TaskResponse>(
      `${this.baseUrl}/${id}`,
      data,
    );
    return response.data;
  }

  // ================= DELETE TASK =================
  async deleteTask(id:number): Promise<{ message: string }> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // ================= CHANGE STATUS =================
  async updateStatus(id: string, status: string): Promise<TaskResponse> {
    const response = await api.patch<TaskResponse>(
      `${this.baseUrl}/${id}/status`,
      { status },
    );
    return response.data;
  }
}

export const taskService = new TaskService();
