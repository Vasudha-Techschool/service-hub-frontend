
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/admin/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProviderManagement from "../pages/admin/ProviderManagement";
import AdminComplaints from "../pages/admin/AdminComplaints";
import AdminNotifications from "../pages/admin/AdminNotifications";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login role="admin" />} />

      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />
        <Route
              path="/providers"
              element={<ProviderManagement />}
            />
        <Route
              path="/complaints"
              element={<AdminComplaints />}
            />
            <Route
              path="/notifications"
              element={<AdminNotifications />}
            />





        <Route
          path="*"
          element={<Navigate to="/admin/dashboard" replace />}
        />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
