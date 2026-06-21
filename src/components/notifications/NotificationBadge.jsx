function NotificationBadge({ count, max = 9, className = "" }) {
  if (!count || count <= 0) return null;

  return (
    <span className={`notif-badge ${className}`.trim()} aria-hidden="true">
      {count > max ? `${max}+` : count}
    </span>
  );
}

export default NotificationBadge;
