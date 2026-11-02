
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/provider/Login";
import Register from "../pages/provider/Register";
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import ProviderProfile from "../pages/provider/ProviderProfile";

import ProviderLayout from "../components/provider/layout/ProviderLayout";
import ProviderRequests from "../pages/provider/ProviderRequest";
import ProviderRequestDetails from "../pages/provider/ProviderRequestDetails";

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
              path="bookings"
              element={<ProviderRequests />}
            />

            <Route path="bookings/:id" element={<ProviderRequestDetails />} />

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
