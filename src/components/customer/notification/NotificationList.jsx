
import { Bell } from "lucide-react";
import NotificationCard from "./NotificationCard";

const NotificationList = ({
  notifications,
  loading,
  onNotificationClick,
  updatingId,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

        <p className="mt-3 text-sm text-gray-500">
          Loading notifications...
        </p>
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <Bell size={26} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-700">
          No notifications found
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Updates about your bookings and complaints will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-100">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onClick={onNotificationClick}
          updating={updatingId === notification.id}
        />
      ))}
    </div>
  );
};

export default NotificationList;
