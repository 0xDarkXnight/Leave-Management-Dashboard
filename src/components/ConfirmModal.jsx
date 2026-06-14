import { useEffect } from "react";

const MODAL_CONFIG = {
  approve: {
    title:        "Approve Leave Request",
    emoji:        "✅",
    message:      "You're about to approve this leave request. The employee will be notified of your decision.",
    confirmLabel: "Approve Request",
    confirmClass: "btn-modal-approve",
    headerTheme:  "success",
  },
  reject: {
    title:        "Reject Leave Request",
    emoji:        "❌",
    message:      "You're about to reject this leave request. Please ensure you've reviewed all the details below.",
    confirmLabel: "Reject Request",
    confirmClass: "btn-modal-reject",
    headerTheme:  "danger",
  },
  delete: {
    title:        "Delete Leave Request",
    emoji:        "🗑️",
    message:      "This action is permanent and cannot be undone. The leave request will be removed from the system entirely.",
    confirmLabel: "Yes, Delete",
    confirmClass: "btn-modal-delete",
    headerTheme:  "danger",
  },
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const calcDays = (start, end) => {
  if (!start || !end) return "—";
  const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
  return `${diff + 1} day${diff + 1 !== 1 ? "s" : ""}`;
};

function ConfirmModal({ isOpen, type, request, onConfirm, onCancel, isLoading = false }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape" && !isLoading) onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onCancel, isLoading]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !request || !type) return null;
  const cfg = MODAL_CONFIG[type];
  if (!cfg) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true"
      aria-labelledby="modal-title" onClick={!isLoading ? onCancel : undefined}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>

        <div className={`modal-header modal-hdr--${cfg.headerTheme}`}>
          <span className="modal-emoji" aria-hidden="true">{cfg.emoji}</span>
          <div>
            <h2 id="modal-title" className="modal-title">{cfg.title}</h2>
            <p className="modal-subtitle">Confirm your action below</p>
          </div>
        </div>

        <div className="modal-body">
          <p className="modal-message">{cfg.message}</p>

          <div className="modal-details-card">
            <div className="mdc-row">
              <span className="mdc-label">Employee</span>
              <span className="mdc-value mdc-value--strong">{request.employeeName}</span>
            </div>
            <div className="mdc-row">
              <span className="mdc-label">Leave Type</span>
              <span className="mdc-value">
                <span className="leave-type-chip">{request.leaveType}</span>
              </span>
            </div>
            <div className="mdc-row">
              <span className="mdc-label">Duration</span>
              <span className="mdc-value">
                {fmtDate(request.startDate)} → {fmtDate(request.endDate)}
                <span className="mdc-days-tag">{calcDays(request.startDate, request.endDate)}</span>
              </span>
            </div>
            {request.reason && (
              <div className="mdc-row mdc-row--reason">
                <span className="mdc-label">Reason</span>
                <span className="mdc-value mdc-value--reason">{request.reason}</span>
              </div>
            )}
            <div className="mdc-row">
              <span className="mdc-label">Status</span>
              <span className={`status-badge status-${request.status?.toLowerCase()}`}>
                {request.status}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary"
            onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>

          <button type="button" className={cfg.confirmClass}
            onClick={onConfirm} disabled={isLoading} autoFocus aria-busy={isLoading}>
            {isLoading ? (
              <><span className="btn-spinner btn-spinner--sm" aria-hidden="true"/>Processing…</>
            ) : (
              cfg.confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;