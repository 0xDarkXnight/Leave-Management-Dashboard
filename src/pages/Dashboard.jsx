import { useNavigate } from "react-router-dom";
import SummaryCard from "../components/SummaryCard";
import StatusBadge from "../components/StatusBadge";
import { PlusIcon } from "../components/Icons";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—";

function Dashboard({ leaveRequests }) {
  const navigate = useNavigate();

  const total    = leaveRequests.length;
  const pending  = leaveRequests.filter((r) => r.status === "Pending").length;
  const approved = leaveRequests.filter((r) => r.status === "Approved").length;
  const rejected = leaveRequests.filter((r) => r.status === "Rejected").length;

  const recent = leaveRequests.slice(0, 5);

  return (
    <section className="page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Employee Dashboard</h1>
          <p>
            Welcome back, John. You have{" "}
            <strong style={{ color: "var(--clr-warning)" }}>
              {pending} leave request{pending !== 1 ? "s" : ""}
            </strong>{" "}
            pending approval.
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary" onClick={() => navigate("/history")}>
            View History
          </button>
          <button className="btn-primary" onClick={() => navigate("/apply")}>
            <PlusIcon/> Apply for Leave
          </button>
        </div>
      </div>

      <div className="cards-grid">
        <SummaryCard title="Total Requests" value={total}
          subtitle={`${total} total submission${total !== 1 ? "s" : ""}`}
          icon="📋" variant="total" />
        <SummaryCard title="Pending"   value={pending}
          subtitle="Awaiting manager action" icon="⏳" variant="pending" />
        <SummaryCard title="Approved"  value={approved}
          subtitle="Approved in your history" icon="✅" variant="approved" />
        <SummaryCard title="Rejected"  value={rejected}
          subtitle="Declined requests" icon="❌" variant="rejected" />
      </div>

      <div className="info-banner">
        <div className="info-banner-icon">
          {total === 0 ? "📭" : pending > 0 ? "🔔" : "✨"}
        </div>
        <div>
          {total === 0 ? (
            <>No leave requests yet. Click <strong>Apply for Leave</strong> to submit your first.</>
          ) : pending > 0 ? (
            <>You have <strong>{pending} pending</strong> leave request{pending !== 1 ? "s" : ""} awaiting manager approval.</>
          ) : (
            <>All your leave requests have been processed. No pending actions.</>
          )}
        </div>
      </div>

      {total > 0 && (
        <div className="table-card">
          <div className="table-card-header">
            <h3>Recent Submissions</h3>
            <span className="table-count-badge">
              Last {recent.length} of {total}
            </span>
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
                {recent.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div className="employee-cell">
                        <div className="emp-avatar">
                          {req.employeeName?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                        <span className="emp-name">{req.employeeName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="leave-type-chip">{req.leaveType}</span>
                    </td>
                    <td>{fmtDate(req.startDate)}</td>
                    <td>{fmtDate(req.endDate)}</td>
                    <td><StatusBadge status={req.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-cards">
            {recent.map((req) => (
              <div key={req.id} className="mobile-card">
                <div className="mc-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="emp-avatar">
                      {req.employeeName?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                    <span className="mc-name">{req.employeeName}</span>
                  </div>
                  <StatusBadge status={req.status}/>
                </div>
                <div className="mc-meta">
                  <div className="mc-meta-item">
                    <label>Leave Type</label>
                    <span>{req.leaveType}</span>
                  </div>
                  <div className="mc-meta-item">
                    <label>Start Date</label>
                    <span>{fmtDate(req.startDate)}</span>
                  </div>
                  <div className="mc-meta-item">
                    <label>End Date</label>
                    <span>{fmtDate(req.endDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Dashboard;