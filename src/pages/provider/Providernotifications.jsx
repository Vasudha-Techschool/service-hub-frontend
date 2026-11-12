
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getProviderNotifications,
  markProviderNotificationRead,
} from "../../services/providerService";

import NotificationStats from "../../components/provider/notifications/NotificationStats";
import NotificationCard from "../../components/provider/notifications/NotificationCard";
import NotificationFilter from "../../components/provider/notifications/NotificationFilter"
const notificationTypes = [
  { value: "new_request", label: "New Service Request" },
  { value: "request_cancelled", label: "Request Cancelled" },
  { value: "explanation_requested", label: "Explanation Requested" },
  { value: "complaint_updated", label: "Complaint Updated" },
  { value: "complaint_resolved", label: "Complaint Resolved" },
  { value: "complaint_rejected", label: "Complaint Rejected" },
];

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

export default function ProviderNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const navigate = useNavigate();

 

  // Fetch provider notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProviderNotifications();

console.log("Provider notifications API response:", data);

setNotifications(
  Array.isArray(data) ? data : data.results || []
);

      setNotifications(
        Array.isArray(data) ? data : data.results || []
      );
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Unable to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Statistics
  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const readCount = notifications.length - unreadCount;

  // Search, filter and sort
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((notification) => {
        const title = notification.title || "";
        const message = notification.message || "";

        const matchesSearch =
          title.toLowerCase().includes(search.toLowerCase()) ||
          message.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "unread" && !notification.is_read) ||
          (statusFilter === "read" && notification.is_read);

        const matchesType =
          typeFilter === "all" ||
          notification.notification_type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        // Unread notifications first
        if (a.is_read !== b.is_read) {
          return Number(a.is_read) - Number(b.is_read);
        }

        // Newest first within each group
        return (
          new Date(b.created_at) - new Date(a.created_at)
        );
      });
  }, [notifications, search, statusFilter, typeFilter]);

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.is_read) {
        await markProviderNotificationRead(notification.id);

        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id
              ? { ...item, is_read: true }
              : item
          )
        );
         window.dispatchEvent(
  new Event("provider-notifications-updated")
);
      }

      if (notification.service_request) {
        navigate(
          `/provider/bookings/${notification.service_request}`
        );
      }

      // Complaint navigation will be added
      // after implementing Provider Complaints page.
    } catch (err) {
      console.error(
        "Failed to mark notification as read:",
        err
      );
    }
  };

  const getTypeLabel = (type) => {
    return (
      notificationTypes.find((item) => item.value === type)?.label ||
      type?.replace(/_/g, " ") ||
      "Notification"
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage your notifications.
          </p>
        </div>

        <button
          onClick={fetchNotifications}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:shadow-md"
        >
          Refresh
        </button>
      </div>

      {/* Statistics Component */}
      <NotificationStats
        total={notifications.length}
        unread={unreadCount}
        read={readCount}
      />

      {/* Filters Component */}
      <NotificationFilter
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        notificationTypes={notificationTypes}
      />

      {/* Notification List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-slate-800">
            All Notifications
          </h2>

          <span className="text-sm text-slate-500">
            {filteredNotifications.length} found
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading notifications...
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-500">{error}</p>

            <button
              onClick={fetchNotifications}
              className="mt-3 text-sm font-semibold text-violet-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell
              className="mx-auto mb-3 text-slate-300"
              size={36}
            />

            <p className="font-medium text-slate-700">
              No notifications found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
                getTypeLabel={getTypeLabel}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
