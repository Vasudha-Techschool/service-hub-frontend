import api from "../api/axios";

//create review
export const createReview = async (reviewData) => {
  const response = await api.post(
    "api/feedback/reviews/",
    reviewData
  );
  return response.data;
};


// Fetch complaints belonging to the logged-in customer
export const getMyComplaints = async () => {
  const response = await api.get("api/feedback/complaints/my/");
  return response.data;
};

// Create a new complaint
export const createComplaint = async (formData) => {
  const response = await api.post("api/feedback/complaints/create/", formData);
  return response.data;
};


//-------------------------- Notification 
// Get notifications for the logged-in customer
export const getCustomerNotifications = async () => {
  const response = await api.get("/api/notifications/");
  return response.data;
};

// Get unread notification count
export const getUnreadNotificationCount = async () => {
  const response = await api.get("/api/notifications/unread-count/");
  return response.data;
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  const response = await api.post(
    `/api/notifications/${notificationId}/mark-read/`
  );
  return response.data;
};


export const getCustomerUnreadNotificationCount = async () => {
  const response = await api.get("/api/notifications/unread-count/");
  return response.data;
};



// Customer's submitted reviews
export const getMyReviews = async () => {
  const response = await api.get("/api/feedback/my-reviews/");
  return response.data;
};




// Single complaint details
export const getComplaintDetails = async (complaintId) => {
  const response = await api.get(
    `/api/feedback/complaints/${complaintId}/`
  );
  return response.data;
};










