
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks/authHook";

const ProtectedRoute = ({ allowedRole }) => {
  const location = useLocation();

  const accessToken = useAppSelector(
    (state) => state.auth.accessToken
  );

  const user = useAppSelector(
    (state) => state.auth.user
  );

  const isAuthChecked = useAppSelector(
    (state) => state.auth.isAuthChecked
  );

  if (!isAuthChecked) {
    return <div className="p-6 text-center">Checking authentication...</div>;
  }

  if (!accessToken) {
    return (
      <Navigate
        to={`/${allowedRole}/login`}
        replace
        state={{ from: location }}
      />
    );
  }

  if (user?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
