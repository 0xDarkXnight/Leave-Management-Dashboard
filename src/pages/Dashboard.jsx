import { useNavigate } from "react-router-dom";
import SummaryCard from "../components/SummaryCard";
import { PlusIcon } from "../components/Icons";

function Dashboard({ leaveRequests }) {
  const navigate = useNavigate();

  const totalRequests    = leaveRequests.length;
  const pendingRequests  = leaveRequests.filter((r) => r.status === "Pending").length;
  const approvedRequests = leaveRequests.filter((r) => r.status === "Approved").length;
  const rejectedRequests = leaveRequests.filter((r) => r.status === "Rejected").length;

  const recentRequests = leaveRequests.slice(0, 5);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <section className="page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Employee Dashboard</h1>
          <p>Welcome back, John. You have <strong style={{ color: "var(--clr-warning)" }}>{pendingRequests} leave request{pendingRequests !== 1 ? "s" : ""}</strong> pending approval.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary" onClick={() => navigate("/history")}>
            View History
          </button>
          <button className="btn-primary" onClick={() => navigate("/apply")}>
            <PlusIcon /> Apply for Leave
          </button>
        </div>
      </div>

      <div className="cards-grid">
        <SummaryCard
          title="Total Requests"
          value={totalRequests}
          subtitle={`${leaveRequests.length} total submissions`}
          icon="📋"
          variant="total"
        />
        <SummaryCard
          title="Pending"
          value={pendingRequests}
          subtitle="Awaiting manager action"
          icon="⏳"
          variant="pending"
        />
        <SummaryCard
          title="Approved"
          value={approvedRequests}
          subtitle="Approved in your history"
          icon="✅"
          variant="approved"
        />
        <SummaryCard
          title="Rejected"
          value={rejectedRequests}
          subtitle="Declined requests"
          icon="❌"
          variant="rejected"
        />
      </div>

      <div className="info-banner">
        <div className="info-banner-icon">
          {totalRequests === 0 ? "📭" : pendingRequests > 0 ? "🔔" : "✨"}
        </div>
        <div>
          {totalRequests === 0 ? (
            <>No leave requests yet. Click <strong>Apply for Leave</strong> above to submit your first request.</>
          ) : pendingRequests > 0 ? (
            <>You currently have <strong>{pendingRequests} pending</strong> leave request{pendingRequests !== 1 ? "s" : ""} awaiting approval.</>
          ) : (
            <>All your leave requests have been processed. No pending actions.</>
          )}
        </div>
      </div>

      {totalRequests > 0 && (
        <div className="table-card">
          <div className="table-card-header">
            <h3>Recent Submissions</h3>
            <span className="table-count-badge">Last {recentRequests.length} of {totalRequests}</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div className="employee-cell">
                        <div className="emp-avatar">
                          {req.employeeName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="emp-name">{req.employeeName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="leave-type-chip">{req.leaveType}</span>
                    </td>
                    <td>{formatDate(req.startDate)}</td>
                    <td>{formatDate(req.endDate)}</td>
                    <td>
                      <span className={`status-badge status-${req.status.toLowerCase()}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default Dashboard;