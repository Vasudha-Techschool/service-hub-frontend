import React from "react";
import { Star, UserRound, CalendarDays } from "lucide-react";

export default function ReviewCard({ review }) {
  const rating = Number(review.rating) || 0;

  const formattedDate = review.created_at
    ? new Date(review.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-sm">

      {/* Customer details */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <UserRound size={21} />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              {review.customer_name || "Customer"}
            </h3>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <CalendarDays size={13} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={17}
              className={
                star <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300"
              }
            />
          ))}

          <span className="ml-1 text-sm font-semibold text-gray-700">
            {rating}/5
          </span>
        </div>
      </div>

      {/* Review comment */}
      <div className="mt-4">
        <p className="text-sm leading-6 text-gray-600">
          {review.comment || "No written comment provided."}
        </p>
      </div>

    </div>
  );
}