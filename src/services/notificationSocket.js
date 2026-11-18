
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const connectNotificationSocket = (
  onNotification,
  onStatus
) => {
  let socket = null;
  let reconnectTimer = null;
  let manuallyClosed = false;
  let reconnectDelay = 1000;

  const MAX_RECONNECT_DELAY = 30000;

  const connect = () => {
    if (manuallyClosed) return;

    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access");

    if (!token) {
      onStatus?.("disconnected");
      return;
    }

    try {
      const wsUrl = new URL("/ws/notifications/", API_BASE_URL);

      wsUrl.protocol =
        wsUrl.protocol === "https:" ? "wss:" : "ws:";

      wsUrl.searchParams.set("token", token);

      socket = new WebSocket(wsUrl.toString());

      onStatus?.("connecting");

      socket.onopen = () => {
        reconnectDelay = 1000;
        onStatus?.("connected");
        console.log("Notification WebSocket connected");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Supports both direct notification and wrapped response.
          const notification = data.notification || data;

          onNotification?.(notification);
        } catch (error) {
          console.error(
            "Failed to parse notification:",
            error
          );
        }
      };

      socket.onerror = () => {
        onStatus?.("error");
      };

      socket.onclose = () => {
        onStatus?.("disconnected");

        if (manuallyClosed) return;

        reconnectTimer = setTimeout(() => {
          connect();

          reconnectDelay = Math.min(
            reconnectDelay * 2,
            MAX_RECONNECT_DELAY
          );
        }, reconnectDelay);
      };
    } catch (error) {
      console.error(
        "Notification WebSocket connection failed:",
        error
      );

      onStatus?.("error");

      if (!manuallyClosed) {
        reconnectTimer = setTimeout(() => {
          connect();

          reconnectDelay = Math.min(
            reconnectDelay * 2,
            MAX_RECONNECT_DELAY
          );
        }, reconnectDelay);
      }
    }
  };

  connect();

  // Cleanup function
  return () => {
    manuallyClosed = true;

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }

    if (socket) {
      socket.close();
      socket = null;
    }
  };
};
