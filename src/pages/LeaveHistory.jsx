import { useMemo, useState } from "react";
import { useNavigate }       from "react-router-dom";
import LeaveTable            from "../components/LeaveTable";
import ConfirmModal          from "../components/ConfirmModal";

const STATUS_OPTIONS = ["All", "Pending", "Approved", "Rejected"];

function LeaveHistory({
  leaveRequests,
  onUpdateStatus,
  onDeleteRequest,
  onEditRequest,
  userRole = "Employee",
}) {
  const navigate    = useNavigate();
  const isManager   = userRole === "Manager";

  const [searchTerm,   setSearch]  = useState("");
  const [statusFilter, setStatus]  = useState("All");

  const [modal, setModal] = useState({ open: false, type: null, request: null });

  const openModal  = (type, request) => setModal({ open: true, type, request });
  const closeModal = () => setModal({ open: false, type: null, request: null });

  const handleConfirm = () => {
    const { type, request } = modal;
    if (type === "approve") onUpdateStatus(request.id, "Approved");
    if (type === "reject")  onUpdateStatus(request.id, "Rejected");
    if (type === "delete")  onDeleteRequest(request.id);
    closeModal();
  };

  const handleEdit = (id) => {
    onEditRequest(id);
    navigate("/apply");
  };

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((req) => {
      const matchesName   = req.employeeName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || req.status === statusFilter;
      return matchesName && matchesStatus;
    });
  }, [leaveRequests, searchTerm, statusFilter]);

  return (
    <section className="page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>{isManager ? "All Requests" : "Leave History"}</h1>
          <p>
            {isManager
              ? "Review, filter, and take action on all team leave requests."
              : "Search and manage your submitted leave requests."}
          </p>
        </div>
        <div className="page-header-actions">
          <span className="table-count-badge" style={{ padding: "7px 14px" }}>
            {filteredRequests.length} result{filteredRequests.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="filters-bar">
        <div>
          <label className="filter-label" htmlFor="search-name">
            {isManager ? "Search by Employee Name" : "Search Requests"}
          </label>
          <input
            id="search-name"
            type="text"
            placeholder={isManager ? "Type employee name…" : "Type to search…"}
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
          <h3>{isManager ? "All Leave Requests" : "My Leave Requests"}</h3>
          <span className="table-count-badge">
            {filteredRequests.length} of {leaveRequests.length} total
          </span>
        </div>
      </div>

      <LeaveTable
        requests={filteredRequests}
        userRole={userRole}
        onApprove={(req) => openModal("approve", req)}
        onReject={(req)  => openModal("reject",  req)}
        onDelete={(req)  => openModal("delete",  req)}
        onEdit={handleEdit}
      />

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

export default LeaveHistory;