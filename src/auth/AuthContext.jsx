import { useState, useCallback } from "react";
import { AuthContext } from "./context";
import { saveAuthUser, loadAuthUser, clearAuthUser } from "./storage";

const PREDEFINED_USERS = [
  {
    id:       "emp-001",
    name:     "John Doe",
    email:    "employee@lms.com",
    password: "employee123",
    role:     "Employee",
    initials: "JD",
  },
  {
    id:       "mgr-001",
    name:     "Sarah Mitchell",
    email:    "manager@lms.com",
    password: "manager123",
    role:     "Manager",
    initials: "SM",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadAuthUser());

  const login = useCallback((email, password) => {
    const found = PREDEFINED_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!found) {
      return {
        success: false,
        error: "Invalid email or password. Please check your credentials and try again.",
      };
    }

    const sessionUser = {
      id:              found.id,
      name:            found.name,
      email:           found.email,
      role:            found.role,
      initials:        found.initials,
      isAuthenticated: true,
    };

    saveAuthUser(sessionUser);
    setUser(sessionUser);
    return { success: true, user: sessionUser };
  }, []);

  const logout = useCallback(() => {
    clearAuthUser();
    setUser(null);
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