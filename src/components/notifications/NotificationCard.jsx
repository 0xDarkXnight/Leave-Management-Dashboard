import { getTypeMeta } from "../../notifications/notificationMeta";
import { formatRelativeTime, formatFullTimestamp } from "../../utils/dateUtils";
import { XIcon } from "../Icons";

function NotificationCard({ notification, onSelect, onDismiss, dense = false }) {
  const { Icon, accent } = getTypeMeta(notification.type);

  const handleClick = () => onSelect?.(notification);

  const handleDismissClick = (e) => {
    e.stopPropagation();
    onDismiss?.(notification);
  };

  return (
    <div
      className={`notif-card${notification.isRead ? "" : " notif-card--unread"}${dense ? " notif-card--dense" : ""}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      {!notification.isRead && <span className="notif-card-dot" aria-hidden="true" />}

      <span className={`notif-card-icon ${accent}`} aria-hidden="true">
        <Icon />
      </span>

      <div className="notif-card-body">
        <div className="notif-card-title-row">
          <span className="notif-card-title">{notification.title}</span>
          <span className="notif-card-time" title={formatFullTimestamp(notification.createdAt)}>
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        <p className="notif-card-message">{notification.message}</p>
      </div>

      {onDismiss && (
        <button
          type="button"
          className="notif-card-dismiss"
          onClick={handleDismissClick}
          aria-label="Dismiss notification"
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}

export default NotificationCard;
