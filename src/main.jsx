import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider }        from "./context/ToastContext.jsx";
import { AuthProvider }         from "./auth/AuthContext.jsx";
import { ChatProvider }         from "./chat/ChatContext.jsx";
import { NotificationProvider } from "./notifications/NotificationContext.jsx";
import App from "./App";
import "./index.css";
import "./api/mockSetup";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);