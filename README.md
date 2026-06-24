# OffSync

OffSync is a modern, role-based leave management workspace built with **React**, **Vite**, and **React Router**. It gives employees a clean way to apply for leave, track request status, and message their manager, while giving managers a structured dashboard to review, approve, or reject requests with real-time updates.

## 1. Title and Description

OffSync brings leave requests, approvals, notifications, activity logs, and team communication into one polished interface.

It is designed for two core user roles:

- **Employee**: submit leave requests, edit pending requests, track history, receive notifications, and chat with a manager.
- **Manager**: review requests, take approval actions, monitor team activity, and respond through the built-in message panel.

The project currently runs in a frontend-first mode with a mock API layer, local storage persistence, and optional backend configuration through environment variables.

## 2. Architecture

- **Presentation layer**  
  Pages and reusable UI components render the experience: dashboard, leave form, history table, login screen, notifications, activity feed, and chat panels.

- **State and context layer**  
  `AuthProvider`, `ChatProvider`, `NotificationProvider`, and `ToastProvider` share app-wide state such as the current user, unread notifications, conversations, and toast messages.

- **Feature hooks layer**  
  Custom hooks like `useLeaveRequests`, `useAuth`, `useChat`, `useNotifications`, and `useToast` keep the logic organized and reusable.

- **Service layer**  
  API-facing modules (`authService`, `leaveService`, `chatService`, `notificationService`) centralize server calls and keep components lightweight.

- **Mock API layer**  
  `axios-mock-adapter` intercepts requests when mock mode is enabled, so the app can run without a separate backend during development or demo mode.

- **Persistence layer**  
  Leave requests, chats, notifications, activity, and auth session data are stored in `localStorage` for fast client-side persistence across refreshes.

- **Realtime sync layer**  
  `BroadcastChannel`-based socket emulation keeps messages, notifications, presence, typing indicators, and activity updates in sync across open tabs.

- **Routing and access control**  
  React Router powers the navigation flow, while `ProtectedRoute` and `RoleGuard` restrict access based on authentication status and user role.

- **Deployment layer**  
  The app can be deployed as a static SPA on **Vercel** or packaged with **Docker + Nginx** for containerized hosting.

## 3. Features

- **Role-based login**
  - Separate employee and manager login modes
  - Demo credentials for quick testing
  - Password visibility toggle and inline validation
  - Redirects users to the correct dashboard after sign-in

- **Employee dashboard**
  - Leave summary cards with live counts
  - Recent leave activity overview
  - Friendly empty and loading states
  - Quick navigation to apply for leave

- **Leave application and editing**
  - Create new leave requests
  - Edit existing requests from history
  - Auto-fills employee name from the logged-in session
  - Field-level validation for dates and reason length
  - Prevents invalid date ranges and past dates for new submissions

- **Leave history management**
  - Search by employee name
  - Filter by request status
  - View leave type, date range, duration, reason, submission time, and status
  - Edit and delete requests from the same view
  - Responsive table and mobile card layout

- **Manager workflow**
  - Dedicated manager dashboard
  - Review all team requests in one place
  - Approve or reject with confirmation modal
  - Filter by request status
  - See summary statistics for team leave activity

- **Notifications**
  - Live unread badge and notification dropdown/page
  - Mark single or all notifications as read
  - Dismiss notifications
  - Route users to the related page from a notification

- **Chat**
  - Built-in employee/manager conversation area
  - Conversation list with unread counts
  - Message sending with optimistic UI
  - Typing indicators
  - Presence awareness across tabs

- **Activity tracking**
  - Chronological activity feed for sign-ins, sign-outs, leave actions, and messages
  - Manager-visible full activity timeline
  - Employee-visible personal activity relevant to their account

- **User experience**
  - Toast feedback for success and error states
  - Confirmation dialogs for approve/reject/delete actions
  - Clean dark UI styling with responsive layout
  - Accessible form labels, keyboard-friendly controls, and error messaging

- **Development and runtime support**
  - Mock API mode for standalone development
  - Backend-ready API configuration
  - Vite-powered fast local development
  - Docker and Vercel deployment support

## 4. Getting Started

### 4.1 Prerequisites

- **Node.js 20+** recommended
- **npm** or another Node package manager
- Optional: **Docker** if you want to run the containerized build
- Optional: a backend service if you plan to disable mock mode

### 4.2 Installation

```bash
git clone <your-repository-url>
cd OffSync
npm install
```

### 4.3 Configuration

Create a `.env` file in the project root. You can start from `.env.example`.

```env
VITE_APP_NAME=OffSync
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:3000/api
VITE_REQUEST_TIMEOUT=8000
VITE_ENABLE_MOCK_API=true
```

What each variable does:

- `VITE_APP_NAME` sets the displayed application name.
- `VITE_APP_VERSION` tags the build version.
- `VITE_API_BASE_URL` points to the backend API when mock mode is disabled.
- `VITE_REQUEST_TIMEOUT` controls API request timeout in milliseconds.
- `VITE_ENABLE_MOCK_API` enables the built-in mock API layer when set to `true`.

Demo credentials used by the login screen:

```text
Employee
Email: employee@lms.com
Password: employee123

Manager
Email: manager@lms.com
Password: manager123
```

### 4.4 Running Locally

Start the development server:

```bash
npm run dev
```

Then open the app in your browser, sign in with one of the demo accounts, and explore the role-specific workspace.

## 5. Usage

### Employee flow

1. Sign in as an employee.
2. Open **Apply Leave**.
3. Fill in the leave type, dates, and reason.
4. Submit the request.
5. Check **Leave History** to track status updates.
6. Review notifications and chat with the manager when needed.

### Manager flow

1. Sign in as a manager.
2. Open **Manager Dashboard**.
3. Review pending leave requests.
4. Approve or reject a request using the confirmation modal.
5. Track team activity through notifications and the activity feed.
6. Respond to employee messages through the chat screen.

### Useful behaviors

- Edit a pending request directly from the leave history table.
- Delete a request with confirmation.
- Switch browser tabs to see realtime sync behavior across sessions.
- Use the search and filter controls to narrow down requests quickly.

## 6. Deployment

### Vercel

The repository includes a `vercel.json` rewrite rule so React Router paths resolve correctly on refresh. For Vercel deployment:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Set the environment variables if you want to override the defaults.
4. Deploy the app as a static frontend.

### Docker

The project also includes a multi-stage `Dockerfile`, `docker-compose.yml`, `nginx.conf`, and `.dockerignore`.

Run the containerized version with:

```bash
docker compose --env-file .env.docker up --build
```

This builds the Vite app, serves it through Nginx, and exposes it on port `5173`.

## 7. Project Status

OffSync is in a strong frontend-complete state with:

- authentication and role routing
- leave request CRUD
- approval workflow
- notifications
- chat
- activity logging
- responsive UI
- mock API support

The codebase is ready for a real backend integration by switching `VITE_ENABLE_MOCK_API` to `false` and pointing `VITE_API_BASE_URL` to the live service.

## 8. Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test locally with `npm run dev` and `npm run build`.
5. Open a pull request with a clear summary of the update.

A few good contribution ideas:

- connect a real backend
- extend manager analytics
- improve notifications and message workflows
- add export/download options for leave history
- strengthen accessibility and mobile polish

## 9. Project License

A license file is not included in the repository yet.  
Add your preferred license before publishing the project publicly.

## References

- React
- Vite
- React Router DOM
- Axios
- axios-mock-adapter
- Docker
- Nginx
- Vercel
- Browser `localStorage`
- Browser `BroadcastChannel`
