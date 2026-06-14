import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      "useToast() must be called inside a <ToastProvider>. " +
      "Check that ToastProvider wraps your app in main.jsx."
    );
  }
  return ctx;
}