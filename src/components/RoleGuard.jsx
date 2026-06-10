import { useAuth } from "../auth/useAuth";
import AccessDenied from "../pages/AccessDenied";

function RoleGuard({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <AccessDenied allowedRoles={allowedRoles} />;
  }

  return children;
}

export default RoleGuard;
