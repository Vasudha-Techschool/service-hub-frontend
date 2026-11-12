
import api from "../api/axios";

// Get all admin notifications
export const getAdminNotifications = async () => {
  const response = await api.get("/api/notifications/");
  return response.data;
};

// Get admin unread notification count
export const getAdminUnreadNotificationCount = async () => {
  const response = await api.get("/api/notifications/unread-count/");
  return response.data;
};

// Mark a notification as read
export const markAdminNotificationRead = async (notificationId) => {
  const response = await api.post(
    `/api/notifications/${notificationId}/mark-read/`
  );
  return response.data;
};
