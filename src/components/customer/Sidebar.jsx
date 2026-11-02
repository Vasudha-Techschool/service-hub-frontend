import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Bot,
  Search,
  CalendarDays,
  MessageCircle,
  Bell,
  Star,
  MessageSquareWarning,
  UserRound,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

export default function CustomerSidebar({
  open = true,
  onClose,
  collapsed = false,
  onToggleCollapse,
}) {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/customer/dashboard", icon: LayoutDashboard },
    { name: "AI Assistant", path: "/customer/ai-assistant", icon: Bot },
    { name: "Find Services", path: "/customer/services", icon: Search },
    { name: "My Bookings", path: "/customer/requests", icon: CalendarDays },
    { name: "Messages", path: "/customer/messages", icon: MessageCircle },
    { name: "Notifications", path: "/customer/notifications", icon: Bell },
    { name: "My Reviews", path: "/customer/reviews", icon: Star },
    { name: "Complaints", path: "/customer/complaints", icon: MessageSquareWarning },
    { name: "My Profile", path: "/customer/profile", icon: UserRound },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/customer/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col
          bg-white border-r border-gray-200
          transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Logo and toggle */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
          {!collapsed && (
            <span className="text-xl font-bold text-green-700">
              Service Hub
            </span>
          )}

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:block"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                title={collapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                  }
                  ${collapsed ? "justify-center" : ""}`
                }
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 p-3">
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}