
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Bell, ChevronRight } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const breadcrumbs = location.pathname
    .split("/")
    .filter(Boolean)
    .map((part) => ({
      label: part
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      path: "/" + location.pathname
        .split("/")
        .filter(Boolean)
        .slice(0, location.pathname.split("/").filter(Boolean).indexOf(part) + 1)
        .join("/"),
    }));

  return (
    <header className="flex min-h-[72px] flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-3 md:px-8">
      <div>
        <div className="flex flex-wrap items-center gap-1 text-xs text-slate-400">
          <Link to="/admin/dashboard" className="hover:text-violet-600">
            Home
          </Link>
          {breadcrumbs.filter((item) => item.label !== "Admin").map((item, index) => (
            <span key={item.path} className="flex items-center gap-1">
              <ChevronRight size={13} />
              <span className={index === breadcrumbs.filter((b) => b.label !== "Admin").length - 1 ? "font-medium text-violet-600" : ""}>
                {item.label}
              </span>
            </span>
          ))}
        </div>
       
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
          <Search size={17} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-32 bg-transparent text-sm outline-none lg:w-44"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Toggle notifications"
            className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100"
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>

          
        </div>

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
