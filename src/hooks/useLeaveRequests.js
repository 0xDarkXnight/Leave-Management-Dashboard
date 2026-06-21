import { useState, useCallback, useEffect } from "react";
import { leaveService } from "../services/leaveService";
import { useToast } from "./useToast";
import { useNotifications } from "../notifications/useNotifications";

export function useLeaveRequests() {
  const toast = useToast();
  const { refreshNotifications, refreshActivity } = useNotifications();

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const data = await leaveService.getAll();
        if (!cancelled) setLeaveRequests(data);
      } catch {
        if (!cancelled) toast.error("Failed to load leave requests. Please refresh the page.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const addLeaveRequest = useCallback(async (requestData) => {
    setActionLoading("add");
    try {
      const created = await leaveService.create(requestData);
      setLeaveRequests((prev) => [created, ...prev]);
      toast.success("Leave request submitted successfully!");
      refreshNotifications();
      refreshActivity();
      return { success: true };
    } catch (err) {
      toast.error(err.message ?? "Failed to submit leave request.");
      return { success: false, error: err.message };
    } finally {
      setActionLoading(null);
    }
  }, [toast, refreshNotifications, refreshActivity]);

  const updateLeaveStatus = useCallback(async (id, status) => {
    setActionLoading(`status-${id}`);
    try {
      const updated = await leaveService.updateStatus(id, status);
      setLeaveRequests((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
      const label = status === "Approved" ? "approved" : "rejected";
      toast.success(`Leave request ${label} successfully.`);
      refreshNotifications();
      refreshActivity();
      return { success: true };
    } catch (err) {
      toast.error(err.message ?? `Failed to ${status.toLowerCase()} leave request.`);
      return { success: false, error: err.message };
    } finally {
      setActionLoading(null);
    }
  }, [toast, refreshNotifications, refreshActivity]);

  const deleteLeaveRequest = useCallback(async (id) => {
    setActionLoading(`delete-${id}`);
    try {
      await leaveService.delete(id);
      setLeaveRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Leave request deleted successfully.");
      refreshActivity();
      return { success: true };
    } catch (err) {
      toast.error(err.message ?? "Failed to delete leave request.");
      return { success: false, error: err.message };
    } finally {
      setActionLoading(null);
    }
  }, [toast, refreshActivity]);

  const updateLeaveRequest = useCallback(async (updatedData) => {
    const { id, ...rest } = updatedData;
    setActionLoading(`update-${id}`);
    try {
      const updated = await leaveService.update(id, rest);
      setLeaveRequests((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
      toast.success("Leave request updated successfully.");
      refreshNotifications();
      refreshActivity();
      return { success: true };
    } catch (err) {
      toast.error(err.message ?? "Failed to update leave request.");
      return { success: false, error: err.message };
    } finally {
      setActionLoading(null);
    }
  }, [toast, refreshNotifications, refreshActivity]);

  return {
    leaveRequests,
    isLoading,
    actionLoading,
    addLeaveRequest,
    updateLeaveStatus,
    deleteLeaveRequest,
    updateLeaveRequest,
  };
}