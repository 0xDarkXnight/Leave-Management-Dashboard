import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">
        <p className="brand-subtitle">Employee Portal</p>
        <h1>Leave Management</h1>
      </div>

      <nav className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/apply"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Apply Leave
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Leave History
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;