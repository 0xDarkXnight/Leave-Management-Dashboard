import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeaveTable from "../components/LeaveTable";

const STATUS_OPTIONS = ["All", "Pending", "Approved", "Rejected"];

function LeaveHistory({ leaveRequests, onUpdateStatus, onDeleteRequest, onEditRequest }) {
  const [searchTerm,   setSearch]  = useState("");
  const [statusFilter, setStatus]  = useState("All");

  const navigate = useNavigate();

  const handleEdit = (id) => {
    onEditRequest(id);
    navigate("/apply");
  };

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((req) => {
      const matchesName   = req.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || req.status === statusFilter;
      return matchesName && matchesStatus;
    });
  }, [leaveRequests, searchTerm, statusFilter]);

  return (
    <section className="page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Leave History</h1>
          <p>Search and manage all submitted leave requests.</p>
        </div>
        <div className="page-header-actions">
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 14px",
            background: "var(--clr-surface)", border: "1px solid var(--clr-border)",
            borderRadius: "var(--r-pill)", fontSize: 13, color: "var(--clr-text-500)",
            fontWeight: 600,
          }}>
            {filteredRequests.length} result{filteredRequests.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="filters-bar">
        <div>
          <label className="filter-label" htmlFor="search-name">
            Search by Employee Name
          </label>
          <input
            id="search-name"
            type="text"
            placeholder="Type employee name…"
            value={searchTerm}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <label className="filter-label" htmlFor="status-filter">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-card" style={{ overflow: "visible" }}>
        <div className="table-card-header">
          <h3>All Leave Requests</h3>
          <span className="table-count-badge">
            {filteredRequests.length} of {leaveRequests.length} total
          </span>
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