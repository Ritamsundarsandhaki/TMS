import api from "@/utils/api";
import type {
  DashboardResponse,
} from "@/models/dashboard.model";

class DashboardService {
  private baseUrl = "/dashboard";

  // ================= GET DASHBOARD DATA =================
  async getDashboard(): Promise<DashboardResponse> {
    const response = await api.get<DashboardResponse>(this.baseUrl);
    return response.data;
  }

  // ================= OPTIONAL: REFRESH DASHBOARD =================
  async refreshDashboard(): Promise<DashboardResponse> {
    const response = await api.get<DashboardResponse>(`${this.baseUrl}`);
    return response.data;
  }
}

export const dashboardService = new DashboardService();