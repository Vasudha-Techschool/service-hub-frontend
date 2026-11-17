
import { useEffect, useMemo, useState } from "react";

import CustomerSidebar from "../../components/customer/Sidebar";
import CustomerHeader from "../../components/customer/Header";

import ReviewList from "../../components/customer/review/ReviewList";
import ReviewFilters from "../../components/customer/review/ReviewFilters";

import { getMyReviews } from "../../services/customerService";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getMyReviews();
        setReviews(
          Array.isArray(data) ? data : data.results || []
        );
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    if (filter === "all") return reviews;

    return reviews.filter(
      (review) => String(review.rating) === filter
    );
  }, [reviews, filter]);

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
              My Reviews
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View the feedback you have submitted for service providers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border bg-white p-4">
              <p className="text-sm text-gray-500">Total Reviews</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {reviews.length}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {reviews.length
                  ? (
                      reviews.reduce(
                        (sum, review) => sum + Number(review.rating || 0),
                        0
                      ) / reviews.length
                    ).toFixed(1)
                  : "0.0"}
                <span className="ml-1 text-sm text-gray-400">/ 5</span>
              </p>
            </div>

            <div className="col-span-2 rounded-xl border bg-white p-4 sm:col-span-1">
              <p className="text-sm text-gray-500">Positive Reviews</p>
              <p className="mt-2 text-2xl font-bold text-green-700">
                {reviews.filter(
                  (review) => review.sentiment === "positive"
                ).length}
              </p>
            </div>
          </div>

          <ReviewFilters
            value={filter}
            onChange={setFilter}
          />

          <ReviewList
            reviews={filteredReviews}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
}