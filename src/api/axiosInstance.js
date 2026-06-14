import axios from "axios";
import appConfig from "../config/appConfig";
import { loadAuthUser } from "../auth/storage";

const axiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: appConfig.requestTimeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = loadAuthUser();
    if (user?.id) {
      config.headers["X-User-Id"]   = user.id;
      config.headers["X-User-Role"] = user.role;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message;

    if (error.response) {
      message =
        error.response.data?.message ??
        `Server error (${error.response.status}). Please try again.`;
    } else if (error.request) {
      message =
        "Unable to reach the server. Check your connection and try again.";
    } else {
      message = error.message ?? "An unexpected error occurred.";
    }

    const normalised     = new Error(message);
    normalised.status    = error.response?.status;
    normalised.errorData = error.response?.data;

    return Promise.reject(normalised);
  }
);

export default axiosInstance;