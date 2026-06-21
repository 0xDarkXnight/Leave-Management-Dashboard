import { useLocation } from "react-router-dom";
import { useAuth }     from "../auth/useAuth";
import { MenuIcon, SearchIcon, HelpIcon, ChevronRight } from "./Icons";
import NotificationBell from "./notifications/NotificationBell";

const BREADCRUMBS = {
  "/dashboard":     "Dashboard",
  "/manager":       "Manager Dashboard",
  "/apply":         "Apply Leave",
  "/history":       "Leave History",
  "/chat":          "Messages",
  "/notifications": "Notifications",
  "/activity":      "Activity",
};

function TopHeader({ onMenuToggle }) {
  const { pathname }        = useLocation();
  const { user, isManager } = useAuth();
  const currentPage         = BREADCRUMBS[pathname] ?? "Page";

  return (
    <header className="top-header">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          className="hamburger-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
          type="button"
        >
          <MenuIcon/>
        </button>

        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span className="bc-workspace">Workspace</span>
          <span className="bc-sep"><ChevronRight/></span>
          <span className="bc-current">{currentPage}</span>
        </nav>
      </div>

      <div className="header-search-wrap" role="search">
        <SearchIcon/>
        <input
          type="search"
          placeholder="Search..."
          aria-label="Search leave requests"
        />
      </div>

      <div className="header-right">
        <NotificationBell />

        <button className="hdr-icon-btn" aria-label="Help" type="button">
          <HelpIcon/>
        </button>

        <div
          className="header-user-pill"
          role="img"
          aria-label={`Signed in as ${user?.name} (${user?.role})`}
        >
          <div
            className={`hdr-avatar${isManager ? " hdr-avatar--mgr" : ""}`}
            aria-hidden="true"
          >
            {user?.initials ?? "?"}
          </div>
          <div className="hdr-user-info">
            <div className="hdr-name">{user?.name ?? "—"}</div>
            <div className="hdr-role">{user?.role ?? "—"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopHeader;