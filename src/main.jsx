import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import { ToastProvider } from "./context/ToastContext.jsx";
import { AuthProvider }  from "./auth/AuthContext.jsx";
import { ChatProvider }  from "./chat/ChatContext.jsx";
import App from "./App";

// Initialise mock API layer before anything renders
import "./api/mockSetup";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);