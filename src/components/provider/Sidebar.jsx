import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  BriefcaseBusiness,
  CalendarDays,
  MessageCircle,
  Bell,
  Star,
  UserRound,
  ShieldCheck,
  LogOut,
  Wrench,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/provider/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Service Requests",
    path: "/provider/bookings",
    icon: ClipboardList,
  },
  {
    label: "My Services",
    path: "/provider/services",
    icon: BriefcaseBusiness,
  },
  {
    label: "Availability",
    path: "/provider/availability",
    icon: CalendarDays,
  },
  {
    label: "Messages",
    path: "/provider/messages",
    icon: MessageCircle,
  },
  {
    label: "Notifications",
    path: "/provider/notifications",
    icon: Bell,
  },
  {
    label: "My Reviews",
    path: "/provider/reviews",
    icon: Star,
  },
];

const accountItems = [
  {
    label: "My Profile",
    path: "/provider/profile",
    icon: UserRound,
  },
  {
    label: "Verification",
    path: "/provider/verification",
    icon: ShieldCheck,
  },
];

export default function ProviderSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Connect this to your existing logout logic.
    navigate("/provider/login");
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === "/provider/dashboard"}
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            isActive
              ? "bg-green-50 text-green-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
          }`
        }
      >
        <Icon size={19} />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white">
            <Wrench size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Service<span className="text-green-600">Hub</span>
            </h2>
            <p className="text-[11px] text-gray-500">
              Provider Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
          <div>
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Workspace
            </p>

            <div className="space-y-1">
              {menuItems.map(renderMenuItem)}
            </div>
          </div>

          <div>
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Account
            </p>

            <div className="space-y-1">
              {accountItems.map(renderMenuItem)}
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}