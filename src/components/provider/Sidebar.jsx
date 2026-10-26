
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/provider/dashboard", icon: "▦" },
  { name: "My Profile", path: "/provider/profile", icon: "◉" },
];

export default function ProviderSidebar() {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-white border-r border-gray-200">
      <div className="border-b border-gray-200 px-6 py-5">
        <h1 className="text-2xl font-bold text-teal-700">
          Service Hub
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Provider Portal
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span>{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4 text-xs text-gray-500">
        Service Hub © 2026
      </div>
    </aside>
  );
}
