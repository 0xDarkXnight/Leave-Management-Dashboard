import { useContext } from "react";
import { ChatContext } from "./chatContext";

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error(
      "useChat() must be called inside a <ChatProvider>. " +
      "Make sure ChatProvider wraps your component tree in main.jsx."
    );
  }
  return ctx;
}