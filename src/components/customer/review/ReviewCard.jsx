
import { Star } from "lucide-react";

export default function ReviewCard({ review }) {
  const date = review.created_at
    ? new Date(review.created_at).toLocaleDateString()
    : "Date unavailable";

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            {review.provider_name || "Service Provider"}
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Submitted on {date}
          </p>
        </div>

        {review.sentiment && (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700">
            {review.sentiment}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={17}
            className={
              index < review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {review.rating}/5
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {review.comment || "No written comment provided."}
      </p>
    </article>
  );
}
