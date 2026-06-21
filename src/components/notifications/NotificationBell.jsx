import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useNotifications }      from "../../notifications/useNotifications";
import { useClickOutside }       from "../../hooks/useClickOutside";
import { getNotificationRoute }  from "../../notifications/notificationMeta";
import NotificationBadge         from "./NotificationBadge";
import NotificationDropdown      from "./NotificationDropdown";
import { BellIcon } from "../Icons";

function NotificationBell() {
  const {
    notifications, unreadCount, isLoadingNotifs, notifError,
    markAsRead, markAllAsRead, dismissNotification,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate    = useNavigate();

  const close = useCallback(() => setIsOpen(false), []);
  useClickOutside(wrapperRef, close, isOpen);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSelect = (notification) => {
    if (!notification.isRead) markAsRead(notification.id);
    setIsOpen(false);
    const route = getNotificationRoute(notification.type);
    if (route) navigate(route);
  };

  const handleDismiss = (notification) => dismissNotification(notification.id);

  const handleViewAll = () => {
    setIsOpen(false);
    navigate("/notifications");
  };

  return (
    <div className="notif-bell-wrap" ref={wrapperRef}>
      <button
        className="hdr-icon-btn"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
        onClick={handleToggle}
      >
        <BellIcon />
        <NotificationBadge count={unreadCount} />
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          isLoading={isLoadingNotifs}
          error={notifError}
          unreadCount={unreadCount}
          onMarkAllRead={markAllAsRead}
          onSelect={handleSelect}
          onDismiss={handleDismiss}
          onViewAll={handleViewAll}
        />
      )}
    </div>
  );
}

export default NotificationBell;
