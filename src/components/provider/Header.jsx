import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  UserRound,
  Search,
  X,
  ChevronRight,
  Home,
} from "lucide-react";
import { useSelector } from "react-redux";

const pageNames = {
  dashboard: "Dashboard",
  bookings: "Service Requests",
  services: "My Services",
  availability: "Availability",
  messages: "Messages",
  notifications: "Notifications",
  reviews: "My Reviews",
  profile: "My Profile",
  verification: "Verification",
};

export default function ProviderHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");

  const user = useSelector((state) => state.auth.user);

  const displayName =
    user?.full_name ||
    user?.name ||
    user?.username ||
    user?.email ||
    "Provider";

  const pathParts = location.pathname
    .split("/")
    .filter(Boolean);

  const currentRoute =
    pathParts[pathParts.length - 1] || "dashboard";

  const isBookingDetails =
    pathParts.length === 3 &&
    pathParts[0] === "provider" &&
    pathParts[1] === "bookings" &&
    /^\d+$/.test(pathParts[2]);

  const pageTitle = isBookingDetails
    ? "Request Details"
    : pageNames[currentRoute] ||
      currentRoute
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchTerm.trim();

    if (query) {
      navigate(
        `/provider/bookings?search=${encodeURIComponent(query)}`
      );
    }
  };

  const goToDashboard = () => {
    navigate("/provider/dashboard");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-3 px-3 sm:px-6">

        {/* Left: Menu and Page Title */}
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
              {pageTitle}
            </h1>

            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mt-0.5 flex items-center gap-1 text-xs text-gray-500"
            >
              <button
                type="button"
                onClick={goToDashboard}
                className="flex shrink-0 items-center gap-1 transition hover:text-green-700"
              >
                <Home size={12} />
                Home
              </button>

              {currentRoute !== "dashboard" && (
                <>
                  <ChevronRight size={13} className="shrink-0" />

                  <span className="truncate font-medium text-gray-700">
                    {pageTitle}
                  </span>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Center: Search */}
        <form
          onSubmit={handleSearch}
          className="mx-auto flex min-w-0 max-w-md flex-1 items-center"
        >
          <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition focus-within:border-green-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100">
            <Search size={18} className="shrink-0 text-gray-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search requests..."
              aria-label="Search requests"
              className="w-full min-w-0 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="shrink-0 text-gray-400 transition hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </form>

        {/* Right: Notifications and Profile */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <button
            type="button"
            onClick={() =>
              navigate("/provider/notifications")
            }
            aria-label="View notifications"
            className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-green-700"
          >
            <Bell size={21} />
          </button>

          <button
            type="button"
            onClick={() => navigate("/provider/profile")}
            aria-label="Open provider profile"
            className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-gray-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 text-green-800">
              <UserRound size={19} />
            </div>

            <span className="hidden max-w-32 truncate text-sm font-medium text-gray-700 md:block">
              {displayName}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}