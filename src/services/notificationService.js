import axiosInstance from "../api/axiosInstance";

export const notificationService = {
  async getAll() {
    const { data } = await axiosInstance.get("/notifications");
    return {
      notifications: data.data ?? [],
      unreadCount:   data.unreadCount ?? 0,
    };
  },

  async markAsRead(notificationId) {
    await axiosInstance.patch(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead() {
    await axiosInstance.post("/notifications/read-all");
  },

  async remove(notificationId) {
    await axiosInstance.delete(`/notifications/${notificationId}`);
  },

  async getActivity() {
    const { data } = await axiosInstance.get("/activity");
    return data.data ?? [];
  },
};
