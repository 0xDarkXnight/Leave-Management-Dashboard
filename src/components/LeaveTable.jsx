import StatusBadge from "./StatusBadge";
import { CheckIcon, XIcon, EditIcon, TrashIcon } from "./Icons";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—";

const calcDays = (start, end) => {
  if (!start || !end) return 0;
  return (
    Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1
  );
};

const initials = (name) =>
  name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

function LeaveTable({
  requests,
  userRole = "Employee",
  onApprove,
  onReject,
  onDelete,
  onEdit,
}) {
  const isManager = userRole === "Manager";

  if (requests.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h4>No leave requests found</h4>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Duration</th>
              {isManager && <th>Reason</th>}
              {isManager && <th>Submitted</th>}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>
                  <div className="employee-cell">
                    <div className={`emp-avatar${isManager ? " emp-avatar--manager" : ""}`}>
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

                {isManager && (
                  <td>
                    <span className="reason-cell" title={req.reason}>
                      {req.reason || <span style={{ color: "var(--clr-text-300)" }}>—</span>}
                    </span>
                  </td>
                )}

                {isManager && <td>{fmtDate(req.createdAt)}</td>}

                <td><StatusBadge status={req.status}/></td>

                <td>
                  {isManager ? (
                    <div className="action-buttons action-buttons--manager">
                      <button
                        type="button"
                        className="approve-btn"
                        disabled={req.status === "Approved"}
                        onClick={() => onApprove?.(req)}
                        aria-label={`Approve ${req.employeeName}'s request`}
                      >
                        <CheckIcon/> Approve
                      </button>
                      <button
                        type="button"
                        className="reject-btn"
                        disabled={req.status === "Rejected"}
                        onClick={() => onReject?.(req)}
                        aria-label={`Reject ${req.employeeName}'s request`}
                      >
                        <XIcon/> Reject
                      </button>
                    </div>
                  ) : (
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => onEdit?.(req.id)}
                        aria-label={`Edit request`}
                      >
                        <EditIcon/> Edit
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => onDelete?.(req)}
                        aria-label={`Delete request`}
                      >
                        <TrashIcon/> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-cards">
        {requests.map((req) => (
          <div key={req.id} className="mobile-card">
            <div className="mc-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className={`emp-avatar${isManager ? " emp-avatar--manager" : ""}`}>
                  {initials(req.employeeName)}
                </div>
                <div>
                  <div className="mc-name">{req.employeeName}</div>
                  {isManager && (
                    <div style={{ fontSize: 11, color: "var(--clr-text-300)", marginTop: 2 }}>
                      Submitted {fmtDate(req.createdAt)}
                    </div>
                  )}
                </div>
              </div>
              <StatusBadge status={req.status}/>
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

            {isManager && req.reason && (
              <div className="mc-reason">
                <span className="mc-reason-label">Reason</span>
                <span>{req.reason}</span>
              </div>
            )}

            <div className="mc-footer">
              {isManager ? (
                <>
                  <button
                    type="button"
                    className="approve-btn"
                    disabled={req.status === "Approved"}
                    onClick={() => onApprove?.(req)}
                  >
                    <CheckIcon/> Approve
                  </button>
                  <button
                    type="button"
                    className="reject-btn"
                    disabled={req.status === "Rejected"}
                    onClick={() => onReject?.(req)}
                  >
                    <XIcon/> Reject
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="edit-btn" onClick={() => onEdit?.(req.id)}>
                    <EditIcon/> Edit
                  </button>
                  <button type="button" className="delete-btn" onClick={() => onDelete?.(req)}>
                    <TrashIcon/> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaveTable;