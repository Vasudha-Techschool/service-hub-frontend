
import AdminSidebar from "../../components/admin/Sidebar";
import StatCards from "../../components/admin/dashboard/StatCards";
import Header from "../../components/admin/Header";
import RecentAct from "../../components/admin/dashboard/RecentAct";
import QuickAction from "../../components/admin/dashboard/QuickAction";
import PendingProvider from "../../components/admin/dashboard/PendingProvider";
import CategoryOverview from "../../components/admin/dashboard/CategoryOverview";
import BottomCards from "../../components/admin/dashboard/BottomCards";
import BookingOverview from "../../components/admin/dashboard/BookingOverview";

export default function AdminDashboard({ onLogout }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Existing sidebar */}
      <AdminSidebar onLogout={onLogout} />

      {/* Dashboard content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Breadcrumbs, search, notifications, admin profile */}
        <Header />

        <div className="flex-1 space-y-6 overflow-y-auto p-5 md:p-8">
          {/* Dashboard heading */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor customers, service providers, bookings, and platform quality.
            </p>
          </div>

          {/* Summary cards: already created */}
          <StatCards />

          {/* Booking chart and service categories */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <BookingOverview />
            <CategoryOverview />
          </div>

          {/* Pending items and quick actions */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <PendingProvider />
            <QuickAction />
          </div>

          {/* Recent activity */}
          <RecentAct />

          {/* Bottom management cards */}
          <BottomCards />

          <footer className="pb-2 text-center text-xs text-slate-400">
            Service Hub · Admin Dashboard
          </footer>
        </div>
      </main>
    </div>
  );
}
