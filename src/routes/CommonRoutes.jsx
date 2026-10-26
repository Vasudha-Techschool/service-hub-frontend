
import { Routes, Route, Navigate } from "react-router-dom";

const CommonRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/provider/register" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default CommonRoutes;
