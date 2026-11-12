
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  User,
  ClipboardList,
  CheckCircle,
  Clock,
  Wrench,
} from "lucide-react";

import {
  getProviderRequestDetails,
  updateProviderRequestStatus,
} from "../../services/providerService";

export default function ProviderRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProviderRequestDetails(id);
      setRequest(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Failed to load request details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const handleStatusUpdate = async (action) => {
    const actionMessages = {
      accept: "Are you sure you want to accept this request?",
      reject: "Are you sure you want to reject this request?",
      start: "Are you sure you want to start this service?",
      verify_complete:
        "Have you verified that the service work is completed?",
    };

    const confirmed = window.confirm(
      actionMessages[action] || "Are you sure you want to continue?"
    );

    if (!confirmed) return;

    try {
      setUpdating(true);
      setError("");

      await updateProviderRequestStatus(id, action);

      await fetchRequestDetails();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Failed to update request status."
      );
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

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
    in_progress: "bg-indigo-50 text-indigo-700",
    awaiting_provider_confirmation:
      "bg-purple-50 text-purple-700",
    completed: "bg-green-50 text-green-700",
  };

  const statusLabels = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    cancelled: "Cancelled",
    in_progress: "In Progress",
    awaiting_provider_confirmation: "Awaiting Your Confirmation",
    completed: "Completed",
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading request details...
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/provider/bookings")}
          className="flex items-center gap-2 text-sm text-green-700"
        >
          <ArrowLeft size={16} />
          Back to Requests
        </button>

        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!request) return null;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/provider/bookings")}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-700"
      >
        <ArrowLeft size={17} />
        Back to Requests
      </button>

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Request Details
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View customer information and manage this service request.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
        {/* Request Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">Request ID</p>

            <h2 className="text-xl font-semibold text-gray-900">
              #{request.id}
            </h2>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              statusStyles[request.status] ||
              "bg-gray-100 text-gray-600"
            }`}
          >
            {statusLabels[request.status] || request.status}
          </span>
        </div>

        <hr className="border-gray-100" />

        {/* Customer Information */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex gap-3">
            <User className="mt-1 text-gray-400" size={19} />

            <div>
              <p className="text-xs text-gray-500">
                Customer Name
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {request.customer_name || "Customer"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <ClipboardList
              className="mt-1 text-gray-400"
              size={19}
            />

            <div>
              <p className="text-xs text-gray-500">
                Service Category
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {request.provider_category || "—"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin className="mt-1 text-gray-400" size={19} />

            <div>
              <p className="text-xs text-gray-500">
                Service Location
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {request.service_location || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <CalendarDays
              className="mt-1 text-gray-400"
              size={19}
            />

            <div>
              <p className="text-xs text-gray-500">
                Request Date
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {formatDate(request.created_at)}
              </p>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Problem Description */}
        <div>
          <h3 className="font-semibold text-gray-900">
            Problem Description
          </h3>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
            {request.problem_description ||
              "No description provided."}
          </p>
        </div>

        {/* Pending Actions */}
        {request.status === "pending" && (
          <>
            <hr className="border-gray-100" />

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                disabled={updating}
                onClick={() => handleStatusUpdate("reject")}
                className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject Request
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() => handleStatusUpdate("accept")}
                className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating ? "Updating..." : "Accept Request"}
              </button>
            </div>
          </>
        )}

        {/* Start Service Action */}
        {request.status === "accepted" && (
          <>
            <hr className="border-gray-100" />

            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-indigo-800">
                    Ready to Start?
                  </h3>

                  <p className="mt-1 text-sm text-indigo-700">
                    Start the service when you begin working on the
                    customer's request.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusUpdate("start")}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Wrench size={16} />
                  {updating ? "Updating..." : "Start Service"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* In Progress Information */}
        {request.status === "in_progress" && (
          <>
            <hr className="border-gray-100" />

            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
              <div className="flex items-center gap-2">
                <Clock size={19} className="text-indigo-600" />

                <h3 className="font-semibold text-indigo-800">
                  Service In Progress
                </h3>
              </div>

              <p className="mt-1 text-sm text-indigo-700">
                The service is currently in progress. The customer
                can notify you when the work is completed.
              </p>
            </div>
          </>
        )}

        {/* Confirm Completion Action */}
        {request.status === "awaiting_completion" && (
          <>
            <hr className="border-gray-100" />

            <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-semibold text-purple-800">
                    Customer Requested Completion
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-purple-700">
                    The customer has reported that the service work
                    is completed. Please verify the work before
                    confirming completion.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() =>
                      handleStatusUpdate("verify_complete")
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle size={17} />

                    {updating
                      ? "Confirming..."
                      : "Confirm Completion"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Completed Information */}
        {request.status === "completed" && (
          <>
            <hr className="border-gray-100" />

            <div className="rounded-lg border border-green-100 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle
                  size={20}
                  className="text-green-600"
                />

                <h3 className="font-semibold text-green-800">
                  Service Completed
                </h3>
              </div>

              <p className="mt-1 text-sm text-green-700">
                You have successfully verified and confirmed
                completion of this service request.
              </p>
            </div>
          </>
        )}

        {/* Rejected / Cancelled Information */}
        {["rejected", "cancelled"].includes(request.status) && (
          <>
            <hr className="border-gray-100" />

            <p className="text-sm text-gray-500">
              {request.status === "rejected"
                ? "You rejected this service request."
                : "This service request was cancelled by the customer."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
