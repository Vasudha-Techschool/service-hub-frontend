
import {
  CalendarDays,
  User,
  FileText,
  Eye,
  Clock,
  MessageSquare,
} from "lucide-react";

const ComplaintCard = ({ complaint, onViewDetails }) => {
  const {
    id,
    customer_name,
    category,
    subject,
    description,
    status,
    created_at,
    response_deadline,
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

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const isResponseRequired = status === "awaiting_response";

  const isDeadlinePassed =
    response_deadline &&
    new Date(response_deadline).getTime() < Date.now();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">

        <div>
          <p className="text-xs text-gray-500 font-medium">
            Complaint #{id}
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-1">
            {subject}
          </h3>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusStyles[status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {statusLabels[status] || status}
        </span>
      </div>

      {/* Complaint information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={16} className="text-gray-400" />

          <span>
            {customer_name || "Unknown Customer"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText size={16} className="text-gray-400" />

          <span className="capitalize">
            {category || "N/A"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays size={16} className="text-gray-400" />

          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MessageSquare size={16} className="text-gray-400" />

          <span>
            Booking #{complaint.service_request || "N/A"}
          </span>
        </div>

      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mt-4 leading-relaxed line-clamp-2">
        {description}
      </p>

      {/* Response deadline */}
      {isResponseRequired && response_deadline && (
        <div
          className={`flex items-center gap-2 mt-4 text-xs font-medium ${
            isDeadlinePassed ? "text-red-600" : "text-orange-600"
          }`}
        >
          <Clock size={15} />

          {isDeadlinePassed
            ? "Response deadline passed"
            : `Response deadline: ${new Date(
                response_deadline
              ).toLocaleString("en-IN")}`}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">

        {isResponseRequired ? (
          <span className="text-xs font-medium text-orange-600">
            {isDeadlinePassed
              ? "Response unavailable"
              : "Your response is required"}
          </span>
        ) : (
          <span className="text-xs text-gray-500">
            {complaint.provider_responded_at
              ? "Response submitted"
              : "No response required"}
          </span>
        )}

        <button
          type="button"
          onClick={() => onViewDetails(complaint)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
        >
          <Eye size={16} />
          View Details
        </button>

      </div>
    </div>
  );
};

export default ComplaintCard;