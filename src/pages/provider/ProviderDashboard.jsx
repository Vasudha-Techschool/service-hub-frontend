import React from "react";

import WelcomeSection from "../../components/provider/dashboard/DashboardWelcome";
import DashboardStats from "../../components/provider/dashboard/DashboardStats";
import VerificationStatus from "../../components/provider/dashboard/VerificationCard";
import QuickActions from "../../components/provider/dashboard/QuickActions";
import RecentRequests from "../../components/provider/dashboard/RecentRequests";

export default function ProviderDashboard({
  stats = {},
  recentBookings = [],
  verificationStatus = "unknown",
  loading = false,
}) {
  return (
    <div className="space-y-6">

      <WelcomeSection />

      <DashboardStats stats={stats} />

      <VerificationStatus status={verificationStatus} />

      <QuickActions />

      <RecentRequests
        requests={recentBookings}
        loading={loading}
      />

    </div>
  );
}