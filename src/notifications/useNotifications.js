import { useContext } from "react";
import { NotificationContext } from "./context";

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications() must be called inside a <NotificationProvider>. " +
      "Make sure NotificationProvider wraps your component tree in main.jsx."
    );
  }
  return ctx;
}
