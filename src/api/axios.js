
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

// Prevent multiple refresh requests at the same time
let refreshPromise = null;

const publicEndpoints = [
  "/api/auth/customer/register/",
  "/api/auth/provider/register/",
  "/api/auth/customer/login/",
  "/api/auth/provider/login/",
  "/api/auth/admin/login/",
  "/api/token/refresh/",
];

// Clear tokens and redirect when the session expires
const handleSessionExpired = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  const path = window.location.pathname;

  if (path.startsWith("/admin")) {
    window.location.assign("/admin/login");
  } else if (path.startsWith("/customer")) {
    window.location.assign("/customer/login");
  } else {
    window.location.assign("/provider/login");
  }
};

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (isPublicEndpoint) {
      delete config.headers.Authorization;
      delete config.headers.authorization;
    } else {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("access");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Handle only 401 errors
    if (
      error.response?.status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    // Do not refresh login, registration or refresh requests
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    if (isPublicEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken =
      localStorage.getItem("refreshToken") ||
      localStorage.getItem("refresh");

    if (!refreshToken) {
      handleSessionExpired();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Reuse an ongoing refresh request if one already exists
      if (!refreshPromise) {
        refreshPromise = axios
          .post(
            "/api/token/refresh/",
            { refresh: refreshToken },
            { baseURL: BASE_URL }
          )
          .then((response) => {
            const newAccessToken = response.data.access;

            if (!newAccessToken) {
              throw new Error("New access token not received.");
            }

            localStorage.setItem("accessToken", newAccessToken);

            // Save a rotated refresh token if the backend returns one
            if (response.data.refresh) {
              localStorage.setItem(
                "refreshToken",
                response.data.refresh
              );
            }

            return newAccessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      // Update the original request with the new access token
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      // Retry the original API request
      return api(originalRequest);

    } catch (refreshError) {
      handleSessionExpired();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
