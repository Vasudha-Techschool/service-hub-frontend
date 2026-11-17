
import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, AlertCircle, MessageSquare } from "lucide-react";

import {
  getProviderComplaints,
  respondToComplaint,
} from "../../services/providerService";

import ProviderSidebar from "../../components/provider/Sidebar";
import Header from "../../components/provider/Header";

import ComplaintStats from "../../components/provider/complaints/ComplaintStats";
import ComplaintFilters from "../../components/provider/complaints/ComplaintFilters";
import ComplaintList from "../../components/provider/complaints/ComplaintList";
import ComplaintDetailsModal from "../../components/provider/complaints/ComplaintDetailsModal";

const ProviderComplaints = () => {
  // Complaint data
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Selected complaint
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  // Messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch provider complaints
  const fetchComplaints = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const data = await getProviderComplaints();

      // Support both paginated and non-paginated DRF responses
      const complaintList = Array.isArray(data)
        ? data
        : data.results || [];

      setComplaints(complaintList);

      return complaintList;
    } catch (err) {
      console.error("Failed to fetch complaints:", err);

      setError(
        err.response?.data?.detail ||
        "Unable to load complaints. Please try again."
      );

      return null;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial API call
  useEffect(() => {
    fetchComplaints(true);
  }, [fetchComplaints]);

  // Search and filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        complaint.subject?.toLowerCase().includes(searchValue) ||
        complaint.customer_name?.toLowerCase().includes(searchValue) ||
        complaint.description?.toLowerCase().includes(searchValue) ||
        String(complaint.id).includes(searchValue);

      const matchesStatus =
        status === "all" || complaint.status === status;

      const matchesCategory =
        category === "all" || complaint.category === category;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [complaints, search, status, category]);

  // Reset filters
  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setCategory("all");
  };

  // Open complaint details
  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setError("");
    setSuccess("");
  };

  // Close complaint modal
  const handleCloseModal = () => {
    if (submitting) return;

    setSelectedComplaint(null);
    setError("");
    setSuccess("");
  };

  // Submit provider response
  const handleSubmitResponse = async (data) => {
    if (!selectedComplaint) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await respondToComplaint(
        selectedComplaint.id,
        data
      );

      // Refresh complaint data after successful response
      const updatedComplaints = await fetchComplaints();

      if (updatedComplaints) {
        const updatedComplaint = updatedComplaints.find(
          (item) => item.id === selectedComplaint.id
        );

        if (updatedComplaint) {
          setSelectedComplaint(updatedComplaint);
        }

        setSuccess("Your response has been submitted successfully.");
      } else {
        setSuccess("Your response was submitted successfully.");
      }
    } catch (err) {
      console.error("Failed to submit response:", err);

      setError(
        err.response?.data?.detail ||
        err.response?.data?.provider_response?.[0] ||
        "Unable to submit your response. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      

      {/* Main Content */}
      <div className="flex-1 min-w-0">

       

        <main className="p-4 md:p-6 lg:p-8 space-y-6">

          {/* Page Heading */}
          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>
              <div className="flex items-center gap-2">
                <MessageSquare
                  size={24}
                  className="text-blue-600"
                />

                <h1 className="text-2xl font-bold text-gray-800">
                  My Complaints
                </h1>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Review customer complaints and submit your explanations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchComplaints()}
              disabled={refreshing || loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw
                size={32}
                className="animate-spin text-blue-600"
              />

              <p className="text-gray-500 text-sm mt-4">
                Loading complaints...
              </p>
            </div>
          ) : (
            <>
              {/* Statistics */}
              <ComplaintStats
                complaints={complaints}
              />

              {/* Filters */}
              <ComplaintFilters
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
                category={category}
                setCategory={setCategory}
                onReset={handleResetFilters}
              />

              {/* Complaint List */}
              <ComplaintList
                complaints={filteredComplaints}
                onViewDetails={handleViewDetails}
              />
            </>
          )}

        </main>
      </div>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={handleCloseModal}
          onSubmitResponse={handleSubmitResponse}
          submitting={submitting}
        />
      )}

    </div>
  );
};

export default ProviderComplaints;