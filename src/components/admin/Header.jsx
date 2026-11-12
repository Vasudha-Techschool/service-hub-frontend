
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, ChevronRight } from "lucide-react";
import api from "../../api/axios";
import { getAdminUnreadNotificationCount } from "../../services/adminService";
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
  try {
    const response = await getAdminUnreadNotificationCount();
    setUnreadCount(response.unread_count || 0);
  } catch (error) {
    console.error("Failed to fetch notification count:", error);
  }
};

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  const breadcrumbs = location.pathname
    .split("/")
    .filter(Boolean)
    .map((part, index, parts) => ({
      label: part
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      path: "/" + parts.slice(0, index + 1).join("/"),
    }));

  return (
    <header className="flex min-h-[72px] shrink-0 flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-3 shadow-sm md:px-8">
      <div>
        <div className="flex flex-wrap items-center gap-1 text-xs text-slate-400">
          <Link to="/admin/dashboard" className="hover:text-violet-600">
            Home
          </Link>

          {breadcrumbs
            .filter((item) => item.label !== "Admin")
            .map((item, index, items) => (
              <span key={item.path} className="flex items-center gap-1">
                <ChevronRight size={13} />
                <span
                  className={
                    index === items.length - 1
                      ? "font-medium text-violet-600"
                      : ""
                  }
                >
                  {item.label}
                </span>
              </span>
            ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm sm:flex">
          <Search size={17} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-32 bg-transparent text-sm outline-none lg:w-44"
          />
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/notifications")}
          aria-label="View notifications"
          className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 shadow-sm transition hover:bg-violet-50 hover:text-violet-600 hover:shadow-md"
        >
          <Bell size={20} />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700">
            A
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">Admin</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
