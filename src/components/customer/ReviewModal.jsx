
import React, { useState } from "react";
import { Star, X } from "lucide-react";

export default function ReviewModal({
  request,
  onClose,
  onSubmit,
  submitting = false,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }

    try {
      await onSubmit({
        service_request: request.id,
        rating,
        comment: comment.trim(),
      });
    } catch (err) {
      setError(
        err.response?.data?.service_request?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Unable to submit your review. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Write a Review
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Share your experience with the service provider.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Provider */}
        <div className="mb-5 rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">
            Service Provider
          </p>
          <p className="mt-1 font-semibold text-gray-800">
            {request.provider_name || "Provider"}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Request #{request.id}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Your Rating
            </label>

            <div className="mt-3 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  disabled={submitting}
                  onClick={() => setRating(value)}
                  aria-label={`Rate ${value} out of 5`}
                  className="transition hover:scale-110 disabled:cursor-not-allowed"
                >
                  <Star
                    size={30}
                    className={
                      value <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>

            <p className="mt-2 text-xs text-gray-500">
              {rating === 0
                ? "Select your rating"
                : `${rating} out of 5 stars`}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label
              htmlFor="review-comment"
              className="block text-sm font-semibold text-gray-800"
            >
              Your Experience
              <span className="ml-1 font-normal text-gray-400">
                (Optional)
              </span>
            </label>

            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience..."
              rows={4}
              maxLength={1000}
              disabled={submitting}
              className="mt-2 w-full resize-none rounded-lg border border-gray-200 p-3 text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {comment.length}/1000
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
