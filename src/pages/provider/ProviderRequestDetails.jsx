
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, CalendarDays, User, ClipboardList } from "lucide-react";

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
        err.response?.data?.detail || "Failed to load request details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const handleStatusUpdate = async (action) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this request?`
    );

    if (!confirmed) return;

    try {
      setUpdating(true);
      setError("");

      await updateProviderRequestStatus(id, action);
      await fetchRequestDetails();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to update request status."
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
    completed: "bg-green-50 text-green-700",
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
          <ArrowLeft size={16} /> Back to Requests
        </button>

        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!request) return null;

  return (
    <div className="max-w-4xl space-y-6">

      <button
        onClick={() => navigate("/provider/bookings")}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-700"
      >
        <ArrowLeft size={17} />
        Back to Requests
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Request Details
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View customer information and manage this service request.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">Request ID</p>
            <h2 className="text-xl font-semibold text-gray-900">
              #{request.id}
            </h2>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${
              statusStyles[request.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {request.status}
          </span>
        </div>

        <hr />

        <div className="grid gap-5 sm:grid-cols-2">

          <div className="flex gap-3">
            <User className="mt-1 text-gray-400" size={19} />
            <div>
              <p className="text-xs text-gray-500">Customer Name</p>
              <p className="mt-1 font-medium text-gray-800">
                {request.customer_name || "Customer"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <ClipboardList className="mt-1 text-gray-400" size={19} />
            <div>
              <p className="text-xs text-gray-500">Service Category</p>
              <p className="mt-1 font-medium text-gray-800">
                {request.provider_category || "—"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin className="mt-1 text-gray-400" size={19} />
            <div>
              <p className="text-xs text-gray-500">Service Location</p>
              <p className="mt-1 font-medium text-gray-800">
                {request.service_location || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <CalendarDays className="mt-1 text-gray-400" size={19} />
            <div>
              <p className="text-xs text-gray-500">Request Date</p>
              <p className="mt-1 font-medium text-gray-800">
                {formatDate(request.created_at)}
              </p>
            </div>
          </div>

        </div>

        <hr />

        <div>
          <h3 className="font-semibold text-gray-900">
            Problem Description
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
            {request.problem_description || "No description provided."}
          </p>
        </div>

        {request.status === "pending" && (
          <>
            <hr />

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                disabled={updating}
                onClick={() => handleStatusUpdate("reject")}
                className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Reject Request
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() => handleStatusUpdate("accept")}
                className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {updating ? "Updating..." : "Accept Request"}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
