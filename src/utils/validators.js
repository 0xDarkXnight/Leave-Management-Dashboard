export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validators = {
  required(value, label = "This field") {
    return !value?.toString().trim()
      ? `${label} is required.`
      : null;
  },

  email(value) {
    return !EMAIL_REGEX.test(value?.trim())
      ? "Please enter a valid email address (e.g. user@example.com)."
      : null;
  },

  minLength(value, min, label = "This field") {
    return (value?.trim().length ?? 0) < min
      ? `${label} must be at least ${min} characters.`
      : null;
  },

  maxLength(value, max, label = "This field") {
    return (value?.trim().length ?? 0) > max
      ? `${label} must not exceed ${max} characters.`
      : null;
  },

  notInPast(value, label = "Date") {
    if (!value) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(value) < today
      ? `${label} cannot be in the past.`
      : null;
  },

  endAfterStart(startDate, endDate) {
    if (!startDate || !endDate) return null;
    return endDate < startDate
      ? "End date cannot be earlier than the start date."
      : null;
  },
};

export function validateLoginForm({ email, password }) {
  const errors = {};

  const emailErr =
    validators.required(email, "Email") ??
    validators.email(email);
  if (emailErr) errors.email = emailErr;

  const passwordErr = validators.required(password, "Password");
  if (passwordErr) errors.password = passwordErr;

  return errors;
}

export function validateLeaveForm(formData, isEditing = false) {
  const errors = {};

  const empErr = validators.required(formData.employeeName, "Employee name");
  if (empErr) errors.employeeName = empErr;

  const typeErr = validators.required(formData.leaveType, "Leave type");
  if (typeErr) errors.leaveType = typeErr;

  const startErr = validators.required(formData.startDate, "Start date");
  if (startErr) {
    errors.startDate = startErr;
  } else if (!isEditing) {
    const pastErr = validators.notInPast(formData.startDate, "Start date");
    if (pastErr) errors.startDate = pastErr;
  }

  const endErr = validators.required(formData.endDate, "End date");
  if (endErr) {
    errors.endDate = endErr;
  } else {
    const rangeErr = validators.endAfterStart(formData.startDate, formData.endDate);
    if (rangeErr) errors.endDate = rangeErr;
  }

  const reasonErr =
    validators.required(formData.reason, "Reason") ??
    validators.minLength(formData.reason, 10, "Reason");
  if (reasonErr) errors.reason = reasonErr;

  return errors;
}