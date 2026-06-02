import LeaveForm from "../components/LeaveForm";

function ApplyLeave({
  onAddLeave,
  editingRequest,
  onUpdateLeave,
}) {
  return (
    <section className="page">
      <LeaveForm
        onSubmit={onAddLeave}
        editingRequest={editingRequest}
        onUpdateLeave={onUpdateLeave}
      />
    </section>
  );
}

export default ApplyLeave;