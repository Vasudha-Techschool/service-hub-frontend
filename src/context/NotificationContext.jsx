
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSelector } from "react-redux";

import api from "../api/axios";
import { connectNotificationSocket } from "../services/notificationSocket";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  // Fetch unread notification count
  const refreshUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const response = await api.get("/api/notifications/unread-count/");

      setUnreadCount(
        Number(response.data.unread_count ?? response.data.count ?? 0)
      );
    } catch (error) {
      console.error("Failed to fetch unread notification count:", error);
    }
  }, [user]);

  // Receive new notification from WebSocket
  const handleNewNotification = useCallback((notification) => {
    if (!notification?.id) return;

    setNotifications((previous) => {
      const alreadyExists = previous.some(
        (item) => item.id === notification.id
      );

      if (alreadyExists) return previous;

      return [notification, ...previous];
    });

    if (!notification.is_read) {
      setUnreadCount((previous) => previous + 1);
    }

    // Notify existing header components until they use context directly.
    window.dispatchEvent(
      new Event("customer-notifications-updated")
    );

    window.dispatchEvent(
      new Event("provider-notifications-updated")
    );
  }, []);

  // Connect WebSocket for authenticated user
  useEffect(() => {
    if (!user || !accessToken) {
      setNotifications([]);
      setUnreadCount(0);
      setConnectionStatus("disconnected");
      return;
    }

    refreshUnreadCount();

    const disconnect = connectNotificationSocket(
      handleNewNotification,
      setConnectionStatus
    );

    return () => {
      disconnect();
    };
  }, [
    user?.id,
    user?.role,
    accessToken,
    refreshUnreadCount,
    handleNewNotification,
  ]);

  // Listen for notification read events from existing pages
  useEffect(() => {
    const handleNotificationUpdate = () => {
      refreshUnreadCount();
    };

    window.addEventListener(
      "customer-notifications-updated",
      handleNotificationUpdate
    );

    window.addEventListener(
      "provider-notifications-updated",
      handleNotificationUpdate
    );

    return () => {
      window.removeEventListener(
        "customer-notifications-updated",
        handleNotificationUpdate
      );

      window.removeEventListener(
        "provider-notifications-updated",
        handleNotificationUpdate
      );
    };
  }, [refreshUnreadCount]);

  const value = {
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    connectionStatus,
    refreshUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
};
