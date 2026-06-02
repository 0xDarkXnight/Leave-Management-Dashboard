import { useState, useEffect } from "react";

const initialFormState = {
  employeeName: "",
  leaveType: "",
  startDate: "",
  endDate: "",
  reason: "",
};

function LeaveForm({ 
    onSubmit,
    editingRequest,
    onUpdateLeave
}) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (editingRequest) {
        setFormData({
        employeeName:
            editingRequest.employeeName,
        leaveType:
            editingRequest.leaveType,
        startDate:
            editingRequest.startDate,
        endDate:
            editingRequest.endDate,
        reason:
            editingRequest.reason,
        });
    }
  }, [editingRequest]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employeeName.trim()) {
      newErrors.employeeName = "Employee name is required.";
    }

    if (!formData.leaveType) {
      newErrors.leaveType = "Please select a leave type.";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required.";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required.";
    }

    if (formData.startDate && formData.endDate) {
      if (formData.endDate < formData.startDate) {
        newErrors.endDate = "End date cannot be earlier than start date.";
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors =
        validateForm();

    setErrors(validationErrors);

    if (
        Object.keys(validationErrors).length > 0
    ) {
        return;
    }

    if (editingRequest) {
        onUpdateLeave({
        ...editingRequest,
        ...formData,
        });

        setSuccessMessage(
        "Leave request updated successfully."
        );
    } else {
        onSubmit(formData);

        setSuccessMessage(
        "Leave request submitted successfully."
        );
    }

    setFormData(initialFormState);

    setTimeout(() => {
        setSuccessMessage("");
    }, 3000);
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="page-header">
        <h2>
          {editingRequest ? "Edit Leave Request" : "Apply for Leave"}
        </h2>
        <p>Fill out the form below to create a new leave request.</p>
      </div>

      {successMessage && <p className="success-text">{successMessage}</p>}

      <div className="form-grid">
        <div className="form-group">
          <label>Employee Name</label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            placeholder="Enter employee name"
          />
          {errors.employeeName && (
            <span className="error-text">{errors.employeeName}</span>
          )}
        </div>

        <div className="form-group">
          <label>Leave Type</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
          >
            <option value="">Select leave type</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Annual Leave">Annual Leave</option>
          </select>
          {errors.leaveType && (
            <span className="error-text">{errors.leaveType}</span>
          )}
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          {errors.startDate && (
            <span className="error-text">{errors.startDate}</span>
          )}
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          {errors.endDate && (
            <span className="error-text">{errors.endDate}</span>
          )}
        </div>

        <div className="form-group full-width">
          <label>Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Enter the reason for leave"
          />
          {errors.reason && (
            <span className="error-text">{errors.reason}</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingRequest ? "Update Request" : "Submit Leave Request"}
        </button>
      </div>
    </form>
  );
}

export default LeaveForm;