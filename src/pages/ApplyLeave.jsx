import LeaveForm from "../components/LeaveForm";

function ApplyLeave({ onAddLeave, editingRequest, onUpdateLeave }) {
  return (
    <section className="page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>{editingRequest ? "Edit Leave Request" : "Apply for Leave"}</h1>
          <p>
            {editingRequest
              ? "Update the details of your existing leave request."
              : "Submit a new leave request for manager approval."}
          </p>
        </div>
      </div>

      <LeaveForm
        onSubmit={onAddLeave}
        editingRequest={editingRequest}
        onUpdateLeave={onUpdateLeave}
      />
    </section>
  );
}

export default ApplyLeave;