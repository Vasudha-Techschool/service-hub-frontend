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

