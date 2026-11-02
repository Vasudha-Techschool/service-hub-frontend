import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Inbox,
  MapPin,
} from "lucide-react";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-blue-50 text-blue-700",
  rejected: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
  completed: "bg-green-50 text-green-700",
};

export default function RecentRequests({
  requests = [],
  loading = false,
}) {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Recent Service Requests
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest requests received from customers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/provider/bookings")}
          className="flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      {loading ? (
        <div className="p-10 text-center text-sm text-gray-500">
          Loading service requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <Inbox size={28} />
          </div>

          <h3 className="text-sm font-semibold text-gray-800">
            No recent requests
          </h3>

          <p className="mt-1 max-w-sm text-sm text-gray-500">
            New service requests from customers will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Request</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      #{request.id}
                    </p>

                    <p className="mt-1 text-xs text-green-700">
                      {request.service_category || "Service"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {request.customer_name || "Customer"}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex max-w-48 items-center gap-1.5 text-sm text-gray-600">
                      <MapPin
                        size={14}
                        className="shrink-0 text-gray-400"
                      />

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
                      onClick={() =>
                        navigate(`/provider/bookings/${request.id}`)
                      }
                      className="text-sm font-medium text-green-700 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}