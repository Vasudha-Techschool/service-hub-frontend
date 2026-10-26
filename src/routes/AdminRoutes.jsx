
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/admin/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";

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
          path="*"
          element={<Navigate to="/admin/dashboard" replace />}
        />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
