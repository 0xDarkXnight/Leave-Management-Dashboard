import { useLocation } from "react-router-dom";
import { MenuIcon, SearchIcon, BellIcon, HelpIcon, ChevronRight } from "./Icons";

const BREADCRUMBS = {
  "/":        "Dashboard",
  "/apply":   "Apply Leave",
  "/history": "Leave History",
};

function TopHeader({ onMenuToggle }) {
  const { pathname } = useLocation();
  const currentPage = BREADCRUMBS[pathname] ?? "Page";

  return (
    <header className="top-header">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          className="hamburger-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
          type="button"
        >
          <MenuIcon />
        </button>

        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span className="bc-workspace">Workspace</span>
          <span className="bc-sep"><ChevronRight /></span>
          <span className="bc-current">{currentPage}</span>
        </nav>
      </div>

      <div className="header-search-wrap" role="search">
        <SearchIcon />
        <input
          type="search"
          placeholder="Search..."
          aria-label="Search leave requests"
        />
      </div>

      <div className="header-right">
        <button className="hdr-icon-btn" aria-label="Notifications" type="button">
          <BellIcon />
          <span className="notif-badge" aria-label="3 notifications">3</span>
        </button>

        <button className="hdr-icon-btn" aria-label="Help" type="button">
          <HelpIcon />
        </button>

        <div className="header-user-pill" role="button" tabIndex={0} aria-label="User menu">
          <div className="hdr-avatar" aria-hidden="true">JD</div>
          <div className="hdr-user-info">
            <div className="hdr-name">John Doe</div>
            <div className="hdr-role">Employee</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopHeader;