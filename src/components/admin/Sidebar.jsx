
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  Wrench,
  MessageSquareWarning,
  Wallet,
  Star,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  House,
} from "lucide-react";

const sidebarSections = [
  {
    title: "Workspace",
    items: [
      { label: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Customers", path: "/admin/customers", icon: Users },
      {
        label: "Service Providers",
        path: "/admin/providers",
        icon: BriefcaseBusiness,
      },
      {
        label: "Service Categories",
        path: "/admin/service-categories",
        icon: Wrench,
      },
    ],
  },
  {
    title: "Quality Operations",
    items: [
      {
        label: "Complaint Management",
        path: "/admin/complaints",
        icon: MessageSquareWarning,
      },
      {
        label: "Payments & Commissions",
        path: "/admin/payments",
        icon: Wallet,
      },
      {
        label: "Review Moderation",
        path: "/admin/reviews",
        icon: Star,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Analytics & Reports",
        path: "/admin/analytics",
        icon: ChartNoAxesCombined,
      },
      { label: "Settings", path: "/admin/settings", icon: Settings },
    ],
  },
];

const AdminSidebar = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate("/admin/login");
    }
  };

  return (
    <aside
      className={`flex h-screen flex-col border-r border-slate-200
        bg-white transition-all duration-300 ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
    >
      {/* Logo and Toggle */}
      <div
        className={`flex h-[72px] shrink-0 items-center border-b
          border-slate-200 ${
            collapsed ? "justify-center px-2" : "justify-between px-5"
          }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl bg-violet-600 text-white">
            <House size={22} />
          </div>

          {!collapsed && (
            <div className="whitespace-nowrap">
              <h1 className="text-lg font-bold text-slate-900">
                Service Hub
              </h1>
              <p className="text-xs text-slate-500">
                Admin Portal
              </p>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
            className="rounded-lg p-2 text-slate-500
              hover:bg-slate-100 hover:text-violet-600"
          >
            <PanelLeftClose size={19} />
          </button>
        )}

        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            className="absolute left-[52px] top-[82px] z-10
              rounded-full border border-slate-200 bg-white p-1.5
              text-slate-600 shadow-sm hover:text-violet-600"
          >
            <PanelLeftOpen size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        {sidebarSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <h2 className="mb-3 px-3 text-[11px] font-bold
                uppercase tracking-wider text-slate-400">
                {section.title}
              </h2>
            )}

            {collapsed && (
              <div className="mb-3 border-t border-slate-100" />
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    end={item.path === "/admin/dashboard"}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl
                      py-3 text-sm font-medium transition-colors
                      ${
                        collapsed
                          ? "justify-center px-0"
                          : "px-3"
                      }
                      ${
                        isActive
                          ? "bg-violet-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      }`
                    }
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.8}
                      className="shrink-0"
                    />

                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Logout */}
      <div className="shrink-0 border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`flex w-full items-center gap-3 rounded-xl
            py-3 text-sm font-medium text-red-600
            transition-colors hover:bg-red-50 ${
              collapsed ? "justify-center px-0" : "px-3"
            }`}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {!collapsed && (
          <p className="mt-3 text-center text-xs text-slate-400">
            Service Hub © 2026
          </p>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
