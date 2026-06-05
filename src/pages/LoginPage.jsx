import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ROLE_DATA = {
  Employee: {
    emoji: "👤",
    headline: "Manage your\ntime off.",
    accent: "time off.",
    desc: "Submit leave requests, track approvals, and manage your calendar — all from one clean dashboard.",
    features: [
      {
        icon: "📅",
        title: "Apply for Leave",
        desc: "Submit sick, casual, or annual leave requests in under a minute.",
      },
      {
        icon: "📋",
        title: "View Leave History",
        desc: "A full timeline of every request you've submitted, with live status.",
      },
      {
        icon: "🔔",
        title: "Real-time Updates",
        desc: "Get notified the moment your manager takes action on a request.",
      },
    ],
    capabilities: ["Apply for leave", "View leave history", "Track request status"],
    placeholder: "employee@company.com",
  },
  Manager: {
    emoji: "🏢",
    headline: "Lead your\nteam smarter.",
    accent: "team smarter.",
    desc: "Get a bird's-eye view of every team leave request. Approve or reject with full context — instantly.",
    features: [
      {
        icon: "👥",
        title: "All Leave Requests",
        desc: "See every pending and historical request across your entire team.",
      },
      {
        icon: "✅",
        title: "Approve / Reject",
        desc: "Take action on requests with full visibility of dates and reasons.",
      },
      {
        icon: "📊",
        title: "Team Overview",
        desc: "Dashboard analytics to track attendance patterns at a glance.",
      },
    ],
    capabilities: ["View all team requests", "Approve / Reject requests", "Manage team attendance"],
    placeholder: "manager@company.com",
  },
};

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,8 12,14 22,8" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckMiniIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("Employee");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const data = ROLE_DATA[selectedRole];

  const handleLogin = () => {
    navigate("/dashboard");
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  return (
    <div className="login-shell">
      <div className="login-brand-panel">
        <div className="login-bg-shapes" aria-hidden="true">
          <div className="lbs-circle lbs-c1" />
          <div className="lbs-circle lbs-c2" />
          <div className="lbs-circle lbs-c3" />
          <div className="lbs-grid" />
        </div>

        <div className="login-brand-content">
          <button
            type="button"
            className="login-logomark"
            onClick={handleLogoClick}
          >
            <div className="login-logomark-icon" aria-hidden="true">LM</div>
            <div>
              <div className="login-logomark-name">LMS</div>
              <div className="login-logomark-sub">Leave Management System</div>
            </div>
          </button>

          <div className="login-brand-hero">
            <h2 className="login-brand-heading">
              {data.headline.split("\n").map((line, i) => (
                <span key={i} className={i === 1 ? "login-brand-accent" : ""}>
                  {line}{i === 0 && <br />}
                </span>
              ))}
            </h2>
            <p className="login-brand-desc">{data.desc}</p>
          </div>

          <div className="login-features" key={selectedRole}>
            {data.features.map((feat, idx) => (
              <div
                key={feat.title}
                className="login-feat-card"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="lfc-icon" aria-hidden="true">{feat.icon}</div>
                <div className="lfc-body">
                  <div className="lfc-title">{feat.title}</div>
                  <div className="lfc-desc">{feat.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="login-brand-footer">
            <span className="login-online-dot" aria-hidden="true" />
            All systems operational
          </div>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-wrap">
          <button
            type="button"
            className="login-mobile-logo"
            onClick={handleLogoClick}
          >
            <div className="login-mobile-logo-icon">LM</div>
            <div className="login-mobile-logo-text">
              Leave Management System
            </div>
          </button>

          <div className="login-form-header">
            <h1 className="login-form-title">Welcome back</h1>
            <p className="login-form-subtitle">
              Sign in to your workspace to continue
            </p>
          </div>

          <div className="login-role-selector" role="group" aria-label="Select your role">
            <div className="login-role-selector-label">Sign in as</div>
            <div className="login-role-tabs">
              {["Employee", "Manager"].map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`login-role-tab${selectedRole === role ? " lrt-active" : ""}`}
                  onClick={() => handleRoleChange(role)}
                  aria-pressed={selectedRole === role}
                >
                  <span className="lrt-emoji" aria-hidden="true">
                    {ROLE_DATA[role].emoji}
                  </span>
                  <span>{role}</span>
                  {selectedRole === role && (
                    <span className="lrt-check" aria-hidden="true">
                      <CheckMiniIcon />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="login-fields">
            <div className="login-field-group">
              <label htmlFor="login-email" className="login-field-label">
                Email Address
              </label>
              <div className="login-input-wrap">
                <span className="login-input-adornment" aria-hidden="true">
                  <EmailIcon />
                </span>
                <input
                  id="login-email"
                  type="email"
                  className="login-input"
                  placeholder={data.placeholder}
                  autoComplete="email"
                  aria-label="Email address"
                />
              </div>
            </div>

            <div className="login-field-group">
              <div className="login-field-row">
                <label htmlFor="login-password" className="login-field-label">
                  Password
                </label>
                <button
                  type="button"
                  className="login-forgot-btn"
                  tabIndex={0}
                >
                  Forgot password?
                </button>
              </div>
              <div className="login-input-wrap">
                <span className="login-input-adornment" aria-hidden="true">
                  <LockIcon />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="login-input login-input--pw"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-label="Password"
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="login-submit-btn"
            onClick={handleLogin}
            aria-label={`Sign in as ${selectedRole}`}
          >
            <span>Sign in as {selectedRole}</span>
            <ArrowRightIcon />
          </button>

          <div className="login-demo-notice" role="status" aria-live="polite">
            <span className="login-demo-dot" aria-hidden="true" />
              Click sign in to explore the dashboard
          </div>

          <div className="login-divider" aria-hidden="true">
            <span />
            <span className="login-divider-text">
              {selectedRole === "Employee" ? "Employee access" : "Manager access"}
            </span>
            <span />
          </div>

          <div
            className={`login-capabilities login-cap--${selectedRole.toLowerCase()}`}
            key={`cap-${selectedRole}`}
          >
            <div className="login-cap-heading">
              As a <strong>{selectedRole}</strong> you can:
            </div>
            <ul className="login-cap-list" role="list">
              {data.capabilities.map((cap) => (
                <li key={cap} className="login-cap-item">
                  <span className="login-cap-check" aria-hidden="true">
                    <CheckMiniIcon />
                  </span>
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