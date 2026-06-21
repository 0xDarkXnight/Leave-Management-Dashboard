import ActivityItem from "./ActivityItem";
import { ActivityIcon } from "../Icons";

function TimelineSkeleton() {
  return (
    <div className="activity-skeleton" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="activity-skeleton-row">
          <div className="activity-skeleton-circle" />
          <div className="activity-skeleton-lines">
            <div className="activity-skeleton-line activity-skeleton-line--wide" />
            <div className="activity-skeleton-line activity-skeleton-line--narrow" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityTimeline({ activities, isLoading, error, limit }) {
  const visible = limit ? activities.slice(0, limit) : activities;

  if (isLoading) return <TimelineSkeleton />;

  if (error) {
    return <div className="activity-error">Couldn't load activity. {error}</div>;
  }

  if (visible.length === 0) {
    return (
      <div className="activity-empty-state">
        <span className="activity-empty-icon"><ActivityIcon /></span>
        <p>No activity yet</p>
        <span>Actions like leave requests and approvals will show up here.</span>
      </div>
    );
  }

  return (
    <div className="activity-timeline">
      {visible.map((a, i) => (
        <ActivityItem key={a.id} activity={a} isLast={i === visible.length - 1} />
      ))}
    </div>
  );
}

export default ActivityTimeline;
