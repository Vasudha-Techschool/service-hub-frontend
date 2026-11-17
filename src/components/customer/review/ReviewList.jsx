
import ReviewCard from "./ReviewCard";

export default function ReviewList({ reviews, loading }) {
  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-gray-500">
        Loading your reviews...
      </p>
    );
  }

  if (!reviews.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h3 className="font-semibold text-gray-800">
          No reviews yet
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Reviews you submit after completing a service will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}