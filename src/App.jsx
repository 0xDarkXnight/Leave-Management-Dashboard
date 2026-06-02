import { useEffect, useState } from "react";
import { 
  Navigate,
  Route,
  Routes 
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveHistory from "./pages/LeaveHistory";

const STORAGE_KEY = "leave_requests";

function App() {
  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  });

  const [editingRequest, setEditingRequest] = useState(null);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const addLeaveRequest = (requestData) => {
    const newRequest = {
      id: Date.now(),
      ...requestData,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setLeaveRequests((prevRequests) => [newRequest, ...prevRequests]);
  };

  const updateLeaveStatus = (id, newStatus) => {
    setLeaveRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
  };

  const deleteLeaveRequest = (id) => {
    setLeaveRequests((prevRequests) =>
      prevRequests.filter(
        (request) => request.id !== id
      )
    );
  };

  const startEditingRequest = (id) => {
    const request = leaveRequests.find(
      (item) => item.id === id
    );

    if (!request) return;

    setEditingRequest(request);
  };

  const updateLeaveRequest = (updatedRequest) => {
    setLeaveRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === updatedRequest.id
          ? updatedRequest
          : request
      )
    );

    setEditingRequest(null);
  };

  return (
    <>
      <Navbar />
      <main className="container">
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
    </>
  );
}

export default App;