
import { useLocation, useNavigate } from "react-router-dom";

export default function ProviderHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle =
    location.pathname === "/provider/profile"
      ? "My Profile"
      : "Dashboard";

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-6 md:px-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {pageTitle}
        </h2>
        <p className="text-sm text-gray-500">
          Manage your service business
        </p>
      </div>

      <button
        onClick={() => navigate("/provider/profile")}
        className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-700">
          P
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium text-gray-800">
            Provider
          </p>
          <p className="text-xs text-gray-500">
            View Profile
          </p>
        </div>
      </button>
    </header>
  );
}
