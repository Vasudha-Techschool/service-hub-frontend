
import React, { useEffect, useState } from "react";

import WelcomeSection from "../../components/provider/dashboard/DashboardWelcome";
import DashboardStats from "../../components/provider/dashboard/DashboardStats";
import VerificationStatus from "../../components/provider/dashboard/VerificationCard";
import QuickActions from "../../components/provider/dashboard/QuickActions";
import RecentRequests from "../../components/provider/dashboard/RecentRequests";

import {
  getProviderDashboardStats,
  getProviderRequests,
} from "../../services/providerService";

export default function ProviderDashboard() {

  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);

  const [statsLoading, setStatsLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);

  const [statsError, setStatsError] = useState("");
  const [requestsError, setRequestsError] = useState("");

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);

        const data = await getProviderDashboardStats();

        setStats({
          totalBookings: data.total_requests,
          pendingBookings: data.pending_requests,
          completedBookings: data.completed_requests,
          averageRating: null,
        });

      } catch (error) {
        console.error("Dashboard stats error:", error);
        setStatsError("Unable to load dashboard statistics.");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch recent service requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setRequestsLoading(true);

        const data = await getProviderRequests();

        // Support both normal arrays and paginated DRF responses
        const requests = Array.isArray(data)
          ? data
          : data.results || [];

        setRecentBookings(requests.slice(0, 5));

      } catch (error) {
        console.error("Provider requests error:", error);
        setRequestsError("Unable to load recent service requests.");
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="space-y-6">

      <WelcomeSection />

      {statsError && (
        <p className="text-sm text-red-600">{statsError}</p>
      )}

      {statsLoading ? (
        <p className="text-sm text-gray-500">
          Loading dashboard statistics...
        </p>
      ) : (
        <DashboardStats stats={stats} />
      )}

      <VerificationStatus status="unknown" />

      <QuickActions />

      {requestsError && (
        <p className="text-sm text-red-600">{requestsError}</p>
      )}

      <RecentRequests
        requests={recentBookings}
        loading={requestsLoading}
      />

    </div>
  );
}
