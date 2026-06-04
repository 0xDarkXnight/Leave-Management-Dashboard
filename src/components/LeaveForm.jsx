import { useState } from "react";
import { PlusIcon, CheckIcon } from "./Icons";

const initialFormState = {
  employeeName: "",
  leaveType: "",
  startDate: "",
  endDate: "",
  reason: "",
};

const getFormData = (request) =>
  request
    ? {
        employeeName: request.employeeName,
        leaveType: request.leaveType,
        startDate: request.startDate,
        endDate: request.endDate,
        reason: request.reason,
      }
    : initialFormState;

function LeaveForm({ onSubmit, editingRequest, onUpdateLeave }) {
  const [formData, setFormData]       = useState(() => getFormData(editingRequest));
  const [errors, setErrors]           = useState({});
  const [successMessage, setSuccess]  = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.employeeName.trim()) errs.employeeName = "Employee name is required.";
    if (!formData.leaveType)           errs.leaveType    = "Please select a leave type.";
    if (!formData.startDate)           errs.startDate    = "Start date is required.";
    if (!formData.endDate)             errs.endDate      = "End date is required.";
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate)
      errs.endDate = "End date cannot be earlier than start date.";
    if (!formData.reason.trim())       errs.reason       = "Reason is required.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (editingRequest) {
      onUpdateLeave({ ...editingRequest, ...formData });
      setSuccess("Leave request updated successfully.");
    } else {
      onSubmit(formData);
      setSuccess("Leave request submitted successfully.");
    }

    setFormData(initialFormState);
    setTimeout(() => setSuccess(""), 4000);
  };

  return (
    <form className="form-shell" onSubmit={handleSubmit} noValidate>
      <div className="form-shell-header">
        <h2>{editingRequest ? "Edit Leave Request" : "Apply for Leave"}</h2>
        <p>Fill out the details below to {editingRequest ? "update your" : "submit a new"} leave request.</p>
      </div>

      <div className="form-shell-body">
        {successMessage && (
          <div className="success-banner">
            <CheckIcon /> {successMessage}
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="employeeName">Employee Name</label>
            <input
              id="employeeName" type="text" name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.employeeName && (
              <span className="error-text">⚠ {errors.employeeName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="leaveType">Leave Type</label>
            <select
              id="leaveType" name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
            >
              <option value="">Select leave type</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Annual Leave">Annual Leave</option>
            </select>
            {errors.leaveType && (
              <span className="error-text">⚠ {errors.leaveType}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate" type="date" name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
            {errors.startDate && (
              <span className="error-text">⚠ {errors.startDate}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate" type="date" name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
            {errors.endDate && (
              <span className="error-text">⚠ {errors.endDate}</span>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="reason">Reason for Leave</label>
            <textarea
              id="reason" name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Please describe the reason for your leave request…"
            />
            {errors.reason && (
              <span className="error-text">⚠ {errors.reason}</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingRequest ? (
              <><CheckIcon /> Update Request</>
            ) : (
              <><PlusIcon /> Submit Leave Request</>
            )}
          </button>
          {editingRequest && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setFormData(initialFormState);
                onUpdateLeave({ ...editingRequest, cancel: true });
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