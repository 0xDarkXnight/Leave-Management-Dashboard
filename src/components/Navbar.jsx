import { NavLink } from "react-router-dom";
import {
  DashboardIcon, ApplyIcon, HistoryIcon,
  ProfileIcon, LogoutIcon
} from "./Icons";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard",     Icon: DashboardIcon },
  { to: "/apply",     label: "Apply Leave",   Icon: ApplyIcon },
  { to: "/history",   label: "Leave History", Icon: HistoryIcon },
];

function Navbar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`} aria-label="Sidebar navigation">
        <div className="sidebar-brand">
          <div className="brand-icon" aria-hidden="true">LM</div>
          <div className="brand-text">
            <h2>LMS</h2>
            <span>Leave Management</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar" aria-hidden="true">JD</div>
          <div className="user-info">
            <div className="user-name">John Doe</div>
            <span className="user-role-badge">Employee</span>
          </div>
        </div>

        <div className="sidebar-section-label">Employee</div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item${isActive ? " active" : ""}`
              }
            >
              <span className="nav-icon"><Icon /></span>
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `nav-item${isActive ? " active" : ""}`
            }
          >
            <span className="nav-icon"><ProfileIcon /></span>
            <span className="nav-label">My Profile</span>
          </NavLink>

          <NavLink
            className="nav-item logout-item"
            style={{ width: "100%", background: "none", borderRadius: "var(--r-md)" }}
            onClick={() => alert("Logout clicked")}
            type="button"
          >
            <span className="nav-icon"><LogoutIcon /></span>
            <span className="nav-label">Logout</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default Navbar;