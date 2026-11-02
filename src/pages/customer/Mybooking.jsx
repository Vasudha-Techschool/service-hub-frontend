
import { useEffect, useState } from "react";
import { ClipboardList, RefreshCw } from "lucide-react";

import CustomerSidebar from "../../components/customer/Sidebar";
import CustomerHeader from "../../components/customer/Header";

import ServiceRequestList from "../../components/customer/ServiceRequestList";
import ServiceRequestDetails from "../../components/customer/ServiceRequestDetails";

import api from "../../api/axios";

const MyBookings = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");




const [cancelling, setCancelling] = useState(false);

const handleCancelRequest = async (requestId) => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this service request?"
  );

  if (!confirmed) return;

  try {
    setCancelling(true);

    const response = await api.patch(
      `/api/services/customer/service-requests/${requestId}/cancel/`
    );

    // Update the currently selected request
    setSelectedRequest(response.data.request);

    alert(response.data.message);

  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Unable to cancel the service request."
    );
  } finally {
    setCancelling(false);
  }
};
  // Fetch all customer service requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/services/customers/service-requests/"
      );

      const data = response.data.results || response.data;

      setRequests(data);

      if (data.length > 0) {
        const selectedId = selectedRequest?.id || data[0].id;
        const exists = data.some((item) => item.id === selectedId);

        await fetchRequestDetails(
          exists ? selectedId : data[0].id
        );
      } else {
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error("Failed to fetch service requests:", error);
      setError(
        error.response?.data?.detail ||
        "Unable to load your service requests."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch selected request details
  const fetchRequestDetails = async (requestId) => {
    try {
      setDetailLoading(true);

      const response = await api.get(
        `/api/services/customers/service-requests/${requestId}/`
      );

      setSelectedRequest(response.data);
    } catch (error) {
      console.error("Failed to fetch request details:", error);
      setError("Unable to load request details.");
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Initial page load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Customer Sidebar */}
      <CustomerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() =>
          setCollapsed((prev) => !prev)
        }
      />

      {/* Main Content */}
      <div
        className={`min-h-screen min-w-0 transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Customer Header */}
        <CustomerHeader />

        <main className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">

          {/* Page Heading */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700">
                <ClipboardList size={17} />
                Customer Bookings
              </div>

              <h1 className="text-2xl font-bold text-gray-900">
                My Bookings
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View and track all your service requests.
              </p>
            </div>

            <button
              onClick={fetchRequests}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:text-green-700 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Booking Summary */}
          {!loading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">
                  Total Requests
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {requests.length}
                </h2>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">
                  Pending Requests
                </p>
                <h2 className="mt-2 text-2xl font-bold text-amber-600">
                  {requests.filter(
                    (item) => item.status === "pending"
                  ).length}
                </h2>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">
                  Accepted Requests
                </p>
                <h2 className="mt-2 text-2xl font-bold text-green-600">
                  {requests.filter(
                    (item) => item.status === "accepted"
                  ).length}
                </h2>
              </div>

            </div>
          )}

          {/* Request List and Details */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">

            {/* Left: Request List */}
            <div className="min-w-0 xl:col-span-5">
              <ServiceRequestList
                requests={requests}
                selectedRequest={selectedRequest}
                onSelect={fetchRequestDetails}
                loading={loading}
              />
            </div>

            {/* Right: Selected Request Details */}
            <div className="min-w-0 xl:col-span-7">
              <ServiceRequestDetails
                request={selectedRequest}
                loading={detailLoading}
                onCancel={handleCancelRequest}
                cancelling={cancelling}
              />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default MyBookings;
