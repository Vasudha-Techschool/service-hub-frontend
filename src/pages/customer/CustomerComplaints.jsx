import { useCallback, useEffect, useState } from "react";
import {
  MessageSquareWarning,
  Plus,
  RefreshCw,
  Eye,
} from "lucide-react";

import CustomerSidebar from "../../components/customer/Sidebar";
import CustomerHeader from "../../components/customer/Header";

import ComplaintModal from "../../components/customer/ComplaintModal";
import ComplaintDetailsModal from "../../components/customer/ComplaintDetailsModal";

import {
  getMyComplaints,
  createComplaint,
} from "../../services/customerService";

const CustomerComplaints = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Fetch customer complaints
  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyComplaints();

      setComplaints(
        Array.isArray(response)
          ? response
          : response.results || []
      );
    } catch (error) {
      console.error("Failed to fetch complaints:", error);

      setError(
        error.response?.data?.detail ||
        "Unable to load your complaints."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Create a new general complaint
  const handleCreateComplaint = async (formData) => {
    try {
      setSubmitting(true);

      await createComplaint(formData);

      setShowForm(false);
      await fetchComplaints();

      alert("Complaint submitted successfully.");
    } catch (error) {
      console.error(
        "Complaint submission failed:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.detail ||
        "Unable to submit complaint."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700",
      under_review: "bg-blue-100 text-blue-700",
      awaiting_response: "bg-purple-100 text-purple-700",
      resolved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      closed: "bg-gray-100 text-gray-700",
    };

    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const formatStatus = (status) => {
    return status
      ?.replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
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
        {/* Customer Header */}
        <CustomerHeader />

        <main className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">

          {/* Page Heading */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700">
                <MessageSquareWarning size={17} />
                Customer Support
              </div>

              <h1 className="text-2xl font-bold text-gray-900">
                My Complaints
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Submit complaints and track their progress.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={fetchComplaints}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-green-500 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
              >
                <Plus size={17} />
                Add Complaint
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Complaint Summary */}
          {!loading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">
                  Total Complaints
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {complaints.length}
                </h2>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">
                  Pending Complaints
                </p>
                <h2 className="mt-2 text-2xl font-bold text-amber-600">
                  {
                    complaints.filter(
                      (item) =>
                        item.status === "pending" ||
                        item.status === "under_review" ||
                        item.status === "awaiting_response"
                    ).length
                  }
                </h2>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-500">
                  Resolved Complaints
                </p>
                <h2 className="mt-2 text-2xl font-bold text-green-600">
                  {
                    complaints.filter(
                      (item) => item.status === "resolved"
                    ).length
                  }
                </h2>
              </div>
            </div>
          )}

          {/* Complaints List */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900">
                Complaint History
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View the complaints you have submitted.
              </p>
            </div>

            {loading ? (
              <div className="p-10 text-center text-gray-500">
                Loading complaints...
              </div>
            ) : complaints.length === 0 ? (
              <div className="p-10 text-center">
                <MessageSquareWarning
                  size={40}
                  className="mx-auto mb-3 text-gray-300"
                />
                <p className="font-medium text-gray-700">
                  No complaints found
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  You have not submitted any complaints yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {complaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {complaint.subject}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Complaint #{complaint.id} ·{" "}
                        {complaint.category}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(
                          complaint.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                          complaint.status
                        )}`}
                      >
                        {formatStatus(complaint.status)}
                      </span>

                      <button
                        onClick={() =>
                          setSelectedComplaint(complaint)
                        }
                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-green-500 hover:text-green-700"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Reuse the same ComplaintModal used in ServiceRequestDetails */}
      {showForm && (
        <ComplaintModal
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateComplaint}
          submitting={submitting}
        />
      )}

      {/* Complaint Details */}
      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
};

export default CustomerComplaints;