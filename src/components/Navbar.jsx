import { NavLink, useNavigate } from "react-router-dom";
import {
  DashboardIcon, ApplyIcon, HistoryIcon,
  ProfileIcon,  LogoutIcon, BriefcaseIcon, UsersIcon,
} from "./Icons";

const EMP_NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard",    Icon: DashboardIcon },
  { to: "/apply",     label: "Apply Leave",  Icon: ApplyIcon },
  { to: "/history",   label: "Leave History",Icon: HistoryIcon },
];

const MGR_NAV_ITEMS = [
  { to: "/manager", label: "Manager Dashboard", Icon: BriefcaseIcon },
  { to: "/history", label: "All Requests",      Icon: UsersIcon },
];

function Navbar({ isOpen, onClose, userRole = "Employee", onLogout }) {
  const navigate    = useNavigate();
  const isManager   = userRole === "Manager";
  const navItems    = isManager ? MGR_NAV_ITEMS : EMP_NAV_ITEMS;

  const handleLogout = () => {
    onClose();
    onLogout?.();
    navigate("/");
  };

  return (
    <>
      <div
        className={`sidebar-overlay${isOpen ? " visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`sidebar${isOpen ? " open" : ""}${isManager ? " sidebar--manager" : ""}`}
        aria-label="Sidebar navigation"
      >
        <div className="sidebar-brand">
          <div className="brand-icon" aria-hidden="true">LM</div>
          <div className="brand-text">
            <h2>LMS</h2>
            <span>Leave Management</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className={`user-avatar${isManager ? " user-avatar--mgr" : ""}`} aria-hidden="true">
            {isManager ? "MG" : "JD"}
          </div>
          <div className="user-info">
            <div className="user-name">{isManager ? "Manager" : "John Doe"}</div>
            <span className={`user-role-badge${isManager ? " user-role-badge--mgr" : ""}`}>
              {userRole}
            </span>
          </div>
        </div>

        <div className={`sidebar-section-label${isManager ? " sidebar-section-label--mgr" : ""}`}>
          {userRole}
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item${isActive ? " active" : ""}`
              }
            >
              <span className="nav-icon"><Icon/></span>
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!isManager && (
            <NavLink
              to="/profile"
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item${isActive ? " active" : ""}`
              }
            >
              <span className="nav-icon"><ProfileIcon/></span>
              <span className="nav-label">My Profile</span>
            </NavLink>
          )}

          <button
            type="button"
            className="nav-item logout-item"
            onClick={handleLogout}
            style={{ width: "100%", background: "none", textAlign: "left" }}
          >
            <span className="nav-icon"><LogoutIcon/></span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Navbar;