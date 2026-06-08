import { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard        from "./pages/Dashboard";
import ApplyLeave       from "./pages/ApplyLeave";
import LeaveHistory     from "./pages/LeaveHistory";
import LoginPage        from "./pages/LoginPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import AppShellLayout   from "./layouts/AppShellLayout";

const STORAGE_KEY   = "lms_leave_requests";
const ROLE_STORAGE  = "lms_role";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [userRole, setUserRole] = useState(
    () => localStorage.getItem(ROLE_STORAGE) || "Employee"
  );

  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [editingRequest, setEditingRequest] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const handleLogin = (role) => {
    setUserRole(role);
    localStorage.setItem(ROLE_STORAGE, role);
  };

  const handleLogout = () => {
    setUserRole("Employee");
    localStorage.removeItem(ROLE_STORAGE);
  };

  const closeSidebar = () => setSidebarOpen(false);

  const addLeaveRequest = (requestData) => {
    const newRequest = {
      id: Date.now(),
      ...requestData,
      status:    "Pending",
      createdAt: new Date().toISOString(),
    };
    setLeaveRequests((prev) => [newRequest, ...prev]);
  };

  const updateLeaveStatus = (id, newStatus) => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const deleteLeaveRequest = (id) => {
    setLeaveRequests((prev) => prev.filter((r) => r.id !== id));
  };

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

  const homeRoute = userRole === "Manager" ? "/manager" : "/dashboard";

  return (
    <Routes>
      <Route
        path="/"
        element={<LoginPage onLogin={handleLogin} />}
      />

      <Route
        element={
          <AppShellLayout
            sidebarOpen={sidebarOpen}
            closeSidebar={closeSidebar}
            setSidebarOpen={setSidebarOpen}
            userRole={userRole}
            onLogout={handleLogout}
          />
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard leaveRequests={leaveRequests} />}
        />

        <Route
          path="/manager"
          element={
            <ManagerDashboard
              leaveRequests={leaveRequests}
              onUpdateStatus={updateLeaveStatus}
            />
          }
        />

        <Route
          path="/apply"
          element={
            <ApplyLeave
              onAddLeave={addLeaveRequest}
              editingRequest={editingRequest}
              onUpdateLeave={updateLeaveRequest}
            />
          }
        />

        <Route
          path="/history"
          element={
            <LeaveHistory
              leaveRequests={leaveRequests}
              onUpdateStatus={updateLeaveStatus}
              onDeleteRequest={deleteLeaveRequest}
              onEditRequest={startEditingRequest}
              userRole={userRole}
            />
          }
        />

        <Route path="*" element={<Navigate to={homeRoute} replace />} />
      </Route>
    </Routes>
  );
}

export default App;