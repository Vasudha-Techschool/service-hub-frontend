
import { useEffect, useMemo, useState } from "react";

import CustomerSidebar from "../../components/customer/Sidebar";
import CustomerHeader from "../../components/customer/Header";

import ComplaintList from "../../components/customer/complaint/ComplantList";
import ComplaintFilters from "../../components/customer/complaint/ComplaintFilters";
import ComplaintDetailsModal from "../../components/customer/complaint/ComplaintDetailModal";

import {
  getMyComplaints,
  getComplaintDetails,
} from "../../services/customerService";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setError("");
        const data = await getMyComplaints();

        setComplaints(
          Array.isArray(data) ? data : data.results || []
        );
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
        setError("Unable to load your complaints. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    if (filter === "all") return complaints;

    return complaints.filter(
      (complaint) => complaint.status === filter
    );
  }, [complaints, filter]);

  const handleViewComplaint = async (complaintId) => {
    setSelectedComplaint(null);
    setDetailsLoading(true);

    try {
      const data = await getComplaintDetails(complaintId);
      setSelectedComplaint(data);
    } catch (err) {
      console.error("Failed to fetch complaint details:", err);
      setError("Unable to load complaint details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const statusCount = (status) =>
    complaints.filter(
      (complaint) => complaint.status === status
    ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />

      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <CustomerHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Complaints
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track the complaints you have registered and view their updates.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border bg-white p-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {complaints.length}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="mt-2 text-2xl font-bold text-yellow-600">
                {statusCount("pending")}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <p className="text-sm text-gray-500">Under Review</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {statusCount("under_review")}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {statusCount("resolved")}
              </p>
            </div>
          </div>

          <ComplaintFilters
            value={filter}
            onChange={setFilter}
          />

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <ComplaintList
            complaints={filteredComplaints}
            loading={loading}
            onView={handleViewComplaint}
          />
        </main>
      </div>

      {(selectedComplaint || detailsLoading) && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          loading={detailsLoading}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
}