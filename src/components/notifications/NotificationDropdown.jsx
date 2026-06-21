import NotificationCard from "./NotificationCard";
import { DoubleCheckIcon, InboxIcon } from "../Icons";

function DropdownSkeleton() {
  return (
    <div className="notif-skeleton-list" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="notif-skeleton-row">
          <div className="notif-skeleton-circle" />
          <div className="notif-skeleton-lines">
            <div className="notif-skeleton-line notif-skeleton-line--wide" />
            <div className="notif-skeleton-line notif-skeleton-line--narrow" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationDropdown({
  notifications,
  isLoading,
  error,
  unreadCount,
  onMarkAllRead,
  onSelect,
  onDismiss,
  onViewAll,
}) {
  const visible = notifications.slice(0, 8);

  return (
    <div className="notif-dropdown" role="menu" aria-label="Notifications">
      <div className="notif-dropdown-header">
        <span className="notif-dropdown-title">Notifications</span>
        <button
          type="button"
          className="notif-mark-all-btn"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
        >
          <DoubleCheckIcon />
          Mark all as read
        </button>
      </div>

      <div className="notif-dropdown-list">
        {isLoading && <DropdownSkeleton />}

        {!isLoading && error && (
          <div className="notif-dropdown-error">
            Couldn't load notifications. {error}
          </div>
        )}

        {!isLoading && !error && visible.length === 0 && (
          <div className="notif-empty-state">
            <span className="notif-empty-icon"><InboxIcon /></span>
            <p>You're all caught up</p>
            <span>New notifications will show up here.</span>
          </div>
        )}

        {!isLoading && !error && visible.map((n) => (
          <NotificationCard
            key={n.id}
            notification={n}
            onSelect={onSelect}
            onDismiss={onDismiss}
            dense
          />
        ))}
      </div>

      <div className="notif-dropdown-footer">
        <button type="button" className="notif-view-all-btn" onClick={onViewAll}>
          View all notifications
        </button>
      </div>
    </div>
  );
}

export default NotificationDropdown;
