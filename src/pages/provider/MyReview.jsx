import React, { useEffect, useState } from "react";
import {
  Star,
  MessageSquareText,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import { getMyProviderReviews } from "../../services/providerService";
import ReviewCard from "../../components/provider/ReviewCard";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProviderReviews();
      const reviewList=Array.isArray(data)
      ? data : data.results || []

    
      setReviews(reviewList);

    } catch (err) {
      console.error("Error fetching provider reviews : ",err)
      setError(
        err.response?.data?.detail ||
        "Unable to load your reviews. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

//fetch Reviews  ; fetchReviews is fun where we fetch api from service
  useEffect(()=>{
    fetchReviews();
  },[]);

  
  const totalReviews=reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (total, review) => total + Number(review.rating || 0),
            0
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

    //   this is for count each rating .ie; if rating is 5;
    // number of 5 rating review
  const getRatingCount = (rating) =>
    reviews.filter(
      (review) => Number(review.rating) === rating
    ).length;

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            My Reviews
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            See what customers think about your services.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />

          <p className="mt-3 text-sm text-gray-500">
            Loading your reviews...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-600">{error}</p>

          <button
            onClick={fetchReviews}
            className="mt-3 text-sm font-semibold text-red-700 hover:underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Review content */}
      {!loading && !error && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Average Rating */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  Average Rating
                </p>

                <div className="rounded-lg bg-amber-50 p-2">
                  <Star
                    size={20}
                    className="fill-amber-400 text-amber-400"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-800">
                  {averageRating}
                </span>

                <span className="text-sm text-gray-400">
                  / 5.0
                </span>
              </div>

              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={17}
                    className={
                      star <= Math.round(Number(averageRating))
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>

            {/* Total Reviews */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  Total Reviews
                </p>

                <div className="rounded-lg bg-purple-50 p-2">
                  <MessageSquareText
                    size={20}
                    className="text-purple-600"
                  />
                </div>
              </div>

              <p className="mt-3 text-3xl font-bold text-gray-800">
                {totalReviews}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Customer feedback received
              </p>
            </div>

            {/* Five Star Reviews */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  5-Star Reviews
                </p>

                <div className="rounded-lg bg-green-50 p-2">
                  <TrendingUp
                    size={20}
                    className="text-green-600"
                  />
                </div>
              </div>

              <p className="mt-3 text-3xl font-bold text-gray-800">
                {getRatingCount(5)}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Excellent customer ratings
              </p>
            </div>

          </div>

          {/* Rating Distribution */}
          {totalReviews > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-5 font-semibold text-gray-800">
                Rating Breakdown
              </h2>

              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = getRatingCount(rating);
                  const percentage = (count / totalReviews) * 100;

                  return (
                    <div
                      key={rating}
                      className="flex items-center gap-3"
                    >
                      <div className="flex w-12 items-center gap-1 text-sm text-gray-600">
                        {rating}
                        <Star
                          size={13}
                          className="fill-amber-400 text-amber-400"
                        />
                      </div>

                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <span className="w-8 text-right text-xs text-gray-500">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Individual Reviews */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Customer Feedback
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Reviews submitted by customers after completed services.
              </p>
            </div>

            {totalReviews === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
                <MessageSquareText
                  size={35}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-3 font-semibold text-gray-700">
                  No Reviews Yet
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Customer reviews will appear here once they review your completed services.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}