import axiosInstance   from "../api/axiosInstance";
import { loadAuthUser, saveAuthUser, clearAuthUser } from "../auth/storage";

export const authService = {
  async login(email, password) {
    const { data } = await axiosInstance.post("/auth/login", { email, password });

    const sessionUser = {
      ...data.user,
      isAuthenticated: true,
    };

    saveAuthUser(sessionUser);
    return sessionUser;
  },

  async logout() {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      clearAuthUser();
    }
  },

  getCurrentUser() {
    return loadAuthUser();
  },
};