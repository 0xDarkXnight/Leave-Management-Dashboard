import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth }          from "./auth/useAuth";
import { useLeaveRequests } from "./hooks/useLeaveRequests";

import Dashboard        from "./pages/Dashboard";
import ApplyLeave       from "./pages/ApplyLeave";
import LeaveHistory     from "./pages/LeaveHistory";
import LoginPage        from "./pages/LoginPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import ChatPage         from "./pages/ChatPage";
import AppShellLayout   from "./layouts/AppShellLayout";
import ProtectedRoute   from "./components/ProtectedRoute";
import RoleGuard        from "./components/RoleGuard";

function App() {
  const { isAuthenticated, user } = useAuth();
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  const {
    leaveRequests,
    isLoading:     leaveLoading,
    actionLoading,
    addLeaveRequest,
    updateLeaveStatus,
    deleteLeaveRequest,
    updateLeaveRequest,
  } = useLeaveRequests();

  const closeSidebar = () => setSidebarOpen(false);

  const startEditingRequest = (id) => {
    const request = leaveRequests.find((r) => r.id === id);
    if (request) setEditingRequest(request);
  };

  const handleUpdateLeave = async (updatedRequest) => {
    if (updatedRequest.cancel) {
      setEditingRequest(null);
      return { success: true };
    }
    const result = await updateLeaveRequest(updatedRequest);
    if (result?.success) setEditingRequest(null);
    return result;
  };

  const homeRoute = user?.role === "Manager" ? "/manager" : "/dashboard";

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? homeRoute : "/login"} replace />}
      />

      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to={homeRoute} replace />
            : <LoginPage />
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <AppShellLayout
              sidebarOpen={sidebarOpen}
              closeSidebar={closeSidebar}
              setSidebarOpen={setSidebarOpen}
            />
          }
        >
          <Route
            path="/dashboard"
            element={
              <RoleGuard allowedRoles={["Employee"]}>
                <Dashboard
                  leaveRequests={leaveRequests}
                  isLoading={leaveLoading}
                />
              </RoleGuard>
            }
          />

          <Route
            path="/apply"
            element={
              <RoleGuard allowedRoles={["Employee"]}>
                <ApplyLeave
                  onAddLeave={addLeaveRequest}
                  editingRequest={editingRequest}
                  onUpdateLeave={handleUpdateLeave}
                  isSubmitting={
                    actionLoading === "add" ||
                    (editingRequest && actionLoading === `update-${editingRequest.id}`)
                  }
                />
              </RoleGuard>
            }
          />

          <Route
            path="/manager"
            element={
              <RoleGuard allowedRoles={["Manager"]}>
                <ManagerDashboard
                  leaveRequests={leaveRequests}
                  isLoading={leaveLoading}
                  onUpdateStatus={updateLeaveStatus}
                  actionLoading={actionLoading}
                />
              </RoleGuard>
            }
          />

          <Route
            path="/history"
            element={
              <RoleGuard allowedRoles={["Employee", "Manager"]}>
                <LeaveHistory
                  leaveRequests={leaveRequests}
                  isLoading={leaveLoading}
                  onUpdateStatus={updateLeaveStatus}
                  onDeleteRequest={deleteLeaveRequest}
                  onEditRequest={startEditingRequest}
                  userRole={user?.role ?? "Employee"}
                  actionLoading={actionLoading}
                />
              </RoleGuard>
            }
          />

          <Route
            path="/chat"
            element={
              <RoleGuard allowedRoles={["Employee", "Manager"]}>
                <ChatPage />
              </RoleGuard>
            }
          />

          <Route path="*" element={<Navigate to={homeRoute} replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;