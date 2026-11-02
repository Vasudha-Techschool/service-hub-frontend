
import React from "react";
import {
  MapPin,
  Phone,
  CalendarDays,
  UserRound,
  ClipboardList,
  Wrench,
  Clock,MessageCircle
} from "lucide-react";

const ServiceRequestDetails = ({
  request,
  loading,
  onCancel,
  cancelling
}) =>{
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Loading request details...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-xl border border-gray-200 bg-white p-8 text-center">
        <div>
          <UserRound className="mx-auto mb-3 text-gray-300" size={38} />
          <h3 className="font-semibold text-gray-800">
            Select a Request
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a service request to view its details.
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusStyles = {
    pending: "bg-amber-50 text-amber-700",
    accepted: "bg-blue-50 text-blue-700",
    rejected: "bg-red-50 text-red-700",
    cancelled: "bg-gray-100 text-gray-600",
    completed: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-5">
        <div>
          <p className="text-xs text-gray-400">
            Request #{request.id}
          </p>

          <h2 className="mt-1 text-xl font-bold text-gray-900">
            Service Request Details
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
  <span
    className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
      statusStyles[request.status] ||
      "bg-gray-100 text-gray-600"
    }`}
  >
    {request.status}
  </span>

  {request.status === "pending" && (
    <button
      type="button"
      onClick={() => onCancel(request.id)}
      disabled={cancelling}
      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {cancelling ? "Cancelling..." : "Cancel Request"}
    </button>
  )}
</div>
      </div>

      {/* Provider Information */}
      <div className="border-b border-gray-100 py-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-800">
          Service Provider
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <UserRound size={23} />
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                {request.provider_name || "Provider"}
              </p>

              <p className="mt-1 text-sm text-emerald-700">
                {request.service_category || "Service Provider"}
              </p>
            </div>
          </div>

          {request.provider_phone && (
            <a
              href={`tel:${request.provider_phone}`}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
            >
              <MessageCircle size={15} />
              Chat 
            </a>
          )}
        </div>
      </div>

      {/* Customer Request Details */}
      <div className="py-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
          <ClipboardList size={18} className="text-emerald-600" />
          Your Request
        </h3>

        <div className="space-y-4">

          {/* Problem Description */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Wrench size={16} className="text-emerald-600" />
              <p className="text-sm font-semibold text-gray-800">
                Problem Description
              </p>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
              {request.problem_description || "No description provided."}
            </p>
          </div>

          {/* Service Location */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-emerald-600" />
              <p className="text-sm font-semibold text-gray-800">
                Service Location
              </p>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              {request.service_location || "Location not provided."}
            </p>
          </div>
        </div>
      </div>

      {/* Request Timeline */}
      <div className="border-t border-gray-100 pt-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-800">
          Request Information
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">

          <div className="flex items-start gap-3">
            <CalendarDays size={17} className="mt-0.5 text-emerald-600" />

            <div>
              <p className="text-xs text-gray-400">
                Requested On
              </p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {formattedDate(request.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock size={17} className="mt-0.5 text-emerald-600" />

            <div>
              <p className="text-xs text-gray-400">
                Last Updated
              </p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {formattedDate(request.updated_at)}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ServiceRequestDetails;
