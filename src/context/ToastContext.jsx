import { useState, useCallback, useRef } from "react";
import { ToastContext } from "./toastContext";
import Toast from "../components/Toast";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const add = useCallback((message, type = "info", duration = 4500) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur)  => add(msg, "success", dur),
    error:   (msg, dur)  => add(msg, "error",   dur ?? 6000),
    info:    (msg, dur)  => add(msg, "info",     dur),
    warning: (msg, dur)  => add(msg, "warning",  dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="toast-container"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}