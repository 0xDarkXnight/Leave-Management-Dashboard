function LeaveTable({ requests, onStatusChange, onDelete, onEdit }) {
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString(
        "en-GB"
    );
  };

  const calculateDuration = (
    startDate,
    endDate
    ) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    return difference + 1;
  };

  return (
    <div className="table-wrapper card">
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
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
          {requests.length === 0 ? (
            <tr>
              <td colSpan="8" className="empty-table">
                No leave requests found.
              </td>
            </tr>
          ) : (
            requests.map((request) => (
              <tr key={request.id}>
                <td>{request.employeeName}</td>
                <td>{request.leaveType}</td>
                <td>{formatDate(request.startDate)}</td>
                <td>{formatDate(request.endDate)}</td>
                <td>
                  {calculateDuration(
                    request.startDate,
                      request.endDate
                  )}{" "}
                  days
                </td>
                <td>
                  <span
                    className={`status-badge status-${request.status.toLowerCase()}`}
                  >
                    {request.status}
                  </span>
                </td>
                <td>
                  <select
                    value={request.status}
                    onChange={(e) =>
                      onStatusChange(request.id, e.target.value)
                    }
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
                      onClick={() => onEdit(request.id)}
                      >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => onDelete(request.id)}
                      >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="mobile-cards">
        {requests.length === 0 ? (
          <div className="mobile-card">
            No leave requests found.
          </div>
        ) : (
          requests.map((request) => (
          <div
            key={request.id}
            className="mobile-card"
            >
            <h3>{request.employeeName}</h3>

            <p>
              <strong>Type:</strong>{" "}
                {request.leaveType}
            </p>

            <p>
              <strong>Dates:</strong>{" "}
              {formatDate(request.startDate)}
              {" - "}
              {formatDate(request.endDate)}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {calculateDuration(
                request.startDate,
                request.endDate
              )}{" "}
              days
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {request.status}
            </p>

            <div className="mobile-actions">
              <button
                className="edit-btn"
                onClick={() => onEdit(request.id)}
                >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => onDelete(request.id)}
                >
                Delete
              </button>
            </div>
            <select
              value={request.status}
              onChange={(e) =>
                onStatusChange(request.id, e.target.value)
              }
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        )))}
      </div>
    </div>
  );
}

export default LeaveTable;