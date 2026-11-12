
import { useCallback, useEffect, useState } from "react";
import {
  MessageSquareWarning,
  RefreshCw,
  Eye,
  Search,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import AdminSidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import AdminComplaintDetailsModal from "../../components/admin/AdminComplaintDetailsModal";

import api from "../../api/axios";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  
  const location = useLocation();

  useEffect(() => {
  const complaintId = location.state?.openComplaintId;

  if (!complaintId || complaints.length === 0) return;

  const complaint = complaints.find(
    (item) => item.id === Number(complaintId)
  );

  if (complaint) {
    setSelectedComplaint(complaint);
    setShowDetailsModal(true);

    // Remove navigation state so refreshing doesn't reopen the modal.
    window.history.replaceState({}, document.title, location.pathname);
  }
}, [complaints, location]);
  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/feedback/admin/complaints/"
      );

      const data = response.data.results || response.data;
      setComplaints(data);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setError(
        err.response?.data?.detail ||
        "Unable to load complaints."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const fetchComplaintDetails = async (complaintId) => {
    try {
      const response = await api.get(
        `/api/feedback/admin/complaints/${complaintId}/`
      );

      setSelectedComplaint(response.data);
    } catch (err) {
      console.error("Failed to load complaint details:", err);
      alert("Unable to load complaint details.");
    }
  };

  const handleUpdateComplaint = async (updateData) => {
    if (!selectedComplaint) return;

    try {
      setUpdating(true);

      const response = await api.patch(
        `/api/feedback/admin/complaints/${selectedComplaint.id}/`,
        updateData
      );

      const updatedComplaint = response.data;

      setSelectedComplaint(updatedComplaint);
      await fetchComplaints();

      alert("Complaint updated successfully.");
    } catch (err) {
      console.error(
        "Complaint update failed:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.detail ||
        "Unable to update complaint."
      );
    } finally {
      setUpdating(false);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus =
      statusFilter === "all" ||
      complaint.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" ||
      complaint.category === categoryFilter;

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      complaint.subject?.toLowerCase().includes(search) ||
      complaint.customer_name?.toLowerCase().includes(search) ||
      complaint.provider_name?.toLowerCase().includes(search) ||
      String(complaint.id).includes(search);

    return matchesStatus && matchesCategory && matchesSearch;
  });

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

  const formatStatus = (status) =>
    status?.replaceAll("_", " ").replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );

  const countStatus = (status) =>
    complaints.filter((item) => item.status === status).length;

  return (
     <div className="flex h-screen overflow-hidden bg-gray-50">

    {/* Fixed Admin Sidebar */}
    <div className="fixed inset-y-0 left-0 z-40">
      <AdminSidebar />
    </div>

    {/* Main Section */}
    <div className="ml-64 flex min-w-0 flex-1 flex-col overflow-hidden">

      {/* Fixed Admin Header */}
      <div className="sticky top-0 z-30 shrink-0">
        <Header />
      </div>

      {/* Vertically Scrollable Content */}
      <main className="min-h-0 flex-1 overflow-y-auto space-y-6 p-4 sm:p-6 lg:p-8">


          {/* Page Heading */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-purple-700">
              <MessageSquareWarning size={17} />
              Quality Operations
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Complaint Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Review customer complaints, track provider responses
              and manage resolutions.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-gray-200  rounded-xl shadow-sm bg-white p-5">
              <p className="text-sm text-gray-500">
                Total Complaints
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {complaints.length}
              </h2>
            </div>

            <div className="rounded-xl border border-gray-200  rounded-xl shadow-sm rounded-xlrder bg-white p-5">
              <p className="text-sm text-gray-500">
                Pending
              </p>
              <h2 className="mt-2 text-2xl font-bold text-amber-600">
                {countStatus("pending")}
              </h2>
            </div>

            <div className="rounded-xl border border-gray-200  rounded-xl shadow-sm bg-white p-5">
              <p className="text-sm text-gray-500">
                Under Review
              </p>
              <h2 className="mt-2 text-2xl font-bold text-blue-600">
                {countStatus("under_review") +
                  countStatus("awaiting_response")}
              </h2>
            </div>

            <div className="rounded-xl border border-gray-200  rounded-xl shadow-sm bg-white p-5">
              <p className="text-sm text-gray-500">
                Resolved
              </p>
              <h2 className="mt-2 text-2xl font-bold text-green-600">
                {countStatus("resolved")}
              </h2>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 border border-gray-200  rounded-xl shadow-sm bg-white p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by subject, customer, provider or ID..."
                className="w-full rounded-lg border border-gray-200  rounded-xl shadow-sm py-2 pl-10 pr-3 text-sm outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200  rounded-xl shadow-sm px-3 py-2 text-sm outline-none focus:border-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="awaiting_response">Awaiting Response</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-gray-200  rounded-xl shadow-sm px-3 py-2 text-sm outline-none focus:border-purple-500"
            >
              <option value="all">All Categories</option>
              <option value="service">Service Related</option>
              <option value="provider">Provider Related</option>
              <option value="platform">Platform Related</option>
            </select>

            <button
              onClick={fetchComplaints}
              disabled={loading}
              className="flex items-center justify-center gap-2 border border-gray-200  rounded-xl shadow-sm px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Complaints Table */}
          <div className="overflow-hidden border border-gray-200  rounded-xl shadow-sm bg-white">
            <div className="border border-gray-200  rounded-xl shadow-sm p-5">
              <h2 className="font-semibold text-gray-900">
                Customer Complaints
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {filteredComplaints.length} complaint(s) found
              </p>
            </div>

            {loading ? (
              <div className="p-10 text-center text-gray-500">
                Loading complaints...
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No complaints found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-5 py-4">Complaint</th>
                      <th className="px-5 py-4">Customer</th>
                      <th className="px-5 py-4">Provider</th>
                      <th className="px-5 py-4">Category</th>
                      <th className="px-5 py-4">Date</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredComplaints.map((complaint) => (
                      <tr
                        key={complaint.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900">
                            {complaint.subject}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            #{complaint.id}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {complaint.customer_name || "N/A"}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {complaint.provider_name || "Not linked"}
                        </td>

                        <td className="px-5 py-4 capitalize text-gray-700">
                          {complaint.category}
                        </td>

                        <td className="px-5 py-4 text-gray-500">
                          {new Date(
                            complaint.created_at
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                              complaint.status
                            )}`}
                          >
                            {formatStatus(complaint.status)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() =>
                              fetchComplaintDetails(complaint.id)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:border-purple-500 hover:text-purple-700"
                          >
                            <Eye size={15} />
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          </main>
    </div>

    {/* Complaint Details Modal */}
    {selectedComplaint && (
      <AdminComplaintDetailsModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onUpdate={handleUpdateComplaint}
        updating={updating}
      />
      )}
    </div>
  );
};

export default AdminComplaints;
