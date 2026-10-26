
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/provider/Login";
import Register from "../pages/provider/Register";
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import ProviderProfile from "../pages/provider/ProviderProfile";

import ProviderLayout from "../components/provider/layout/ProviderLayout";

const ProviderRoutes = () => {
  return (
    <Routes>
      {/* Public provider pages */}
      <Route path="login" element={<Login role="provider" />} />
      <Route path="register" element={<Register />} />

      {/* Protected provider pages */}
      <Route element={<ProtectedRoute allowedRole="provider" />}>
        <Route element={<ProviderLayout />}>
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<ProviderDashboard />}
          />

          <Route
            path="profile"
            element={<ProviderProfile />}
          />

          <Route
            path="*"
            element={<Navigate to="/provider/dashboard" replace />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default ProviderRoutes;
