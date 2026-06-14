import { useState }    from "react";
import { useAuth }     from "../auth/useAuth";
import { PlusIcon, CheckIcon } from "./Icons";
import { validateLeaveForm }   from "../utils/validators";

const makeInitialState = (user) => ({
  employeeName: user?.name ?? "",
  leaveType:    "",
  startDate:    "",
  endDate:      "",
  reason:       "",
});

const extractFormData = (request) =>
  request
    ? {
        employeeName: request.employeeName,
        leaveType:    request.leaveType,
        startDate:    request.startDate,
        endDate:      request.endDate,
        reason:       request.reason,
      }
    : null;

function LeaveForm({ onSubmit, editingRequest, onUpdateLeave, isSubmitting = false }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState(
    () => extractFormData(editingRequest) ?? makeInitialState(user)
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const allErrors = validateLeaveForm(formData, !!editingRequest);
    setErrors((prev) => ({ ...prev, [name]: allErrors[name] ?? "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ employeeName: true, leaveType: true, startDate: true, endDate: true, reason: true });

    const validationErrors = validateLeaveForm(formData, !!editingRequest);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    let result;

    if (editingRequest) {
      result = await onUpdateLeave({ ...editingRequest, ...formData });
    } else {
      result = await onSubmit(formData);
    }

    if (result?.success !== false) {
      setFormData(makeInitialState(user));
      setErrors({});
      setTouched({});
    }
  };

  const fieldError = (name) => (touched[name] || errors[name]) ? errors[name] : "";

  return (
    <form className="form-shell" onSubmit={handleSubmit} noValidate>
      <div className="form-shell-header">
        <h2>{editingRequest ? "Edit Leave Request" : "Apply for Leave"}</h2>
        <p>
          Fill out the details below to{" "}
          {editingRequest ? "update your" : "submit a new"} leave request.
        </p>
      </div>

      <div className="form-shell-body">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="employeeName">Employee Name</label>
            <input
              id="employeeName"
              type="text"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Your full name"
              readOnly={!!user?.name}
              style={user?.name ? { background: "var(--clr-bg)", cursor: "default" } : {}}
              aria-invalid={!!fieldError("employeeName")}
              aria-describedby={fieldError("employeeName") ? "err-empName" : undefined}
            />
            {fieldError("employeeName") && (
              <span id="err-empName" className="error-text" role="alert">
                ⚠ {fieldError("employeeName")}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="leaveType">Leave Type</label>
            <select
              id="leaveType"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!fieldError("leaveType")}
              aria-describedby={fieldError("leaveType") ? "err-leaveType" : undefined}
            >
              <option value="">Select leave type</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Annual Leave">Annual Leave</option>
            </select>
            {fieldError("leaveType") && (
              <span id="err-leaveType" className="error-text" role="alert">
                ⚠ {fieldError("leaveType")}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!fieldError("startDate")}
              aria-describedby={fieldError("startDate") ? "err-start" : undefined}
            />
            {fieldError("startDate") && (
              <span id="err-start" className="error-text" role="alert">
                ⚠ {fieldError("startDate")}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!fieldError("endDate")}
              aria-describedby={fieldError("endDate") ? "err-end" : undefined}
            />
            {fieldError("endDate") && (
              <span id="err-end" className="error-text" role="alert">
                ⚠ {fieldError("endDate")}
              </span>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="reason">
              Reason for Leave
              <span className="field-hint">Min. 10 characters</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Please describe the reason for your leave request…"
              aria-invalid={!!fieldError("reason")}
              aria-describedby={fieldError("reason") ? "err-reason" : "reason-hint"}
            />
            <div id="reason-hint" className="field-char-count" aria-live="polite">
              {formData.reason.trim().length} / 10 minimum characters
            </div>
            {fieldError("reason") && (
              <span id="err-reason" className="error-text" role="alert">
                ⚠ {fieldError("reason")}
              </span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <><span className="btn-spinner" aria-hidden="true"/>
                {editingRequest ? "Updating…" : "Submitting…"}
              </>
            ) : editingRequest ? (
              <><CheckIcon /> Update Request</>
            ) : (
              <><PlusIcon /> Submit Leave Request</>
            )}
          </button>

          {editingRequest && (
            <button
              type="button"
              className="btn-secondary"
              disabled={isSubmitting}
              onClick={async () => {
                setFormData(makeInitialState(user));
                setErrors({});
                setTouched({});
                await onUpdateLeave({ ...editingRequest, cancel: true });
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default LeaveForm;