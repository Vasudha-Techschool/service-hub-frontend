import React, { useEffect, useState } from "react";
import {
  MapPin,
  Star,
  CheckCircle,
  Phone,
  CalendarDays,
  UserRound,
  ClipboardList,
  Wrench,
  Clock,
  MessageCircle,
} from "lucide-react";

import ReviewModal from "./ReviewModal";
import ComplaintModal from "./ComplaintModal";

const ServiceRequestDetails = ({
  request,
  loading,
  onCancel,
  cancelling,
  onRequestCompletion,
  completionLoading,
  onSubmitReview,
  reviewSubmitting = false,
  hasReviewed = false,
  onSubmitComplaint,
  complaintSubmitting = false,
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  
  useEffect(() => {
  setReviewSubmitted(false);
  setShowReviewModal(false);
  setShowComplaintModal(false);
}, [request?.id]);

const handleComplaintSubmit = async (formData) => {
  const success = await onSubmitComplaint(formData);

  if (success !== false) {
    setShowComplaintModal(false);
  }
};

  const isReviewed = hasReviewed || reviewSubmitted;

  // Keep the rest of your component here...
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

// For Review button display
  const handleReviewSubmit = async (reviewData) => {
  await onSubmitReview(reviewData);

  setReviewSubmitted(true);
  setShowReviewModal(false);
};

  const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-blue-50 text-blue-700",
  rejected: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
  in_progress: "bg-indigo-50 text-indigo-700",
  awaiting_provider_confirmation: "bg-purple-50 text-purple-700",
  completed: "bg-emerald-50 text-emerald-700",
};

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">

{/* Completion Action */}
{["accepted", "in_progress"].includes(request.status) && (
  <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-sm font-semibold text-emerald-800">
          Is the service work completed?
        </h3>

        <p className="mt-1 text-xs text-emerald-700">
          Notify the provider that the work is finished.
          The provider will verify and confirm completion.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRequestCompletion(request.id)}
        disabled={completionLoading}
        className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {completionLoading
          ? "Submitting..."
          : "Mark Work as Completed"}
      </button>
    </div>
  </div>
)}

{request.status === "awaiting_provider_confirmation" && (
  <div className="mt-5 rounded-lg border border-purple-100 bg-purple-50 p-4">
    <p className="text-sm font-semibold text-purple-800">
      Waiting for Provider Confirmation
    </p>
    <p className="mt-1 text-xs text-purple-700">
      Your completion request has been submitted. The provider
      has been notified by email and must confirm the work.
    </p>
  </div>
)}


{/* Customer Complaint Action */}

{["accepted", "completed"].includes(request.status) && (
  <div className="mb-5 rounded-lg border border-red-100 bg-red-50 p-4">

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <h3 className="text-sm font-semibold text-red-800">
          Do you have any complaints?
        </h3>

        <p className="mt-1 text-xs text-red-700">
          If you experienced any issues with this service,
          you can submit a complaint for admin review.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowComplaintModal(true)}
        className="shrink-0 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
      >
        Raise a Complaint
      </button>

    </div>
  </div>
)}


{/* Customer Review Action */}
{request.status === "completed" && (
  <div className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-sm font-semibold text-emerald-800">
          Share Your Experience
        </h3>

        <p className="mt-1 text-xs text-emerald-700">
          Your service is completed. Rate the provider and
          help other customers make better decisions.
        </p>
      </div>

      {isReviewed ? (
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <CheckCircle size={18} />
          Review Submitted
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setShowReviewModal(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Star size={16} />
          Write a Review
        </button>
      )}
    </div>
  </div>
)}


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

  {["pending", "accepted"].includes(request.status) &&  (

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
      {/* modal form for complaint submitting */}
      {showComplaintModal && (
  <ComplaintModal
    request={request}
    onClose={() => setShowComplaintModal(false)}
    onSubmit={handleComplaintSubmit}
    submitting={complaintSubmitting}
  />
)}

{/* modal form for review submitting */}
      {showReviewModal && (
  <ReviewModal
    request={request}
    onClose={() => setShowReviewModal(false)}
    onSubmit={handleReviewSubmit}
    submitting={reviewSubmitting}
  />
)}

    </div>
  );
};

export default ServiceRequestDetails;
