import { getTypeMeta } from "../../notifications/notificationMeta";
import { formatRelativeTime, formatFullTimestamp } from "../../utils/dateUtils";

function ActivityItem({ activity, isLast = false }) {
  const { Icon, accent } = getTypeMeta(activity.type);

  return (
    <div className="activity-item">
      <div className="activity-item-rail">
        <span className={`activity-item-icon ${accent}`} aria-hidden="true">
          <Icon />
        </span>
        {!isLast && <span className="activity-item-line" aria-hidden="true" />}
      </div>

      <div className="activity-item-body">
        <div className="activity-item-top">
          <span className="activity-item-avatar" aria-hidden="true">
            {activity.userInitials ?? "?"}
          </span>
          <p className="activity-item-desc">{activity.description}</p>
        </div>
        <span
          className="activity-item-time"
          title={formatFullTimestamp(activity.timestamp)}
        >
          {formatRelativeTime(activity.timestamp)}
        </span>
      </div>
    </div>
  );
}

export default ActivityItem;
