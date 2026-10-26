
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/customer/Login";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import Register from "../pages/customer/Register";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login role="customer" />} />
      <Route path="register" element={<Register role="customer" />} />

      <Route element={<ProtectedRoute allowedRole="customer" />}>
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route
          path="*"
          element={<Navigate to="/customer/login" replace />}
        />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
