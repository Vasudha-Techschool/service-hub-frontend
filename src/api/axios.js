
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
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
