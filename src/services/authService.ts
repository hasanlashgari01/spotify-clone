import { httpService } from "../config/axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  username: string;
}

export interface LoginResponse {
  accessToken: string;
  ok: boolean;
  message?: string;
}

export const authService = {
  async register(credentials: RegisterCredentials): Promise<LoginResponse> {
    try {
      const response = await httpService.post<LoginResponse>(
        "/auth/register",
        credentials
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Register failed");
    }
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await httpService.post<LoginResponse>(
        "/auth/login",
        credentials
      );

      // Store token in localStorage
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  async logout(): Promise<void> {
    try {
      await httpService.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
    }
  },

  getToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
