import MockAdapter from "axios-mock-adapter";
import axiosInstance from "./axiosInstance";
import { loadLeaveRequests, saveLeaveRequests } from "../auth/storage";

const MOCK_USERS = [
  {
    id:       "emp-001",
    name:     "John Doe",
    email:    "employee@lms.com",
    password: "employee123",
    role:     "Employee",
    initials: "JD",
  },
  {
    id:       "mgr-001",
    name:     "Sarah Mitchell",
    email:    "manager@lms.com",
    password: "manager123",
    role:     "Manager",
    initials: "SM",
  },
];

const mock = new MockAdapter(axiosInstance, { delayResponse: 400 });

mock.onPost("/auth/login").reply((config) => {
  const { email, password } = JSON.parse(config.data);
  const found = MOCK_USERS.find(
    (u) =>
      u.email.toLowerCase() === email?.trim().toLowerCase() &&
      u.password === password
  );

  if (!found) {
    return [
      401,
      { message: "Invalid email or password. Please check your credentials and try again." },
    ];
  }

  const publicUser = {
    id:       found.id,
    name:     found.name,
    email:    found.email,
    role:     found.role,
    initials: found.initials,
  };
  return [200, { user: publicUser, message: "Login successful." }];
});

mock.onPost("/auth/logout").reply(200, { message: "Logged out successfully." });

mock.onGet("/leave").reply(() => {
  const requests = loadLeaveRequests();
  return [200, { data: requests, total: requests.length }];
});

mock.onPost("/leave").reply((config) => {
  const body     = JSON.parse(config.data);
  const requests = loadLeaveRequests();

  const newRequest = {
    id:        Date.now(),
    ...body,
    status:    "Pending",
    createdAt: new Date().toISOString(),
  };

  saveLeaveRequests([newRequest, ...requests]);
  return [201, { data: newRequest, message: "Leave request submitted successfully." }];
});

mock.onPatch(/\/leave\/\d+\/status/).reply((config) => {
  const id       = Number(config.url.split("/")[2]);
  const { status } = JSON.parse(config.data);
  const requests = loadLeaveRequests();
  const updated  = requests.map((r) => (r.id === id ? { ...r, status } : r));

  saveLeaveRequests(updated);

  const result = updated.find((r) => r.id === id);
  if (!result) return [404, { message: "Leave request not found." }];

  return [200, { data: result, message: `Leave request ${status.toLowerCase()} successfully.` }];
});

mock.onPatch(/\/leave\/\d+$/).reply((config) => {
  const id       = Number(config.url.split("/").pop());
  const body     = JSON.parse(config.data);
  const requests = loadLeaveRequests();
  const updated  = requests.map((r) => (r.id === id ? { ...r, ...body } : r));

  saveLeaveRequests(updated);

  const result = updated.find((r) => r.id === id);
  if (!result) return [404, { message: "Leave request not found." }];

  return [200, { data: result, message: "Leave request updated successfully." }];
});

mock.onDelete(/\/leave\/\d+/).reply((config) => {
  const id       = Number(config.url.split("/").pop());
  const requests = loadLeaveRequests();
  const existed  = requests.some((r) => r.id === id);

  if (!existed) return [404, { message: "Leave request not found." }];

  saveLeaveRequests(requests.filter((r) => r.id !== id));
  return [200, { message: "Leave request deleted successfully." }];
});