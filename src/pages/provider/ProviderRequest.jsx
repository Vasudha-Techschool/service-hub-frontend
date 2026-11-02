
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, MapPin, Inbox } from "lucide-react";

import { getProviderRequests } from "../../services/providerService";

const filters = [
  "all",
  "pending",
  "accepted",
  "rejected",
  "completed",
  "cancelled",
];

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-blue-50 text-blue-700",
  rejected: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
  completed: "bg-green-50 text-green-700",
};

export default function ProviderRequests() {

  const [requests, setRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate=useNavigate();

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

useEffect(() => {
  const fetchRequests = async () => {
    try {
      setLoading(true);

      const data = await getProviderRequests(
        activeFilter === "all" ? "" : activeFilter
      );

      setRequests(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  fetchRequests();
}, [activeFilter]);

  return (
    <div className="space-y-6">

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Service Requests
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage service requests received from customers.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
              activeFilter === filter
                ? "bg-green-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {filter === "all" ? "All Requests" : filter}
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading service requests...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm text-red-600">
            {error}
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <Inbox size={32} className="mb-3 text-gray-400" />

            <h3 className="text-sm font-semibold text-gray-800">
              No service requests found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Requests matching this filter will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">

              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Request</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-800">
                        #{request.id}
                      </p>

                      <p className="mt-1 text-xs text-green-700">
                        {request.provider_category || "Service"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {request.customer_name || "Customer"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex max-w-48 items-center gap-1.5 text-sm text-gray-600">
                        <MapPin size={14} className="shrink-0 text-gray-400" />

                        <span className="truncate">
                          {request.service_location || "Not provided"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDate(request.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          statusStyles[request.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                            type="button"
                            className="text-sm font-medium text-green-700 hover:underline"
                            onClick={() => navigate(`/provider/bookings/${request.id}`)}
                            >
                            View More
                            </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>

    </div>
  );
}
