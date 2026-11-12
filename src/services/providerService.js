import api from "../api/axios";

export const getProviderDashboardStats = async () => {
  const response = await api.get("/api/services/providers/dashboard/stats/");
  return response.data;
};

// Get provider's service requests
export const getProviderRequests = async (status = "") => {
  const response = await api.get("/api/services/providers/my-requests/", {
    params: status ? { status } : {},
  });

  return response.data;
};

export const getProviderRequestDetails = async (id) => {
  const response = await api.get(`/api/services/providers/my-requests/${id}/`);
  return response.data;
};

export const updateProviderRequestStatus = async (id, action) => {
  const response = await api.patch(
    `/api/services/providers/my-requests/${id}/${action}/`
  );
  return response.data;
};

// Get reviews received by a provider
export const getProviderReviews = async (providerId) => {
  const response = await api.get(
    `/api/feedback/providers/${providerId}/reviews/`
  );

  return response.data;
};

// Get reviews received by the logged-in provider
export const getMyProviderReviews = async () => {
  const response = await api.get(
    "/api/feedback/my-provider-reviews/"
  );

  return response.data;
};

export const getProviderNotifications = async () => {
  const response = await api.get("/api/notifications/");
  return response.data;
};

export const markProviderNotificationRead = async (id) => {
  const response = await api.post(
    `/api/notifications/${id}/mark-read/`
  );
  return response.data;
};

export const getProviderUnreadNotificationCount = async () => {
  const response = await api.get(
    "/api/notifications/unread-count/"
  );
  return response.data;
};



