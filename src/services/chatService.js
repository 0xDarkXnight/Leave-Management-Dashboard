import axiosInstance from "../api/axiosInstance";

export const chatService = {
  async getConversations() {
    const { data } = await axiosInstance.get("/chat/conversations");
    return data.data;
  },

  async getMessages(conversationId) {
    const { data } = await axiosInstance.get(`/chat/messages/${conversationId}`);
    return data.data;
  },

  async sendMessage({ conversationId, text }) {
    const { data } = await axiosInstance.post("/chat/messages", {
      conversationId,
      text,
    });
    return data.data;
  },

  async markAsRead(messageIds) {
    await axiosInstance.post("/chat/messages/read", { messageIds });
  },
};