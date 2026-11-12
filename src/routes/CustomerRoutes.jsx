
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/customer/Login";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import Register from "../pages/customer/Register";
import api from "../api/axios";
import CustomerSearchPage from "../pages/customer/SearchPage";
import ProviderDetailsPage from "../pages/customer/ProviderDetailsPage";
import MyBookings from "../pages/customer/Mybooking";
import CustomerComplaints from "../pages/customer/CustomerComplaints";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login role="customer" />} />
      <Route path="register" element={<Register role="customer" />} />

      <Route element={<ProtectedRoute allowedRole="customer" />}>
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="services" element={<CustomerSearchPage />} />
        <Route
  path="requests"
  element={<MyBookings />}
/>
<Route
  path="providers/:id"
  element={<ProviderDetailsPage />}
/>

<Route
  path="complaints"
  element={<CustomerComplaints api={api} />}
/>


        <Route
          path="*"
          element={<Navigate to="/customer/login" replace />}
        />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
