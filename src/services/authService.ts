import { httpService } from '../config/axios';

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
        '/auth/register',
        credentials
      );

      // Store token and user data
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }

      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || 'Register failed';
      throw new Error(errorMessage);
    }
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await httpService.post<LoginResponse>(
        '/auth/login',
        credentials
      );

      // Store token and user data
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }

      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  },

  logout(): void {
    localStorage.removeItem('accessToken');
  },

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  async getUser(): Promise<User | null> {
    const user = await httpService('/user/my-profile');

    return user.data;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
