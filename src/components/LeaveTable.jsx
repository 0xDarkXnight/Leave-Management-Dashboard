function LeaveTable({ requests, onStatusChange, onDelete, onEdit }) {
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "2-digit", month: "short", year: "numeric",
        })
      : "—";

  const calcDays = (start, end) => {
    const diff = Math.ceil(
      (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
    );
    return diff + 1;
  };

  const initials = (name) =>
    name
      ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
      : "?";

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
              <th>Status</th>
              <th>Update Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>
                  <div className="employee-cell">
                    <div className="emp-avatar">{initials(req.employeeName)}</div>
                    <span className="emp-name">{req.employeeName}</span>
                  </div>
                </td>
                <td>
                  <span className="leave-type-chip">{req.leaveType}</span>
                </td>
                <td>{formatDate(req.startDate)}</td>
                <td>{formatDate(req.endDate)}</td>
                <td>
                  <strong>{calcDays(req.startDate, req.endDate)}</strong>
                  <span style={{ color: "var(--clr-text-300)", marginLeft: 4 }}>days</span>
                </td>
                <td>
                  <span className={`status-badge status-${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </td>
                <td>
                  <select
                    className="status-select"
                    value={req.status}
                    onChange={(e) => onStatusChange(req.id, e.target.value)}
                    aria-label={`Change status for ${req.employeeName}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => onEdit(req.id)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => onDelete(req.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
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
                <div className="emp-avatar">{initials(req.employeeName)}</div>
                <span className="mc-name">{req.employeeName}</span>
              </div>
              <span className={`status-badge status-${req.status.toLowerCase()}`}>
                {req.status}
              </span>
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
                <span>{formatDate(req.startDate)}</span>
              </div>
              <div className="mc-meta-item">
                <label>End Date</label>
                <span>{formatDate(req.endDate)}</span>
              </div>
            </div>

            <div className="mc-footer">
              <select
                className="status-select"
                value={req.status}
                onChange={(e) => onStatusChange(req.id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button className="edit-btn" onClick={() => onEdit(req.id)} type="button">
                Edit
              </button>
              <button className="delete-btn" onClick={() => onDelete(req.id)} type="button">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaveTable;