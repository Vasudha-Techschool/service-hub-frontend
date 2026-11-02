
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
  "ai-assistant": "AI Assistant",
  services: "Find Services",
  bookings: "My Bookings",
  messages: "Messages",
  notifications: "Notifications",
  reviews: "My Reviews",
  complaints: "Complaints",
  profile: "My Profile",
  providers: "Provider Details",
};

export default function CustomerHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");

  const user = useSelector((state) => state.auth.user);

  const displayName =
    user?.full_name ||
    user?.name ||
    user?.username ||
    user?.email ||
    "Customer";

  const pathParts = location.pathname
    .split("/")
    .filter(Boolean);

  const currentRoute =
    pathParts[pathParts.length - 1] || "dashboard";

  // Detect /customer/providers/:id without using the ID as a title.
  const isProviderDetails =
    pathParts.length === 3 &&
    pathParts[0] === "customer" &&
    pathParts[1] === "providers" &&
    /^\d+$/.test(pathParts[2]);

  // Detect other provider routes if needed.
  const isProviderRoute =
    pathParts[0] === "customer" &&
    pathParts[1] === "providers";

  const pageTitle = isProviderDetails
    ? "Provider Details"
    : isProviderRoute
      ? "Provider Details"
      : pageNames[currentRoute] ||
        currentRoute
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchTerm.trim();

    if (query) {
      navigate(
        `/customer/services?search=${encodeURIComponent(query)}`
      );
    }
  };

  const goToDashboard = () => {
    navigate("/customer/dashboard");
  };

  const goToServices = () => {
    navigate("/customer/services");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-3 px-3 sm:px-6">
        {/* Left: Menu and page title */}
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

            {/* Dynamic breadcrumbs */}
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

              {isProviderDetails ? (
                <>
                  <ChevronRight
                    size={13}
                    className="shrink-0"
                  />

                  <button
                    type="button"
                    onClick={goToServices}
                    className="shrink-0 transition hover:text-green-700"
                  >
                    Find Services
                  </button>

                  <ChevronRight
                    size={13}
                    className="shrink-0"
                  />

                  <span className="truncate font-medium text-gray-700">
                    Provider Details
                  </span>
                </>
              ) : currentRoute !== "dashboard" ? (
                <>
                  <ChevronRight
                    size={13}
                    className="shrink-0"
                  />

                  <span className="truncate font-medium text-gray-700">
                    {pageTitle}
                  </span>
                </>
              ) : null}
            </nav>
          </div>
        </div>

        {/* Center: Service search */}
        <form
          onSubmit={handleSearch}
          className="mx-auto flex min-w-0 max-w-md flex-1 items-center"
        >
          <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition focus-within:border-green-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100">
            <Search
              size={18}
              className="shrink-0 text-gray-400"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search services..."
              aria-label="Search services"
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

        {/* Right: Notifications and customer profile */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <button
            type="button"
            onClick={() =>
              navigate("/customer/notifications")
            }
            aria-label="View notifications"
            className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-green-700"
          >
            <Bell size={21} />
          </button>

          <button
            type="button"
            onClick={() => navigate("/customer/profile")}
            aria-label="Open customer profile"
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
