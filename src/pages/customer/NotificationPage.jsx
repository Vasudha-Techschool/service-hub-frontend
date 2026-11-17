
import { useEffect, useState,useCallback  } from "react";
import { Bell, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CustomerSidebar from "../../components/customer/Sidebar";
import CustomerHeader from "../../components/customer/Header";

import NotificationList from "../../components/customer/notification/NotificationList";
import NotificationFilters from "../../components/customer/notification/NotificationFilters";

import {
  getCustomerNotifications,
  markNotificationAsRead,
} from "../../services/customerService";

const CustomerNotifications = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomerNotifications();

      const notificationList = Array.isArray(data)
        ? data
        : data.results || [];

      setNotifications(notificationList);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (item) => !item.is_read
  ).length;

  const readCount = notifications.length - unreadCount;

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === "unread") return !item.is_read;
    if (activeFilter === "read") return item.is_read;
    return true;
  });

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.is_read) {
        setUpdatingId(notification.id);

        await markNotificationAsRead(notification.id);

        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id
              ? { ...item, is_read: true }
              : item
          )
        );

        await markNotificationAsRead(notification.id);

setNotifications((prev) =>
  prev.map((item) =>
    item.id === notification.id
      ? { ...item, is_read: true }
      : item
  )
);

window.dispatchEvent(
  new Event("customer-notifications-updated")
);
      }

      if (notification.service_request) {
        navigate(
          `/customer/requests`
        );
      } else if (notification.complaint) {
        navigate(
          `/customer/complaints`
        );
      }
    } catch (error) {
      console.error("Notification update failed:", error);
      setError("Unable to open this notification.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Customer Sidebar */}
      <CustomerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() =>
          setCollapsed((prev) => !prev)
        }
      />

      {/* Main Content */}
      <div
        className={`min-h-screen min-w-0 transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <CustomerHeader />

        <main className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">

          {/* Page Heading */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700">
                <Bell size={17} />
                Customer Updates
              </div>

              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Stay updated on your bookings and complaints.
              </p>
            </div>

            <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
              {unreadCount} Unread Notifications
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle size={18} />
              {error}

              <button
                type="button"
                onClick={fetchNotifications}
                className="ml-auto font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Filters */}
          <NotificationFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            totalCount={notifications.length}
            unreadCount={unreadCount}
            readCount={readCount}
          />

          {/* Notification List */}
          <NotificationList
            notifications={filteredNotifications}
            loading={loading}
            onNotificationClick={handleNotificationClick}
            updatingId={updatingId}
          />

        </main>
      </div>
    </div>
  );
};

export default CustomerNotifications;
