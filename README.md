# Leave Management Dashboard

A modern Leave Management Dashboard built with **React**, **Vite**, and **React Router** that allows users to manage leave requests efficiently through a clean and responsive interface.

## Features

### Dashboard
- View overall leave statistics
- Total Leave Requests
- Pending Requests
- Approved Requests
- Rejected Requests

### Leave Application
- Submit new leave requests
- Enter employee details and leave information
- Automatically assigns new requests a **Pending** status

### Leave History
- View all submitted leave requests
- Edit existing requests
- Delete requests
- Approve or Reject requests
- Track request status in real-time

### Data Persistence
- Stores all leave requests in **Local Storage**
- Data remains available after page refreshes

### Responsive UI
- Mobile-friendly design
- Modern dark theme
- Clean dashboard layout

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React | Frontend UI |
| Vite | Build Tool |
| React Router DOM | Client-side Routing |
| JavaScript (ES6+) | Application Logic |
| CSS3 | Styling |
| Local Storage API | Data Persistence |

## Project Structure

```text
src/
│
├── components/
│   ├── LeaveForm.jsx
│   ├── LeaveTable.jsx
│   ├── Navbar.jsx
│   └── SummaryCard.jsx
│
├── pages/
│   ├── Dashboard.jsx
│   ├── ApplyLeave.jsx
│   └── LeaveHistory.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/leave-management-dashboard.git
```

### 2. Navigate to Project Directory

```bash
cd leave-management-dashboard
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## Available Scripts

### Run Development Server

```bash
npm run dev
```

### Create Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run ESLint

```bash
npm run lint
```

## Application Workflow

1. Open the dashboard.
2. Navigate to **Apply Leave**.
3. Submit a leave request.
4. Request is stored with **Pending** status.
5. View requests in **Leave History**.
6. Approve, Reject, Edit, or Delete requests.
7. Dashboard statistics update automatically.

## Key Functionalities

### Create Leave Request

Users can submit:
- Employee Name
- Leave Type
- Start Date
- End Date
- Reason

### Update Status

Requests can be marked as:
- Pending
- Approved
- Rejected

### Edit Request

Existing leave applications can be modified and updated.

### Delete Request

Leave requests can be permanently removed from the system.

### Persistent Storage

All data is stored in browser Local Storage and automatically restored when the application reloads.

## Learning Objectives

This project demonstrates:

- React Components
- React Hooks (`useState`, `useEffect`)
- React Router
- State Management
- Form Handling
- CRUD Operations
- Local Storage Integration
- Responsive UI Design

## License

This project is open source and available under the MIT License.