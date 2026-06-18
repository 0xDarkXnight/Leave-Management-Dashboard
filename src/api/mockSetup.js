import MockAdapter from "axios-mock-adapter";
import axiosInstance from "./axiosInstance";
import {
  loadLeaveRequests,
  saveLeaveRequests,
  loadAllChatMessages,
  loadChatMessagesByConversation,
  appendChatMessage,
  markMessagesAsRead,
} from "../auth/storage";

const MOCK_USERS = [
  {
    id:        "emp-001",
    name:      "John Doe",
    email:     "employee@lms.com",
    password:  "employee123",
    role:      "Employee",
    initials:  "JD",
    managerId: "mgr-001",
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

const getConversationId = (id1, id2) => [id1, id2].sort().join("_");

const getParticipantIds = (conversationId) => conversationId.split("_");

const isParticipant = (userId, conversationId) =>
  getParticipantIds(conversationId).includes(userId);

const publicUser = (u) => ({
  id:        u.id,
  name:      u.name,
  email:     u.email,
  role:      u.role,
  initials:  u.initials,
  managerId: u.managerId ?? null,
});

const mock = new MockAdapter(axiosInstance, { delayResponse: 400 });

mock.onPost("/auth/login").reply((config) => {
  const { email, password } = JSON.parse(config.data);
  const found = MOCK_USERS.find(
    (u) =>
      u.email.toLowerCase() === email?.trim().toLowerCase() &&
      u.password === password
  );

  if (!found) {
    return [
      401,
      { message: "Invalid email or password. Please check your credentials and try again." },
    ];
  }

  return [200, { user: publicUser(found), message: "Login successful." }];
});

mock.onPost("/auth/logout").reply(200, { message: "Logged out successfully." });

mock.onGet("/leave").reply(() => {
  const requests = loadLeaveRequests();
  return [200, { data: requests, total: requests.length }];
});

mock.onPost("/leave").reply((config) => {
  const body     = JSON.parse(config.data);
  const requests = loadLeaveRequests();
  const newRequest = {
    id:        Date.now(),
    ...body,
    status:    "Pending",
    createdAt: new Date().toISOString(),
  };
  saveLeaveRequests([newRequest, ...requests]);
  return [201, { data: newRequest, message: "Leave request submitted successfully." }];
});

mock.onPatch(/\/leave\/\d+\/status/).reply((config) => {
  const id       = Number(config.url.split("/")[2]);
  const { status } = JSON.parse(config.data);
  const requests = loadLeaveRequests();
  const updated  = requests.map((r) => (r.id === id ? { ...r, status } : r));
  saveLeaveRequests(updated);
  const result = updated.find((r) => r.id === id);
  if (!result) return [404, { message: "Leave request not found." }];
  return [200, { data: result, message: `Leave request ${status.toLowerCase()} successfully.` }];
});

mock.onPatch(/\/leave\/\d+$/).reply((config) => {
  const id       = Number(config.url.split("/").pop());
  const body     = JSON.parse(config.data);
  const requests = loadLeaveRequests();
  const updated  = requests.map((r) => (r.id === id ? { ...r, ...body } : r));
  saveLeaveRequests(updated);
  const result = updated.find((r) => r.id === id);
  if (!result) return [404, { message: "Leave request not found." }];
  return [200, { data: result, message: "Leave request updated successfully." }];
});

mock.onDelete(/\/leave\/\d+/).reply((config) => {
  const id       = Number(config.url.split("/").pop());
  const requests = loadLeaveRequests();
  const existed  = requests.some((r) => r.id === id);
  if (!existed) return [404, { message: "Leave request not found." }];
  saveLeaveRequests(requests.filter((r) => r.id !== id));
  return [200, { message: "Leave request deleted successfully." }];
});

mock.onGet("/chat/conversations").reply((config) => {
  const userId = config.headers["X-User-Id"];
  const role   = config.headers["X-User-Role"];

  if (!userId) return [401, { message: "Unauthorized." }];

  const me = MOCK_USERS.find((u) => u.id === userId);
  if (!me) return [404, { message: "User not found." }];

  let conversationIds = [];

  if (role === "Employee") {
    const managerId = me.managerId;
    if (managerId) conversationIds.push(getConversationId(userId, managerId));
  } else if (role === "Manager") {
    const employees = MOCK_USERS.filter((u) => u.managerId === userId);
    conversationIds = employees.map((emp) => getConversationId(userId, emp.id));
  }

  const allMessages = loadAllChatMessages();

  const conversations = conversationIds.map((convId) => {
    const convMessages = allMessages.filter((m) => m.conversationId === convId);
    const lastMessage  = convMessages[convMessages.length - 1] ?? null;
    const unreadCount  = convMessages.filter(
      (m) => m.senderId !== userId && !m.readBy.includes(userId)
    ).length;

    const [id1, id2]  = convId.split("_");
    const otherId     = id1 === userId ? id2 : id1;
    const otherDbUser = MOCK_USERS.find((u) => u.id === otherId);

    return {
      id:           convId,
      otherUser:    otherDbUser ? publicUser(otherDbUser) : null,
      lastMessage,
      unreadCount,
      messageCount: convMessages.length,
    };
  });

  return [200, { data: conversations }];
});

mock.onGet(/^\/chat\/messages\/[^/]+$/).reply((config) => {
  const userId         = config.headers["X-User-Id"];
  const conversationId = config.url.replace("/chat/messages/", "");

  if (!userId)                          return [401, { message: "Unauthorized." }];
  if (!isParticipant(userId, conversationId))
    return [403, { message: "Access denied: you are not part of this conversation." }];

  const msgs = loadChatMessagesByConversation(conversationId);
  return [200, { data: msgs }];
});

mock.onPost("/chat/messages").reply((config) => {
  const senderId = config.headers["X-User-Id"];
  const { conversationId, text } = JSON.parse(config.data);

  if (!senderId)     return [401, { message: "Unauthorized." }];
  if (!text?.trim()) return [400, { message: "Message text is required." }];
  if (!isParticipant(senderId, conversationId))
    return [403, { message: "Access denied: you are not part of this conversation." }];

  const senderUser = MOCK_USERS.find((u) => u.id === senderId);

  const message = {
    id:             `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    conversationId,
    senderId,
    senderName:     senderUser?.name     ?? "Unknown",
    senderInitials: senderUser?.initials ?? "?",
    senderRole:     senderUser?.role     ?? "Unknown",
    text:           text.trim(),
    timestamp:      new Date().toISOString(),
    readBy:         [senderId],
  };

  appendChatMessage(message);
  return [201, { data: message, message: "Message sent." }];
});

mock.onPost("/chat/messages/read").reply((config) => {
  const userId     = config.headers["X-User-Id"];
  const { messageIds } = JSON.parse(config.data);

  if (!userId)                   return [401, { message: "Unauthorized." }];
  if (!Array.isArray(messageIds)) return [400, { message: "messageIds must be an array." }];

  markMessagesAsRead(userId, messageIds);
  return [200, { message: "Messages marked as read." }];
});