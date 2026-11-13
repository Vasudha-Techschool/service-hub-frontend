import { Bell, Clock } from "lucide-react";

export default function NotificationCard({
  notification,
  onClick,
  getTypeLabel,
  formatDate,
}) {
  return (
    <button
      type="button"
      data-cy="notification-card"
      onClick={() => onClick(notification)}
      className={`flex w-full gap-4 px-5 py-5 text-left transition hover:bg-violet-50/50 ${
        !notification.is_read
          ? "bg-violet-50/40"
          : "bg-white"
      }`}
    >
      <div
        className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          notification.is_read
            ? "bg-slate-100 text-slate-500"
            : "bg-violet-100 text-violet-600"
        }`}
      >
        <Bell size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-800">
            {notification.title}
          </h3>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              notification.is_read
                ? "bg-slate-100 text-slate-500"
                : "bg-violet-100 text-violet-700"
            }`}
          >
            {notification.is_read ? "Read" : "Unread"}
          </span>
        </div>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          {notification.message}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="rounded-md bg-slate-100 px-2 py-1 capitalize">
            {getTypeLabel(notification.notification_type)}
          </span>

          <span className="flex items-center gap-1">
            <Clock size={13} />
            {formatDate(notification.created_at)}
          </span>

          {notification.complaint && (
            <span>
              Complaint #{notification.complaint}
            </span>
          )}

          {notification.service_request && (
            <span>
              Request #{notification.service_request}
            </span>
          )}
        </div>
      </div>

      {!notification.is_read && (
        <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-violet-600" />
      )}
    </button>
  );
}
