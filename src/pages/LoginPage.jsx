import { useState }      from "react";
import { useNavigate }   from "react-router-dom";
import { useAuth }       from "../auth/useAuth";
import { useToast }      from "../hooks/useToast";
import { validateLoginForm } from "../utils/validators";

const ROLE_DATA = {
  Employee: {
    emoji:        "👤",
    headline:     "Manage your\ntime off.",
    desc:         "Submit leave requests, track approvals, and manage your calendar — all from one clean dashboard.",
    features: [
      { icon: "📅", title: "Apply for Leave",    desc: "Submit sick, casual, or annual leave requests in under a minute." },
      { icon: "📋", title: "View Leave History", desc: "A full timeline of every request you've submitted, with live status." },
      { icon: "🔔", title: "Real-time Updates",  desc: "Status changes appear instantly — no page refresh needed." },
    ],
    capabilities: ["Apply for leave", "View leave history", "Track request status"],
    demoEmail:    "employee@lms.com",
    demoPassword: "employee123",
  },
  Manager: {
    emoji:        "🏢",
    headline:     "Lead your\nteam smarter.",
    desc:         "Get a bird's-eye view of every team leave request. Approve or reject with full context — instantly.",
    features: [
      { icon: "👥", title: "All Leave Requests", desc: "See every pending and historical request across your entire team." },
      { icon: "✅", title: "Approve / Reject",   desc: "Take action on requests with a confirmation step for accuracy." },
      { icon: "📊", title: "Team Overview",      desc: "Dashboard analytics to track attendance patterns at a glance." },
    ],
    capabilities: ["View all team requests", "Approve / Reject requests", "Manage team attendance"],
    demoEmail:    "manager@lms.com",
    demoPassword: "manager123",
  },
};

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,8 12,14 22,8"/>
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const CheckMiniIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const AlertTriangleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, marginTop: 1 }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

function LoginPage() {
  const [selectedRole,  setSelectedRole]  = useState("Employee");
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [showPassword,  setShowPassword]  = useState(false);
  const [fieldErrors,   setFieldErrors]   = useState({});
  const [authError,     setAuthError]     = useState("");
  const [isLoading,     setIsLoading]     = useState(false);

  const { login }  = useAuth();
  const toast      = useToast();
  const navigate   = useNavigate();
  const data       = ROLE_DATA[selectedRole];

  const clearErrors = () => {
    setFieldErrors({});
    setAuthError("");
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    clearErrors();
  };

  const fillDemo = (role) => {
    setEmail(ROLE_DATA[role].demoEmail);
    setPassword(ROLE_DATA[role].demoPassword);
    setSelectedRole(role);
    clearErrors();
  };

  const handleSubmit = async () => {
    const errors = validateLoginForm({ email, password });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setAuthError(Object.values(errors)[0]);
      return;
    }

    setIsLoading(true);
    setAuthError("");
    setFieldErrors({});

    try {
      const result = await login(email, password);

      if (!result.success) {
        setAuthError(result.error);
        return;
      }

      toast.success(`Welcome back, ${result.user.name}! 👋`);
      navigate(
        result.user.role === "Manager" ? "/manager" : "/dashboard",
        { replace: true }
      );
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) handleSubmit();
  };

  const hasFieldError = (field) => !!fieldErrors[field];

  return (
    <div className="login-shell">
      <div className="login-brand-panel">
        <div className="login-bg-shapes" aria-hidden="true">
          <div className="lbs-circle lbs-c1"/><div className="lbs-circle lbs-c2"/>
          <div className="lbs-circle lbs-c3"/><div className="lbs-grid"/>
        </div>

        <div className="login-brand-content">
          <div className="login-logomark" aria-label="LMS — Leave Management System">
            <div className="login-logomark-icon" aria-hidden="true">LM</div>
            <div>
              <div className="login-logomark-name">LMS</div>
              <div className="login-logomark-sub">Leave Management System</div>
            </div>
          </div>

          <div className="login-brand-hero">
            <h2 className="login-brand-heading">
              {data.headline.split("\n").map((line, i) => (
                <span key={i} className={i === 1 ? "login-brand-accent" : ""}>
                  {line}{i === 0 && <br/>}
                </span>
              ))}
            </h2>
            <p className="login-brand-desc">{data.desc}</p>
          </div>

          <div className="login-features" key={selectedRole}>
            {data.features.map((feat, idx) => (
              <div key={feat.title} className="login-feat-card"
                style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="lfc-icon" aria-hidden="true">{feat.icon}</div>
                <div className="lfc-body">
                  <div className="lfc-title">{feat.title}</div>
                  <div className="lfc-desc">{feat.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="login-brand-footer">
            <span className="login-online-dot" aria-hidden="true"/>
            All systems operational
          </div>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-wrap">
          <div className="login-mobile-logo" aria-label="LMS — Leave Management System">
            <div className="login-mobile-logo-icon">LM</div>
            <div className="login-mobile-logo-text">Leave Management System</div>
          </div>

          <div className="login-form-header">
            <h1 className="login-form-title">Welcome back</h1>
            <p className="login-form-subtitle">Sign in to your workspace to continue</p>
          </div>

          <div className="login-role-selector" role="group" aria-label="Preview role">
            <div className="login-role-selector-label">Sign in as</div>
            <div className="login-role-tabs">
              {["Employee", "Manager"].map((role) => (
                <button key={role} type="button"
                  className={`login-role-tab${selectedRole === role ? " lrt-active" : ""}`}
                  onClick={() => handleRoleSelect(role)}
                  aria-pressed={selectedRole === role}>
                  <span className="lrt-emoji" aria-hidden="true">{ROLE_DATA[role].emoji}</span>
                  <span>{role}</span>
                  {selectedRole === role && (
                    <span className="lrt-check" aria-hidden="true"><CheckMiniIcon/></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="login-cred-helper" role="region" aria-label="Demo credentials">
            <span className="login-cred-helper-label">Quick fill:</span>
            <button type="button" className="login-cred-pill"
              onClick={() => fillDemo("Employee")} aria-label="Fill employee demo credentials">
              <span className="login-cred-pill-dot" aria-hidden="true"/>Employee demo
            </button>
            <button type="button" className="login-cred-pill login-cred-pill--manager"
              onClick={() => fillDemo("Manager")} aria-label="Fill manager demo credentials">
              <span className="login-cred-pill-dot" aria-hidden="true"/>Manager demo
            </button>
          </div>

          {authError && (
            <div className="login-error-banner" role="alert" aria-live="assertive">
              <AlertTriangleIcon/>
              <span>{authError}</span>
            </div>
          )}

          <div className="login-fields">
            <div className="login-field-group">
              <label htmlFor="login-email" className="login-field-label">
                Email Address
              </label>
              <div className="login-input-wrap">
                <span className="login-input-adornment" aria-hidden="true"><EmailIcon/></span>
                <input
                  id="login-email"
                  type="email"
                  className={`login-input${hasFieldError("email") ? " login-input--error" : ""}`}
                  placeholder={data.demoEmail}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearErrors(); }}
                  onKeyDown={handleKeyDown}
                  autoComplete="email"
                  disabled={isLoading}
                  aria-invalid={hasFieldError("email")}
                />
              </div>
              {fieldErrors.email && (
                <span className="login-field-error" role="alert">{fieldErrors.email}</span>
              )}
            </div>

            <div className="login-field-group">
              <label htmlFor="login-password" className="login-field-label">
                Password
              </label>
              <div className="login-input-wrap">
                <span className="login-input-adornment" aria-hidden="true"><LockIcon/></span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className={`login-input login-input--pw${hasFieldError("password") ? " login-input--error" : ""}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearErrors(); }}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                  disabled={isLoading}
                  aria-invalid={hasFieldError("password")}
                />
                <button type="button" className="login-pw-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}>
                  {showPassword ? <EyeOffIcon/> : <EyeIcon/>}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="login-field-error" role="alert">{fieldErrors.password}</span>
              )}
            </div>
          </div>

          <button
            type="button"
            className={`login-submit-btn${selectedRole === "Manager" ? " login-submit-btn--manager" : ""}`}
            onClick={handleSubmit}
            disabled={isLoading}
            aria-busy={isLoading}>
            {isLoading ? (
              <><span className="login-spinner" aria-hidden="true"/>Signing in…</>
            ) : (
              <><span>Sign in as {selectedRole}</span><ArrowRightIcon/></>
            )}
          </button>

          <div className="login-demo-notice" role="status">
            <span className="login-demo-dot" aria-hidden="true"/>
            Demo — click a quick-fill pill above, then Sign In
          </div>

          <div className="login-divider" aria-hidden="true">
            <span/><span className="login-divider-text">
              {selectedRole === "Employee" ? "Employee access" : "Manager access"}
            </span><span/>
          </div>

          <div className={`login-capabilities login-cap--${selectedRole.toLowerCase()}`}
            key={`cap-${selectedRole}`}>
            <div className="login-cap-heading">
              As a <strong>{selectedRole}</strong> you can:
            </div>
            <ul className="login-cap-list" role="list">
              {data.capabilities.map((cap) => (
                <li key={cap} className="login-cap-item">
                  <span className="login-cap-check" aria-hidden="true"><CheckMiniIcon/></span>
                  {cap}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;