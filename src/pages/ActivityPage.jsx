import { useAuth } from "../auth/useAuth";
import { useNotifications } from "../notifications/useNotifications";
import ActivityTimeline from "../components/activity/ActivityTimeline";

function ActivityPage() {
  const { isManager } = useAuth();
  const { activity, isLoadingActivity, activityError } = useNotifications();

  return (
    <section className="page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Activity</h1>
          <p>
            {isManager
              ? "A chronological log of leave actions, messages, and sign-ins across your team."
              : "A chronological log of your leave requests, messages, and sign-ins."}
          </p>
        </div>
      </div>

      <div className="table-card" style={{ padding: "8px 20px 20px" }}>
        <ActivityTimeline
          activities={activity}
          isLoading={isLoadingActivity}
          error={activityError}
        />
      </div>
    </section>
  );
}

export default ActivityPage;
