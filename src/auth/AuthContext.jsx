import { useState, useCallback } from "react";
import { AuthContext }  from "./context";
import { authService } from "../services/authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());

  const login = useCallback(async (email, password) => {
    try {
      const sessionUser = await authService.login(email, password);
      setUser(sessionUser);
      return { success: true, user: sessionUser };
    } catch (err) {
      return {
        success: false,
        error: err.message ?? "Login failed. Please try again.",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user?.isAuthenticated,
    isEmployee:      user?.role === "Employee",
    isManager:       user?.role === "Manager",
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}