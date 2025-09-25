import { httpService } from '../config/axios';
import { ApiError } from '../types/error.types';

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
  email: string;
  username: string;
  fullName : string;
  bio : string;
  avatar : string;
  gender : string;
  
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
  async updateUser(updates :Partial<User> | FormData): Promise<string | null> {
    const result = await httpService.put("/user/my-profile" , updates, {
      headers: {
    'Content-Type': 'multipart/form-data'
  }
    });
    
    return result.data;
  },
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
