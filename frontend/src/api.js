// Centralized Axios instance for all API requests.
// Automatically injects JWT token into headers and
// handles unauthorized responses globally.

import axios from "axios";

// Change this when deploying to production.
const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//Auto-logout user if token becomes invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      localStorage.getItem("token")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

    }

    return Promise.reject(error);
  }
);

export default api;
