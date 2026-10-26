
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../api/axios";
import { setCredentials } from "../../redux/slices/authSlice";

export default function ProviderLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/api/auth/admin/login/",
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }
      );


console.log("Login API response:", response.data);

      const { access, refresh } = response.data;

      if (!access || !refresh) {
        setError("The server did not return the required tokens.");
        return;
      }

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Decode the role claim from the JWT access token.
      const payload = JSON.parse(
        atob(access.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );

      console.log("Decoded payload:", payload);
console.log("User role:", payload.role);



      if (payload.role !== "admin") {
        setError("This account is not authorized as a Admin.");
        return;
      }

      // Update the shared Redux authentication state.
      dispatch(
        setCredentials({
          accessToken: access,
          refreshToken: refresh,
          user: {
            email: formData.email.trim().toLowerCase(),
            role: payload.role,
          },
        })
      );

      const destination = location.state?.from?.pathname;

      navigate(
        destination?.startsWith("/admin/")
          ? destination
          : "/admin/dashboard",
        { replace: true }
      );
    } catch (error) {
    console.log("Login error response:", error.response?.data);

    setError(
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        "Login failed. Please check your credentials."
    );
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">
          

          <h1 className="text-2xl font-bold text-slate-900">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage  Service Hub.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
}
