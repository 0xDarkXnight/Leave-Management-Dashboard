import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNotifications }     from "../notifications/useNotifications";
import { getNotificationRoute } from "../notifications/notificationMeta";
import NotificationCard         from "../components/notifications/NotificationCard";
import { DoubleCheckIcon, InboxIcon } from "../components/Icons";

const FILTERS = ["All", "Unread"];

function NotificationsPage() {
  const {
    notifications, unreadCount, isLoadingNotifs, notifError,
    markAsRead, markAllAsRead, dismissNotification,
  } = useNotifications();

  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const visible = useMemo(
    () => (filter === "Unread" ? notifications.filter((n) => !n.isRead) : notifications),
    [notifications, filter]
  );

  const handleSelect = (notification) => {
    if (!notification.isRead) markAsRead(notification.id);
    const route = getNotificationRoute(notification.type);
    if (route) navigate(route);
  };

  if (isLoadingNotifs) {
    return (
      <section className="page">
        <div className="page-header">
          <div className="page-header-left">
            <h1>Notifications</h1>
            <p>Loading your notifications…</p>
          </div>
        </div>
        <div className="skeleton-table" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton-row"/>)}
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Notifications</h1>
          <p>Everything that's happened across your leave requests and messages.</p>
        </div>
        <div className="page-header-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <DoubleCheckIcon />
            Mark all as read
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="notif-filter-pills">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`notif-filter-pill${filter === f ? " notif-filter-pill--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
              {f === "Unread" && unreadCount > 0 && (
                <span className="notif-filter-count">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="table-card" style={{ padding: 0, overflow: "visible" }}>
        {notifError && (
          <div className="notif-dropdown-error" style={{ padding: "16px 20px" }}>
            Couldn't load notifications. {notifError}
          </div>
        )}

        {!notifError && visible.length === 0 && (
          <div className="notif-empty-state" style={{ padding: "48px 20px" }}>
            <span className="notif-empty-icon"><InboxIcon /></span>
            <p>{filter === "Unread" ? "No unread notifications" : "No notifications yet"}</p>
            <span>New notifications will show up here.</span>
          </div>
        )}

        {!notifError && visible.map((n) => (
          <NotificationCard
            key={n.id}
            notification={n}
            onSelect={handleSelect}
            onDismiss={(notif) => dismissNotification(notif.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default NotificationsPage;
