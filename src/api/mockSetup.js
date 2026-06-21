import MockAdapter from "axios-mock-adapter";
import axiosInstance from "./axiosInstance";
import { socketService } from "../chat/socketService";
import {
  loadLeaveRequests,
  saveLeaveRequests,
  loadAllChatMessages,
  loadChatMessagesByConversation,
  appendChatMessage,
  markMessagesAsRead,
  loadNotificationsForUser,
  appendNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  loadActivityForUser,
  appendActivity,
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
const isParticipant    = (userId, conversationId) =>
  getParticipantIds(conversationId).includes(userId);

const publicUser = (u) => ({
  id:        u.id,
  name:      u.name,
  email:     u.email,
  role:      u.role,
  initials:  u.initials,
  managerId: u.managerId ?? null,
});

const genId = (prefix = "notif") =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const createNotification = ({
  userId, type, title, message, metadata = {},
}) => {
  const notification = {
    id:        genId("notif"),
    userId,
    type,
    title,
    message,
    isRead:    false,
    createdAt: new Date().toISOString(),
    metadata,
  };
  appendNotification(notification);
  socketService.broadcast("new_notification", notification);
  return notification;
};

const createActivity = ({
  userId, userName, userInitials, userRole,
  type, description, metadata = {}, targetUserId,
}) => {
  const activity = {
    id:           genId("act"),
    userId,
    userName,
    userInitials,
    userRole,
    type,
    description,
    timestamp:    new Date().toISOString(),
    metadata,
    targetUserId: targetUserId ?? null,
  };
  appendActivity(activity);
  socketService.broadcast("new_activity", activity);
  return activity;
};

const findUserById = (id) => MOCK_USERS.find((u) => u.id === id) ?? null;
const findUserByName = (name) =>
  MOCK_USERS.find((u) => u.name === name) ?? null;
const findManagerFor = (employeeId) => {
  const emp = findUserById(employeeId);
  if (!emp?.managerId) return null;
  return findUserById(emp.managerId);
};

const resolveRequestEmployee = (request) =>
  findUserById(request.employeeId) ?? findUserByName(request.employeeName);

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

  createActivity({
    userId:       found.id,
    userName:     found.name,
    userInitials: found.initials,
    userRole:     found.role,
    type:         "user_login",
    description:  `${found.name} signed in`,
    metadata:     { email: found.email },
  });

  return [200, { user: publicUser(found), message: "Login successful." }];
});

mock.onPost("/auth/logout").reply((config) => {
  const userId = config.headers["X-User-Id"];
  const user   = findUserById(userId);
  if (user) {
    createActivity({
      userId:       user.id,
      userName:     user.name,
      userInitials: user.initials,
      userRole:     user.role,
      type:         "user_logout",
      description:  `${user.name} signed out`,
    });
  }
  return [200, { message: "Logged out successfully." }];
});

mock.onGet("/leave").reply(() => {
  const requests = loadLeaveRequests();
  return [200, { data: requests, total: requests.length }];
});

mock.onPost("/leave").reply((config) => {
  const body      = JSON.parse(config.data);
  const requests  = loadLeaveRequests();
  const employeeId = config.headers["X-User-Id"];
  const employee   = findUserById(employeeId);
  const manager    = findManagerFor(employeeId);

  const newRequest = {
    id:         Date.now(),
    ...body,
    employeeId: employeeId ?? body.employeeId,
    status:     "Pending",
    createdAt:  new Date().toISOString(),
  };
  saveLeaveRequests([newRequest, ...requests]);

  let employeeNotification = null;
  if (employee) {
    employeeNotification = createNotification({
      userId:   employee.id,
      type:     "leave_submitted",
      title:    "Leave Request Submitted",
      message:  `Your ${body.leaveType ?? "Leave"} request (${body.startDate} – ${body.endDate}) has been submitted and is pending approval.`,
      metadata: { leaveId: newRequest.id, leaveType: body.leaveType, startDate: body.startDate, endDate: body.endDate },
    });

    createActivity({
      userId:       employee.id,
      userName:     employee.name,
      userInitials: employee.initials,
      userRole:     employee.role,
      type:         "leave_submitted",
      description:  `${employee.name} submitted a ${body.leaveType ?? "Leave"} request`,
      metadata:     { leaveId: newRequest.id, leaveType: body.leaveType, startDate: body.startDate, endDate: body.endDate },
      targetUserId: manager?.id ?? null,
    });
  }

  if (manager) {
    createNotification({
      userId:   manager.id,
      type:     "leave_pending_review",
      title:    "New Leave Request",
      message:  `${employee?.name ?? "An employee"} submitted a ${body.leaveType ?? "Leave"} request (${body.startDate} – ${body.endDate}) awaiting your review.`,
      metadata: { leaveId: newRequest.id, leaveType: body.leaveType, startDate: body.startDate, endDate: body.endDate, employeeId, employeeName: employee?.name },
    });
  }

  return [201, {
    data:                 newRequest,
    notification:         employeeNotification,
    message:              "Leave request submitted successfully.",
  }];
});

mock.onPatch(/\/leave\/\d+\/status/).reply((config) => {
  const id         = Number(config.url.split("/")[2]);
  const { status } = JSON.parse(config.data);
  const managerId  = config.headers["X-User-Id"];
  const manager    = findUserById(managerId);
  const requests   = loadLeaveRequests();
  const updated    = requests.map((r) => (r.id === id ? { ...r, status } : r));
  saveLeaveRequests(updated);
  const result = updated.find((r) => r.id === id);
  if (!result) return [404, { message: "Leave request not found." }];

  const employee   = resolveRequestEmployee(result);
  const employeeId = employee?.id ?? null;
  const label      = status === "Approved" ? "approved" : "rejected";

  let employeeNotification = null;
  if (employee) {
    employeeNotification = createNotification({
      userId:   employee.id,
      type:     status === "Approved" ? "leave_approved" : "leave_rejected",
      title:    status === "Approved" ? "Leave Request Approved ✓" : "Leave Request Rejected",
      message:  status === "Approved"
        ? `Your ${result.leaveType ?? "Leave"} request (${result.startDate} – ${result.endDate}) was approved by ${manager?.name ?? "your manager"}.`
        : `Your ${result.leaveType ?? "Leave"} request (${result.startDate} – ${result.endDate}) was not approved by ${manager?.name ?? "your manager"}.`,
      metadata: { leaveId: id, leaveType: result.leaveType, status, startDate: result.startDate, endDate: result.endDate },
    });
  }

  if (manager) {
    createActivity({
      userId:       manager.id,
      userName:     manager.name,
      userInitials: manager.initials,
      userRole:     manager.role,
      type:         status === "Approved" ? "leave_approved" : "leave_rejected",
      description:  `${manager.name} ${label} ${employee?.name ?? "an employee"}'s ${result.leaveType ?? "Leave"} request`,
      metadata:     { leaveId: id, leaveType: result.leaveType, status, startDate: result.startDate, endDate: result.endDate },
      targetUserId: employeeId,
    });
  }

  return [200, {
    data:                 result,
    notification:         employeeNotification,
    message:              `Leave request ${label} successfully.`,
  }];
});

mock.onPatch(/\/leave\/\d+$/).reply((config) => {
  const id        = Number(config.url.split("/").pop());
  const body      = JSON.parse(config.data);
  const userId    = config.headers["X-User-Id"];
  const user      = findUserById(userId);
  const requests  = loadLeaveRequests();
  const updated   = requests.map((r) => (r.id === id ? { ...r, ...body } : r));
  saveLeaveRequests(updated);
  const result = updated.find((r) => r.id === id);
  if (!result) return [404, { message: "Leave request not found." }];

  let notification = null;
  if (user) {
    notification = createNotification({
      userId:   user.id,
      type:     "leave_updated",
      title:    "Leave Request Updated",
      message:  `Your ${result.leaveType ?? "Leave"} request (${result.startDate} – ${result.endDate}) has been updated.`,
      metadata: { leaveId: id, leaveType: result.leaveType, startDate: result.startDate, endDate: result.endDate },
    });

    createActivity({
      userId:       user.id,
      userName:     user.name,
      userInitials: user.initials,
      userRole:     user.role,
      type:         "leave_updated",
      description:  `${user.name} updated a ${result.leaveType ?? "Leave"} request`,
      metadata:     { leaveId: id, leaveType: result.leaveType },
    });
  }

  return [200, { data: result, notification, message: "Leave request updated successfully." }];
});

mock.onDelete(/\/leave\/\d+/).reply((config) => {
  const id       = Number(config.url.split("/").pop());
  const userId   = config.headers["X-User-Id"];
  const user     = findUserById(userId);
  const requests = loadLeaveRequests();
  const target   = requests.find((r) => r.id === id);
  if (!target) return [404, { message: "Leave request not found." }];
  saveLeaveRequests(requests.filter((r) => r.id !== id));

  if (user) {
    createActivity({
      userId:       user.id,
      userName:     user.name,
      userInitials: user.initials,
      userRole:     user.role,
      type:         "leave_deleted",
      description:  `${user.name} cancelled a ${target.leaveType ?? "Leave"} request`,
      metadata:     { leaveId: id, leaveType: target.leaveType },
    });
  }

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

  if (!userId)                             return [401, { message: "Unauthorized." }];
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
  const [id1, id2] = conversationId.split("_");
  const recipientId = id1 === senderId ? id2 : id1;
  const recipient   = findUserById(recipientId);

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

  if (recipient) {
    createNotification({
      userId:   recipient.id,
      type:     "message_received",
      title:    "New Message",
      message:  `${senderUser?.name ?? "Someone"}: ${text.trim().slice(0, 80)}${text.trim().length > 80 ? "…" : ""}`,
      metadata: { conversationId, senderId, senderName: senderUser?.name },
    });

    createActivity({
      userId:       senderId,
      userName:     senderUser?.name     ?? "Unknown",
      userInitials: senderUser?.initials ?? "?",
      userRole:     senderUser?.role     ?? "Unknown",
      type:         "message_sent",
      description:  `${senderUser?.name ?? "Someone"} sent a message to ${recipient.name}`,
      metadata:     { conversationId, recipientId },
      targetUserId: recipientId,
    });
  }

  return [201, { data: message, message: "Message sent." }];
});

mock.onPost("/chat/messages/read").reply((config) => {
  const userId      = config.headers["X-User-Id"];
  const { messageIds } = JSON.parse(config.data);

  if (!userId)                    return [401, { message: "Unauthorized." }];
  if (!Array.isArray(messageIds)) return [400, { message: "messageIds must be an array." }];

  markMessagesAsRead(userId, messageIds);
  return [200, { message: "Messages marked as read." }];
});

mock.onGet("/notifications").reply((config) => {
  const userId = config.headers["X-User-Id"];
  if (!userId) return [401, { message: "Unauthorized." }];
  const notifications = loadNotificationsForUser(userId);
  const unreadCount   = notifications.filter((n) => !n.isRead).length;
  return [200, { data: notifications, unreadCount, total: notifications.length }];
});

mock.onPost("/notifications/read-all").reply((config) => {
  const userId = config.headers["X-User-Id"];
  if (!userId) return [401, { message: "Unauthorized." }];
  markAllNotificationsRead(userId);
  socketService.broadcast("notifications_read_all", { userId });
  return [200, { message: "All notifications marked as read." }];
});

mock.onPatch(/\/notifications\/[^/]+\/read/).reply((config) => {
  const parts = config.url.split("/");
  const notifId = parts[parts.length - 2]; 
  if (!notifId) return [400, { message: "Notification ID required." }];
  markNotificationRead(notifId);
  socketService.broadcast("notification_read", { notificationId: notifId });
  return [200, { message: "Notification marked as read." }];
});

mock.onDelete(/\/notifications\/[^/]+$/).reply((config) => {
  const parts   = config.url.split("/");
  const notifId = parts[parts.length - 1];
  if (!notifId) return [400, { message: "Notification ID required." }];
  removeNotification(notifId);
  return [200, { message: "Notification removed." }];
});

mock.onGet("/activity").reply((config) => {
  const userId = config.headers["X-User-Id"];
  const role   = config.headers["X-User-Role"];
  if (!userId) return [401, { message: "Unauthorized." }];
  const activities = loadActivityForUser(userId, role);
  return [200, { data: activities, total: activities.length }];
});
