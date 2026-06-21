import { useState, useEffect, useCallback, useRef } from "react";
import { ChatContext }   from "./chatContext";
import { socketService } from "./socketService";
import { chatService }   from "../services/chatService";
import { useAuth }       from "../auth/useAuth";
import { useNotifications } from "../notifications/useNotifications";

export function ChatProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const { refreshActivity }       = useNotifications();
  const [conversations,        setConversations]        = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages,             setMessages]             = useState({});
  const [presenceMap,          setPresenceMap]          = useState({});
  const [typingMap,            setTypingMap]            = useState({});
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages,      setIsLoadingMessages]      = useState(false);
  const [isSending,              setIsSending]              = useState(false);
  const [convError,              setConvError]              = useState(null);

  const activeConvIdRef     = useRef(null);
  const userRef             = useRef(null);
  const typingTimers        = useRef({});
  const loadedConversations = useRef(new Set());

  useEffect(() => { activeConvIdRef.current = activeConversationId; }, [activeConversationId]);
  useEffect(() => { userRef.current = user; },                        [user]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    socketService.connect(user.id);

    const onNewMessage = (message) => {
      setMessages((prev) => {
        const existing = prev[message.conversationId] || [];
        if (existing.some((m) => m.id === message.id)) return prev;
        return {
          ...prev,
          [message.conversationId]: [...existing, message],
        };
      });

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== message.conversationId) return c;
          const isActive = message.conversationId === activeConvIdRef.current;
          return {
            ...c,
            lastMessage: message,
            unreadCount: isActive ? 0 : (c.unreadCount || 0) + 1,
          };
        })
      );
    };

    const onTypingStart = ({ userId, conversationId }) => {
      const me = userRef.current;
      if (!me || userId === me.id) return;

      const key = `${conversationId}_${userId}`;
      clearTimeout(typingTimers.current[key]);

      setTypingMap((prev) => ({ ...prev, [conversationId]: userId }));

      typingTimers.current[key] = setTimeout(() => {
        setTypingMap((prev) => {
          if (prev[conversationId] !== userId) return prev;
          const next = { ...prev };
          delete next[conversationId];
          return next;
        });
      }, 3500);
    };

    const onTypingStop = ({ userId, conversationId }) => {
      const me = userRef.current;
      if (!me || userId === me.id) return;

      const key = `${conversationId}_${userId}`;
      clearTimeout(typingTimers.current[key]);
      delete typingTimers.current[key];

      setTypingMap((prev) => {
        if (prev[conversationId] !== userId) return prev;
        const next = { ...prev };
        delete next[conversationId];
        return next;
      });
    };

    const markOnline = (userId) => {
      setPresenceMap((prev) => ({ ...prev, [userId]: "online" }));
      socketService.resetPresenceTimer(userId, (uid) => {
        setPresenceMap((prev) => ({ ...prev, [uid]: "offline" }));
      });
    };
    const markOffline = (userId) => {
      socketService.clearPresenceTimer(userId);
      setPresenceMap((prev) => ({ ...prev, [userId]: "offline" }));
    };

    const onPresenceOnline    = ({ userId }) => markOnline(userId);
    const onPresenceHeartbeat = ({ userId }) => markOnline(userId);
    const onPresenceAway      = ({ userId }) => markOffline(userId);
    const onPresenceOffline   = ({ userId }) => markOffline(userId);

    const onMessagesRead = ({ conversationId, readerId, messageIds }) => {
      const me = userRef.current;
      if (!me || readerId === me.id) return;

      setMessages((prev) => {
        const convMessages = prev[conversationId];
        if (!convMessages) return prev;
        return {
          ...prev,
          [conversationId]: convMessages.map((m) => {
            if (messageIds.includes(m.id) && !m.readBy.includes(readerId)) {
              return { ...m, readBy: [...m.readBy, readerId] };
            }
            return m;
          }),
        };
      });
    };

    socketService
      .on("new_message",        onNewMessage)
      .on("typing_start",       onTypingStart)
      .on("typing_stop",        onTypingStop)
      .on("presence_online",    onPresenceOnline)
      .on("presence_heartbeat", onPresenceHeartbeat)
      .on("presence_away",      onPresenceAway)
      .on("presence_offline",   onPresenceOffline)
      .on("messages_read",      onMessagesRead);

    return () => {
      socketService
        .off("new_message",        onNewMessage)
        .off("typing_start",       onTypingStart)
        .off("typing_stop",        onTypingStop)
        .off("presence_online",    onPresenceOnline)
        .off("presence_heartbeat", onPresenceHeartbeat)
        .off("presence_away",      onPresenceAway)
        .off("presence_offline",   onPresenceOffline)
        .off("messages_read",      onMessagesRead);
      socketService.disconnect();

      Object.values(typingTimers.current).forEach(clearTimeout);
      typingTimers.current = {};
    };
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadedConversations.current.clear();

    if (!isAuthenticated) return;

    let cancelled = false;

    chatService
      .getConversations()
      .then((data) => {
        if (cancelled) return;
        setConversations(data);
        setConvError(null);
        setIsLoadingConversations(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setConvError(err.message ?? "Could not load conversations.");
        setIsLoadingConversations(false);
      });

    return () => { cancelled = true; };
  }, [isAuthenticated]);

  const loadConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingConversations(true);
    setConvError(null);
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (err) {
      setConvError(err.message ?? "Could not load conversations.");
    } finally {
      setIsLoadingConversations(false);
    }
  }, [isAuthenticated]);

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId || !user) return;
    setIsLoadingMessages(true);
    try {
      const data = await chatService.getMessages(conversationId);
      setMessages((prev) => ({ ...prev, [conversationId]: data }));
      loadedConversations.current.add(conversationId);

      const unreadIds = data
        .filter((m) => m.senderId !== user.id && !m.readBy.includes(user.id))
        .map((m) => m.id);

      if (unreadIds.length > 0) {
        await chatService.markAsRead(unreadIds);
        socketService.broadcast("messages_read", {
          conversationId,
          readerId: user.id,
          messageIds: unreadIds,
        });
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
        );
      }
    } catch (err) {
      console.error("[Chat] Failed to load messages:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [user]);

  const openConversation = useCallback((conversationId) => {
    setActiveConversationId(conversationId);
    if (!loadedConversations.current.has(conversationId)) {
      loadMessages(conversationId);
    }
  }, [loadMessages]);

  const sendMessage = useCallback(async (text) => {
    if (!text?.trim() || !activeConversationId || !user) return false;

    const trimmed      = text.trim();
    const optimisticId = `optimistic_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const optimistic   = {
      id:             optimisticId,
      conversationId: activeConversationId,
      senderId:       user.id,
      senderName:     user.name,
      senderInitials: user.initials,
      senderRole:     user.role,
      text:           trimmed,
      timestamp:      new Date().toISOString(),
      readBy:         [user.id],
      isOptimistic:   true,
    };

    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), optimistic],
    }));

    setIsSending(true);
    try {
      const real = await chatService.sendMessage({
        conversationId: activeConversationId,
        text: trimmed,
      });

      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: (prev[activeConversationId] || []).map((m) =>
          m.id === optimisticId ? real : m
        ),
      }));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId ? { ...c, lastMessage: real } : c
        )
      );

      socketService.broadcast("new_message", real);
      refreshActivity();

      return true;
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [activeConversationId]: (prev[activeConversationId] || []).filter(
          (m) => m.id !== optimisticId
        ),
      }));
      console.error("[Chat] Send failed:", err);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [activeConversationId, user, refreshActivity]);

  const sendTypingStart = useCallback(() => {
    if (!activeConversationId || !user) return;
    socketService.broadcast("typing_start", {
      userId: user.id,
      conversationId: activeConversationId,
    });
  }, [activeConversationId, user]);

  const sendTypingStop = useCallback(() => {
    if (!activeConversationId || !user) return;
    socketService.broadcast("typing_stop", {
      userId: user.id,
      conversationId: activeConversationId,
    });
  }, [activeConversationId, user]);

  const markConversationRead = useCallback(async (conversationId) => {
    if (!user) return;
    const convMessages = messages[conversationId] || [];
    const unreadIds = convMessages
      .filter((m) => m.senderId !== user.id && !m.readBy.includes(user.id))
      .map((m) => m.id);
    if (unreadIds.length === 0) return;

    try {
      await chatService.markAsRead(unreadIds);
      socketService.broadcast("messages_read", {
        conversationId,
        readerId: user.id,
        messageIds: unreadIds,
      });
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err) {
      console.error("[Chat] markConversationRead failed:", err);
    }
  }, [messages, user]);

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const value = {
    conversations:        isAuthenticated ? conversations        : [],
    activeConversationId: isAuthenticated ? activeConversationId : null,
    messages:             isAuthenticated ? messages             : {},
    presenceMap:          isAuthenticated ? presenceMap          : {},
    typingMap:            isAuthenticated ? typingMap            : {},
    totalUnread:          isAuthenticated ? totalUnread          : 0,
    isLoadingConversations: isAuthenticated && isLoadingConversations,
    isLoadingMessages,
    isSending,
    convError:            isAuthenticated ? convError            : null,
    loadConversations,
    openConversation,
    sendMessage,
    sendTypingStart,
    sendTypingStop,
    markConversationRead,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}