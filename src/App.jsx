import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import TopHeader from "./components/TopHeader";
import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveHistory from "./pages/LeaveHistory";
import { useEffect } from "react";

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

  return (
    <div className="app-shell">
      <Navbar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="main-wrapper">
        <TopHeader onMenuToggle={() => setSidebarOpen((o) => !o)} />

        <main className="content-area">
          <Routes>
            <Route
              path="/"
              element={<Dashboard leaveRequests={leaveRequests} />}
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
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;