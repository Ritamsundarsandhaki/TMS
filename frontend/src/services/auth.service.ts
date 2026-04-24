import api from "@/utils/api";
import type { SignupRequest,LoginRequest,LoginResponse } from "@/models/auth.model";

class AuthService {
  private baseUrl = "/auth";

  // ================= LOGIN =================
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(`${this.baseUrl}/login`, data);
    return response.data;
  }

  // ================= SIGNUP =================
  async signup(data: SignupRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(`${this.baseUrl}/signup`, data);
    return response.data;
  }

  // ================= LOGOUT =================
  async logout() {
    try {
      await api.post(`${this.baseUrl}/logout`);
    } catch (error) {
      console.warn("Logout API failed (continuing cleanup):", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.clear();
      window.location.href = "/";
    }
  }

  // ================= GET PROFILE =================
  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  }
}

export const authService = new AuthService();