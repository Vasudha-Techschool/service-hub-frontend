
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Bell, CheckCheck, Clock, Inbox } from "lucide-react";

import {
  getAdminNotifications,
  markAdminNotificationRead,
} from "../../services/adminService";

import AdminSidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import { useNavigate } from "react-router-dom";


const notificationTypes = [
  { value: "new_complaint", label: "New Complaint" },
  { value: "explanation_requested", label: "Explanation Requested" },
  { value: "provider_responded", label: "Provider Responded" },
  { value: "complaint_updated", label: "Complaint Updated" },
  { value: "complaint_resolved", label: "Complaint Resolved" },
  { value: "complaint_rejected", label: "Complaint Rejected" },
  { value: "new_request", label: "New Service Request" },
  { value: "request_accepted", label: "Request Accepted" },
  { value: "request_rejected", label: "Request Rejected" },
  { value: "request_cancelled", label: "Request Cancelled" },
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

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

   const navigate = useNavigate();
  const fetchNotifications = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const data = await getAdminNotifications();

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

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const readCount = notifications.length - unreadCount;

  const filteredNotifications = useMemo(() => {
  return notifications
    .filter((notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(search.toLowerCase()) ||
        notification.message.toLowerCase().includes(search.toLowerCase());

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

      // Newest notifications first within each group
      return new Date(b.created_at) - new Date(a.created_at);
    });
}, [notifications, search, statusFilter, typeFilter]);
  const handleNotificationClick = async (notification) => {
  try {
    if (!notification.is_read) {
      await markAdminNotificationRead(notification.id);

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id
            ? { ...item, is_read: true }
            : item
        )
      );
    }

   if (notification.complaint) {
  navigate("/admin/complaints", {
    state: {
      openComplaintId: notification.complaint,
    },
  });
}
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="shrink-0">
        <AdminSidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />

        <main className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Page Heading */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Notifications
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                View and manage all notifications received by the admin.
              </p>
            </div>

            <button
              onClick={fetchNotifications}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:shadow-md"
            >
              Refresh
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Total Notifications
                </p>
                <Bell className="text-violet-600" size={21} />
              </div>
              <h2 className="mt-3 text-2xl font-bold text-slate-800">
                {notifications.length}
              </h2>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Unread
                </p>
                <Inbox className="text-rose-500" size={21} />
              </div>
              <h2 className="mt-3 text-2xl font-bold text-slate-800">
                {unreadCount}
              </h2>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Read
                </p>
                <CheckCheck className="text-green-600" size={21} />
              </div>
              <h2 className="mt-3 text-2xl font-bold text-slate-800">
                {readCount}
              </h2>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notifications..."
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                <option value="all">All Types</option>
                {notificationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
                <Bell className="mx-auto mb-3 text-slate-300" size={36} />
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
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex w-full gap-4 px-5 py-5 text-left transition hover:bg-violet-50/50 ${
                      !notification.is_read ? "bg-violet-50/40" : "bg-white"
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
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
