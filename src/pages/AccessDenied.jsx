import { useNavigate } from "react-router-dom";
import { useAuth }     from "../auth/useAuth";

function AccessDenied({ allowedRoles = [] }) {
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const homeRoute = user?.role === "Manager" ? "/manager" : "/dashboard";

  const requiredLabel =
    allowedRoles.length === 1
      ? allowedRoles[0]
      : allowedRoles.join(" or ");

  return (
    <section className="page">
      <div className="access-denied">
        <div className="access-denied-icon-wrap" aria-hidden="true">
          <span className="access-denied-icon">🔒</span>
        </div>

        <h1 className="access-denied-title">Access Denied</h1>

        <p className="access-denied-desc">
          {requiredLabel ? (
            <>
              This page is only available to{" "}
              <strong className="access-denied-highlight">
                {requiredLabel}
              </strong>{" "}
              users.
            </>
          ) : (
            "You don't have permission to view this page."
          )}
          {user && (
            <>
              {" "}You're signed in as{" "}
              <strong className="access-denied-highlight">{user.name}</strong>{" "}
              ({user.role}).
            </>
          )}
        </p>

        <div className="access-denied-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate(homeRoute)}
          >
            Go to My Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}

export default AccessDenied;
