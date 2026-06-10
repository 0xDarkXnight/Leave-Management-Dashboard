import { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth }                        from "./auth/useAuth";
import { loadLeaveRequests, saveLeaveRequests } from "./auth/storage";

import Dashboard        from "./pages/Dashboard";
import ApplyLeave       from "./pages/ApplyLeave";
import LeaveHistory     from "./pages/LeaveHistory";
import LoginPage        from "./pages/LoginPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import AppShellLayout   from "./layouts/AppShellLayout";
import ProtectedRoute   from "./components/ProtectedRoute";
import RoleGuard        from "./components/RoleGuard";

function App() {
  const { isAuthenticated, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [leaveRequests, setLeaveRequests] = useState(() =>
    loadLeaveRequests()
  );
  const [editingRequest, setEditingRequest] = useState(null);

  useEffect(() => {
    saveLeaveRequests(leaveRequests);
  }, [leaveRequests]);

  const closeSidebar = () => setSidebarOpen(false);

  const addLeaveRequest = (requestData) => {
    const newRequest = {
      id:        Date.now(),
      ...requestData,
      status:    "Pending",
      createdAt: new Date().toISOString(),
    };
    setLeaveRequests((prev) => [newRequest, ...prev]);
  };

  const updateLeaveStatus = (id, newStatus) =>
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

  const deleteLeaveRequest = (id) =>
    setLeaveRequests((prev) => prev.filter((r) => r.id !== id));

  const startEditingRequest = (id) => {
    const request = leaveRequests.find((r) => r.id === id);
    if (request) setEditingRequest(request);
  };

  const updateLeaveRequest = (updatedRequest) => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
    );
    setEditingRequest(null);
  };

  const homeRoute = user?.role === "Manager" ? "/manager" : "/dashboard";

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? homeRoute : "/login"} replace />
        }
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
                <Dashboard leaveRequests={leaveRequests} />
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
                  onUpdateLeave={updateLeaveRequest}
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
                  onUpdateStatus={updateLeaveStatus}
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
                  onUpdateStatus={updateLeaveStatus}
                  onDeleteRequest={deleteLeaveRequest}
                  onEditRequest={startEditingRequest}
                  userRole={user?.role ?? "Employee"}
                />
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