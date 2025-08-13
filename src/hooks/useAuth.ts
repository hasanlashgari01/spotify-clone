import { useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";

export interface User {
  id: string;
  email: string;
  name?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const token = authService.getToken();
    if (token) {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          authService.logout();
        }
      }
    }
    setIsLoading(false);
  }, []);

  const signup = useCallback(
    async (name: string, username: string, email: string, password: string) => {
      try {
        const response = await authService.register({
          name,
          username,
          email,
          password,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    signup,
  };
};
