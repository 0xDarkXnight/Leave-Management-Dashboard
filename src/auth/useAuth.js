import { useContext } from "react";
import { AuthContext } from "./context";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuth() must be called inside an <AuthProvider>. " +
      "Make sure AuthProvider wraps your component tree in main.jsx."
    );
  }
  return ctx;
}