import { useState, useEffect, useCallback } from "react";
import { authService, User } from "../services/authService";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const token = authService.getToken();
    if (token) {
      const userData = authService.getUser();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // If token exists but no user data, logout
        authService.logout();
      }
    }
    setIsLoading(false);
  }, []);

  const signup = useCallback(
    async (name: string, username: string, email: string, password: string) => {
      const response = await authService.register({
        name,
        username,
        email,
        password,
      });
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
    setIsAuthenticated(true);
    return response;
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
