import { useState, useMemo } from "react";
import SummaryCard from "../components/SummaryCard";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import { CheckIcon, XIcon, ShieldCheckIcon } from "../components/Icons";

const FILTER_TABS = ["Pending", "All", "Approved", "Rejected"];

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—";

const calcDays = (start, end) => {
  if (!start || !end) return 0;
  return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
};

const initials = (name) =>
  name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

function ManagerDashboard({ leaveRequests, onUpdateStatus }) {
  const [activeFilter, setActiveFilter] = useState("Pending");
  const [modal, setModal] = useState({ open: false, type: null, request: null });

  const stats = useMemo(() => ({
    total:    leaveRequests.length,
    pending:  leaveRequests.filter((r) => r.status === "Pending").length,
    approved: leaveRequests.filter((r) => r.status === "Approved").length,
    rejected: leaveRequests.filter((r) => r.status === "Rejected").length,
  }), [leaveRequests]);

  const filteredRequests = useMemo(() => {
    if (activeFilter === "All") return leaveRequests;
    return leaveRequests.filter((r) => r.status === activeFilter);
  }, [leaveRequests, activeFilter]);

  const tabCount = (tab) =>
    tab === "All"
      ? leaveRequests.length
      : leaveRequests.filter((r) => r.status === tab).length;

  const openModal  = (type, request) => setModal({ open: true, type, request });
  const closeModal = () => setModal({ open: false, type: null, request: null });

  const handleConfirm = () => {
    if (modal.type === "approve") onUpdateStatus(modal.request.id, "Approved");
    if (modal.type === "reject")  onUpdateStatus(modal.request.id, "Rejected");
    closeModal();
  };

  const emptyIcon = activeFilter === "Pending" ? "✅" : "📭";
  const emptyTitle =
    activeFilter === "Pending"
      ? "All caught up!"
      : `No ${activeFilter.toLowerCase()} requests`;
  const emptySubtitle =
    activeFilter === "Pending"
      ? "There are no pending requests awaiting your review."
      : "Try selecting a different filter above.";

  return (
    <section className="page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-title-row">
            <h1>Manager Dashboard</h1>
            <span className="role-tag role-tag--manager">
              <ShieldCheckIcon /> Manager View
            </span>
          </div>
          <p>
            Review and manage all team leave requests. You have{" "}
            <strong style={{ color: "var(--clr-warning)" }}>
              {stats.pending} pending request{stats.pending !== 1 ? "s" : ""}
            </strong>{" "}
            awaiting your action.
          </p>
        </div>
      </div>

      <div className="cards-grid">
        <SummaryCard
          title="Total Requests"
          value={stats.total}
          subtitle={`${stats.total} total submission${stats.total !== 1 ? "s" : ""}`}
          icon="📋"
          variant="total"
        />
        <SummaryCard
          title="Pending"
          value={stats.pending}
          subtitle="Awaiting your action"
          icon="⏳"
          variant="pending"
        />
        <SummaryCard
          title="Approved"
          value={stats.approved}
          subtitle="Approved this period"
          icon="✅"
          variant="approved"
        />
        <SummaryCard
          title="Rejected"
          value={stats.rejected}
          subtitle="Declined requests"
          icon="❌"
          variant="rejected"
        />
      </div>

      {stats.pending > 0 && (
        <div className="info-banner info-banner--warning">
          <div className="info-banner-icon">⚡</div>
          <div>
            <strong>{stats.pending} pending request{stats.pending !== 1 ? "s" : ""}</strong>{" "}
            require your attention. Use the Approve or Reject buttons below.
          </div>
        </div>
      )}

      {stats.pending === 0 && leaveRequests.length > 0 && (
        <div className="info-banner">
          <div className="info-banner-icon">✨</div>
          <div>All requests have been processed. No pending actions required.</div>
        </div>
      )}

      <div className="table-card" style={{ overflow: "visible" }}>
        <div className="table-card-header table-card-header--with-tabs">
          <h3>Leave Requests</h3>
          <div className="filter-tabs" role="tablist" aria-label="Filter by status">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeFilter === tab}
                className={`filter-tab${activeFilter === tab ? " filter-tab--active" : ""}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
                <span className="filter-tab-count">{tabCount(tab)}</span>
              </button>
            ))}
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">{emptyIcon}</div>
            <h4>{emptyTitle}</h4>
            <p>{emptySubtitle}</p>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <div className="employee-cell">
                          <div className="emp-avatar emp-avatar--manager">
                            {initials(req.employeeName)}
                          </div>
                          <span className="emp-name">{req.employeeName}</span>
                        </div>
                      </td>

                      <td>
                        <span className="leave-type-chip">{req.leaveType}</span>
                      </td>

                      <td>{fmtDate(req.startDate)}</td>
                      <td>{fmtDate(req.endDate)}</td>

                      <td>
                        <strong>{calcDays(req.startDate, req.endDate)}</strong>
                        <span style={{ color: "var(--clr-text-300)", marginLeft: 4 }}>days</span>
                      </td>

                      <td>
                        <span className="reason-cell" title={req.reason}>
                          {req.reason || <span style={{ color: "var(--clr-text-300)" }}>—</span>}
                        </span>
                      </td>

                      <td>{fmtDate(req.createdAt)}</td>

                      <td><StatusBadge status={req.status} /></td>

                      <td>
                        <div className="action-buttons action-buttons--manager">
                          <button
                            type="button"
                            className="approve-btn"
                            disabled={req.status === "Approved"}
                            onClick={() => openModal("approve", req)}
                            aria-label={`Approve request from ${req.employeeName}`}
                          >
                            <CheckIcon /> Approve
                          </button>
                          <button
                            type="button"
                            className="reject-btn"
                            disabled={req.status === "Rejected"}
                            onClick={() => openModal("reject", req)}
                            aria-label={`Reject request from ${req.employeeName}`}
                          >
                            <XIcon /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-cards">
              {filteredRequests.map((req) => (
                <div key={req.id} className="mobile-card">
                  <div className="mc-header">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="emp-avatar emp-avatar--manager">
                        {initials(req.employeeName)}
                      </div>
                      <div>
                        <div className="mc-name">{req.employeeName}</div>
                        <div style={{ fontSize: 11, color: "var(--clr-text-300)", marginTop: 2 }}>
                          Submitted {fmtDate(req.createdAt)}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>

                  <div className="mc-meta">
                    <div className="mc-meta-item">
                      <label>Leave Type</label>
                      <span>{req.leaveType}</span>
                    </div>
                    <div className="mc-meta-item">
                      <label>Duration</label>
                      <span>{calcDays(req.startDate, req.endDate)} days</span>
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

                  {req.reason && (
                    <div className="mc-reason">
                      <span className="mc-reason-label">Reason</span>
                      <span>{req.reason}</span>
                    </div>
                  )}

                  <div className="mc-footer">
                    <button
                      type="button"
                      className="approve-btn"
                      disabled={req.status === "Approved"}
                      onClick={() => openModal("approve", req)}
                    >
                      <CheckIcon /> Approve
                    </button>
                    <button
                      type="button"
                      className="reject-btn"
                      disabled={req.status === "Rejected"}
                      onClick={() => openModal("reject", req)}
                    >
                      <XIcon /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={modal.open}
        type={modal.type}
        request={modal.request}
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />
    </section>
  );
}

export default ManagerDashboard;
