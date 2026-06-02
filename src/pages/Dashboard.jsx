import SummaryCard from "../components/SummaryCard";

function Dashboard({ leaveRequests }) {
  const totalRequests = leaveRequests.length;
  const pendingRequests = leaveRequests.filter(
    (request) => request.status === "Pending"
  ).length;
  const approvedRequests = leaveRequests.filter(
    (request) => request.status === "Approved"
  ).length;
  const rejectedRequests = leaveRequests.filter(
    (request) => request.status === "Rejected"
  ).length;

  return (
    <section className="page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Track leave requests in one place.</p>
      </div>

      <div className="cards-grid">
        <SummaryCard title="Total Leave Requests" value={totalRequests} />
        <SummaryCard title="Pending Requests" value={pendingRequests} />
        <SummaryCard title="Approved Requests" value={approvedRequests} />
        <SummaryCard title="Rejected Requests" value={rejectedRequests} />
      </div>

      {totalRequests === 0 ? (
        <div className="info-box">
          No leave requests yet. Go to <strong>Apply Leave</strong> and submit
          your first request.
        </div>
      ) : (
        <div className="info-box">
          You currently have <strong>{pendingRequests}</strong> pending leave
          request(s).
        </div>
      )}
    </section>
  );
}

export default Dashboard;