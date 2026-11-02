
import axios from "axios";

const BASE_URL=import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const publicEndpoints = [
      "/api/auth/customer/register/",
      "/api/auth/provider/register/",
      "/api/auth/customer/login/",
      "/api/auth/provider/login/",
      "/api/auth/admin/login/",
    ];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (isPublicEndpoint) {
      // Do not send a stale token to public endpoints
      if (typeof config.headers?.delete === "function") {
        config.headers.delete("Authorization");
      } else if (config.headers) {
        delete config.headers.Authorization;
        delete config.headers.authorization;
      }
    } else {
      // Attach the token to protected API requests
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

export default api;
