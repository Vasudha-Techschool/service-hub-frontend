
import {
  Bell,
  CalendarCheck,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react";

const getNotificationIcon = (type) => {
  if (type?.includes("complaint")) {
    return <MessageSquare size={20} />;
  }

  if (type?.includes("request")) {
    return <CalendarCheck size={20} />;
  }

  return <Bell size={20} />;
};

const getNotificationLabel = (type) => {
  const labels = {
    new_request: "New Request",
    request_accepted: "Request Accepted",
    request_rejected: "Request Rejected",
    request_cancelled: "Request Cancelled",
    completion_requested: "Completion Requested",
    request_completed: "Work Completed",
    new_complaint: "New Complaint",
    explanation_requested: "Explanation Requested",
    provider_responded: "Provider Responded",
    complaint_updated: "Complaint Updated",
    complaint_resolved: "Complaint Resolved",
    complaint_rejected: "Complaint Rejected",
  };

  return labels[type] || "Notification";
};

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NotificationCard = ({ notification, onClick, updating }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(notification)}
      disabled={updating}
      className={`flex w-full items-start gap-4 px-5 py-5 text-left transition hover:bg-green-50/50 disabled:opacity-60 ${
        !notification.is_read ? "bg-green-50/40" : "bg-white"
      }`}
    >
      <div
        className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          !notification.is_read
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {getNotificationIcon(notification.notification_type)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-gray-800">
            {notification.title}
          </h3>

          {!notification.is_read && (
            <span className="h-2 w-2 rounded-full bg-green-600" />
          )}
        </div>

        <p className="mt-1 text-sm leading-6 text-gray-600">
          {notification.message}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <span className="font-medium text-gray-500">
            {getNotificationLabel(notification.notification_type)}
          </span>

          <span className="flex items-center gap-1">
            <Clock size={13} />
            {formatDate(notification.created_at)}
          </span>
        </div>
      </div>

      <div className="mt-2 shrink-0">
        {notification.is_read ? (
          <CheckCircle size={18} className="text-gray-400" />
        ) : (
          <span className="text-xs font-medium text-green-600">
            {updating ? "Opening..." : "New"}
          </span>
        )}
      </div>
    </button>
  );
};

export default NotificationCard;
