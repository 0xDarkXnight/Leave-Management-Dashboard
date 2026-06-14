const appConfig = {
  appName: import.meta.env.VITE_APP_NAME ?? "Leave Management System",

  appVersion: import.meta.env.VITE_APP_VERSION ?? "1.0.0",

  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",

  requestTimeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT ?? 8000),

  enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === "true",
};

export default appConfig;