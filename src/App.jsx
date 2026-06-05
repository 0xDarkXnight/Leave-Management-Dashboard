import { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveHistory from "./pages/LeaveHistory";
import LoginPage from "./pages/LoginPage";

import AppShellLayout from "./layouts/AppShellLayout";

const STORAGE_KEY = "leave_requests";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : [];
    } catch {
      return [];
    }
  });

  const [editingRequest, setEditingRequest] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const closeSidebar = () => setSidebarOpen(false);

  const addLeaveRequest = (requestData) => {
    const newRequest = {
      id: Date.now(),
      ...requestData,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);
  };

  const updateLeaveStatus = (id, newStatus) => {
    setLeaveRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, status: newStatus }
          : request
      )
    );
  };

  const deleteLeaveRequest = (id) => {
    setLeaveRequests((prev) =>
      prev.filter((request) => request.id !== id)
    );
  };

  const startEditingRequest = (id) => {
    const request = leaveRequests.find(
      (request) => request.id === id
    );

    if (request) {
      setEditingRequest(request);
    }
  };

  const updateLeaveRequest = (updatedRequest) => {
    setLeaveRequests((prev) =>
      prev.map((request) =>
        request.id === updatedRequest.id
          ? updatedRequest
          : request
      )
    );

    setEditingRequest(null);
  };

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

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
            <Dashboard leaveRequests={leaveRequests} />
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
            />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;