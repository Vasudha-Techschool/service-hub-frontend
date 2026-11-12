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








