import axiosInstance from "../api/axiosInstance";

export const leaveService = {
  async getAll() {
    const { data } = await axiosInstance.get("/leave");
    return data.data;
  },

  async create(requestData) {
    const { data } = await axiosInstance.post("/leave", requestData);
    return data.data;
  },

  async updateStatus(id, status) {
    const { data } = await axiosInstance.patch(`/leave/${id}/status`, { status });
    return data.data;
  },

  async update(id, requestData) {
    const { data } = await axiosInstance.patch(`/leave/${id}`, requestData);
    return data.data;
  },

  async delete(id) {
    await axiosInstance.delete(`/leave/${id}`);
    return id;
  },
};