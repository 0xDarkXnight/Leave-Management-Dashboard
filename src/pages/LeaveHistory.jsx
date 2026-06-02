import { useMemo, useState } from "react";
import LeaveTable from "../components/LeaveTable";
import { useNavigate } from "react-router-dom";

function LeaveHistory({ leaveRequests, onUpdateStatus, onDeleteRequest, onEditRequest }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  const handleEdit = (id) => {
    onEditRequest(id);
    navigate("/apply");
  };

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((request) => {
      const matchesName = request.employeeName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      return matchesName && matchesStatus;
    });
  }, [leaveRequests, searchTerm, statusFilter]);

  return (
    <section className="page">
      <div className="page-header">
        <h2>Leave History</h2>
        <p>Search and manage all submitted leave requests.</p>
      </div>

      <div className="filters card">
        <div className="form-group">
          <label>Search by Employee Name</label>
          <input
            type="text"
            placeholder="Type employee name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <LeaveTable
        requests={filteredRequests}
        onStatusChange={onUpdateStatus}
        onDelete={onDeleteRequest}
        onEdit={handleEdit}
      />
    </section>
  );
}

export default LeaveHistory;