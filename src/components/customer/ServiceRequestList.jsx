import React from "react";
import { CalendarDays, BriefcaseBusiness } from "lucide-react";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-gray-100 text-gray-600",
};

const ServiceRequestList = ({
  requests,
  selectedRequest,
  onSelect,
  loading,
}) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return <div className="rounded-xl bg-white p-6 text-gray-500">Loading requests...</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900">All Requests</h2>
        <p className="mt-1 text-xs text-gray-500">
          {requests.length} booking(s)
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="p-10 text-center">
          <BriefcaseBusiness className="mx-auto mb-3 text-gray-300" size={36} />
          <p className="font-medium text-gray-700">No bookings yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Your service requests will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {requests.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full border-l-4 p-4 text-left transition ${
                selectedRequest?.id === item.id
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.provider_name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.service_category}
                  </p>

                  <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                    <CalendarDays size={13} />
                    {formatDate(item.created_at)}
                  </p>
                </div>

                <span
                  className={`h-fit rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    statusStyles[item.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceRequestList;