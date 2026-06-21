import { useState, useEffect, useCallback, useRef } from "react";
import { NotificationContext }   from "./context";
import { socketService }         from "../chat/socketService";
import { notificationService }   from "../services/notificationService";
import { useAuth }               from "../auth/useAuth";

export function NotificationProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [notifications,    setNotifications]    = useState([]);
  const [isLoadingNotifs,  setIsLoadingNotifs]   = useState(true);
  const [notifError,       setNotifError]        = useState(null);

  const [activity,          setActivity]          = useState([]);
  const [isLoadingActivity, setIsLoadingActivity]  = useState(true);
  const [activityError,     setActivityError]      = useState(null);

  const userRef = useRef(null);
  useEffect(() => { userRef.current = user; }, [user]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    socketService.connect(user.id);

    const onNewNotification = (notification) => {
      const me = userRef.current;
      if (!me || notification.userId !== me.id) return;

      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev;
        return [notification, ...prev];
      });
    };

    const onNotificationRead = ({ notificationId }) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    };

    const onNotificationsReadAll = ({ userId }) => {
      const me = userRef.current;
      if (!me || userId !== me.id) return;
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const onNewActivity = (entry) => {
      const me = userRef.current;
      if (!me) return;
      const visible =
        me.role === "Manager" ||
        entry.userId === me.id ||
        entry.targetUserId === me.id;
      if (!visible) return;

      setActivity((prev) => {
        if (prev.some((a) => a.id === entry.id)) return prev;
        return [entry, ...prev];
      });
    };

    socketService
      .on("new_notification",       onNewNotification)
      .on("notification_read",      onNotificationRead)
      .on("notifications_read_all", onNotificationsReadAll)
      .on("new_activity",           onNewActivity);

    return () => {
      socketService
        .off("new_notification",       onNewNotification)
        .off("notification_read",      onNotificationRead)
        .off("notifications_read_all", onNotificationsReadAll)
        .off("new_activity",           onNewActivity);
      socketService.disconnect();
    };
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    notificationService
      .getAll()
      .then(({ notifications: data }) => {
        if (cancelled) return;
        setNotifications(data);
        setNotifError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setNotifError(err.message ?? "Could not load notifications.");
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoadingNotifs(false);
      });

    notificationService
      .getActivity()
      .then((data) => {
        if (cancelled) return;
        setActivity(data);
        setActivityError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setActivityError(err.message ?? "Could not load activity.");
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoadingActivity(false);
      });

    return () => { cancelled = true; };
  }, [isAuthenticated]);

  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingNotifs(true);
    setNotifError(null);
    try {
      const { notifications: data } = await notificationService.getAll();
      setNotifications(data);
    } catch (err) {
      setNotifError(err.message ?? "Could not load notifications.");
    } finally {
      setIsLoadingNotifs(false);
    }
  }, [isAuthenticated]);

  const refreshActivity = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingActivity(true);
    setActivityError(null);
    try {
      const data = await notificationService.getActivity();
      setActivity(data);
    } catch (err) {
      setActivityError(err.message ?? "Could not load activity.");
    } finally {
      setIsLoadingActivity(false);
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback(async (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    try {
      await notificationService.markAsRead(notificationId);
      socketService.broadcast("notification_read", { notificationId });
    } catch (err) {
      console.error("[Notifications] markAsRead failed:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const me = userRef.current;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await notificationService.markAllAsRead();
      if (me) socketService.broadcast("notifications_read_all", { userId: me.id });
    } catch (err) {
      console.error("[Notifications] markAllAsRead failed:", err);
    }
  }, []);

  const dismissNotification = useCallback(async (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    try {
      await notificationService.remove(notificationId);
    } catch (err) {
      console.error("[Notifications] dismiss failed:", err);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const value = {
    notifications:       isAuthenticated ? notifications      : [],
    unreadCount:          isAuthenticated ? unreadCount         : 0,
    isLoadingNotifs:       isAuthenticated && isLoadingNotifs,
    notifError:            isAuthenticated ? notifError          : null,

    activity:              isAuthenticated ? activity            : [],
    isLoadingActivity:     isAuthenticated && isLoadingActivity,
    activityError:         isAuthenticated ? activityError       : null,

    refreshNotifications,
    refreshActivity,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
