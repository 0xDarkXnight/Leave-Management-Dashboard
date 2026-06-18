const AUTH_KEY        = "lms_auth_user";
const LEAVE_KEY       = "lms_leave_requests";
const LEGACY_ROLE_KEY = "lms_role";

export const saveAuthUser = (user) => {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch {
    console.error("[LMS] Could not save auth session.");
  }
};

export const loadAuthUser = () => {
  try {
    if (localStorage.getItem(LEGACY_ROLE_KEY)) {
      localStorage.removeItem(LEGACY_ROLE_KEY);
    }
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.isAuthenticated && parsed?.id && parsed?.role ? parsed : null;
  } catch {
    return null;
  }
};

export const clearAuthUser = () => {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    console.error("[LMS] Could not clear auth session.");
  }
};

export const loadLeaveRequests = () => {
  try {
    const raw = localStorage.getItem(LEAVE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveLeaveRequests = (requests) => {
  try {
    localStorage.setItem(LEAVE_KEY, JSON.stringify(requests));
  } catch {
    console.error("[LMS] Could not save leave requests.");
  }
};

const CHAT_MESSAGES_KEY = "lms_chat_messages";

export const loadAllChatMessages = () => {
  try {
    const raw = localStorage.getItem(CHAT_MESSAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const loadChatMessagesByConversation = (conversationId) =>
  loadAllChatMessages().filter((m) => m.conversationId === conversationId);

export const saveAllChatMessages = (messages) => {
  try {
    localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
  } catch {
    console.error("[LMS] Could not save chat messages.");
  }
};

export const appendChatMessage = (message) => {
  const all = loadAllChatMessages();
  saveAllChatMessages([...all, message]);
};

export const markMessagesAsRead = (userId, messageIds) => {
  const all     = loadAllChatMessages();
  const idSet   = new Set(messageIds);
  const updated = all.map((m) => {
    if (idSet.has(m.id) && !m.readBy.includes(userId)) {
      return { ...m, readBy: [...m.readBy, userId] };
    }
    return m;
  });
  saveAllChatMessages(updated);
};