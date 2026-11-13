
import {
  X,
  User,
  FileText,
  CalendarDays,
  Clock,
  Image as ImageIcon,
  ClipboardList,
  MessageSquare,
} from "lucide-react";

import ComplaintResponseForm from "./ComplaintResponseForm";

const ComplaintDetailsModal = ({
  complaint,
  onClose,
  onSubmitResponse,
  submitting = false,
}) => {
  if (!complaint) return null;

  const {
    id,
    customer_name,
    category,
    subject,
    description,
    evidence,
    service_request,
    status,
    provider_response,
    provider_responded_at,
    response_deadline,
    created_at,
  } = complaint;

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    awaiting_response: "bg-orange-100 text-orange-700",
    under_review: "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    closed: "bg-gray-100 text-gray-700",
  };

  const statusLabels = {
    pending: "Pending",
    awaiting_response: "Awaiting Response",
    under_review: "Under Review",
    resolved: "Resolved",
    rejected: "Rejected",
    closed: "Closed",
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !submitting) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col">

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Complaint Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Complaint #{id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
            aria-label="Close complaint details"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-6">

          {/* Status and Category */}
          <div className="flex flex-wrap items-center gap-3">

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                statusStyles[status] ||
                "bg-gray-100 text-gray-700"
              }`}
            >
              {statusLabels[status] || status}
            </span>

            <span className="px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold capitalize">
              {category}
            </span>

          </div>

          {/* Basic Information */}
          <section>
            <h3 className="font-semibold text-gray-800 mb-4">
              Complaint Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="flex items-start gap-3">
                <User className="text-gray-400 mt-1" size={18} />

                <div>
                  <p className="text-xs text-gray-500">
                    Customer
                  </p>

                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {customer_name || "Unknown Customer"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ClipboardList className="text-gray-400 mt-1" size={18} />

                <div>
                  <p className="text-xs text-gray-500">
                    Related Booking
                  </p>

                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {service_request
                      ? `Booking #${service_request}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays className="text-gray-400 mt-1" size={18} />

                <div>
                  <p className="text-xs text-gray-500">
                    Submitted On
                  </p>

                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {formatDate(created_at)}
                  </p>
                </div>
              </div>

              {response_deadline && (
                <div className="flex items-start gap-3">
                  <Clock className="text-orange-500 mt-1" size={18} />

                  <div>
                    <p className="text-xs text-gray-500">
                      Response Deadline
                    </p>

                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {formatDate(response_deadline)}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </section>

          {/* Subject and Description */}
          <section className="border-t border-gray-100 pt-5">

            <h3 className="font-semibold text-gray-800 mb-3">
              {subject}
            </h3>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </div>

          </section>

          {/* Evidence */}
          {evidence && (
            <section className="border-t border-gray-100 pt-5">

              <div className="flex items-center gap-2 mb-3">
                <ImageIcon size={18} className="text-gray-500" />

                <h3 className="font-semibold text-gray-800">
                  Complaint Evidence
                </h3>
              </div>

              <a
                href={evidence}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={evidence}
                  alt="Complaint evidence"
                  className="max-h-64 max-w-full rounded-xl border border-gray-200 object-contain hover:opacity-90 transition"
                />
              </a>

            </section>
          )}

          {/* Provider Response */}
          <section className="border-t border-gray-100 pt-5">

            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={19} className="text-gray-600" />

              <h3 className="font-semibold text-gray-800">
                Provider Response
              </h3>
            </div>

            <ComplaintResponseForm
              complaint={complaint}
              onSubmit={onSubmitResponse}
              loading={submitting}
            />

          </section>

        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200">

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

export default ComplaintDetailsModal;