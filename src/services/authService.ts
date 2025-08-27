import { httpService } from "../config/axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  username: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  profileImage?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
  message?: string;
}

export interface RegisterResponse {
  accessToken: string;
  user: User;
  message?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const authService = {
  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await httpService.post<RegisterResponse>(
        "/auth/register",
        credentials
      );

      // Store token and user data
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || "Register failed";
      throw new Error(errorMessage);
    }
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await httpService.post<LoginResponse>(
        "/auth/login",
        credentials
      );

      // Store token and user data
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || "Login failed";
      throw new Error(errorMessage);
    }
  },

  async logout(): Promise<void> {
    try {
      await httpService.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  },

  getToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  getUser(): User | null {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
