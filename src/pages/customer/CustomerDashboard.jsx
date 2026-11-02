
import { useState } from "react";
import CustomerSidebar from "../../components/customer/Sidebar";
import CustomerHeader from "../../components/customer/Header";
import DashboardStats from "../../components/customer/dashboard/DashboardStats";
import QuickActions from "../../components/customer/dashboard/QuickActions";
import RecentBookings from "../../components/customer/dashboard/RecentBookings";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() =>
          setSidebarCollapsed((previous) => !previous)
        }
      />

      <div
        className={`min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <CustomerHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="space-y-8 p-4 sm:p-6 lg:p-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome to Service Hub!
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Find services, track bookings, and manage your requests.
            </p>
          </div>

          <DashboardStats />

          <QuickActions />

          <RecentBookings />
        </main>
      </div>
    </div>
  );
}
