
import { CalendarDays, ChevronRight, FileText } from "lucide-react";

const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700",
  under_review: "bg-blue-50 text-blue-700",
  awaiting_response: "bg-orange-50 text-orange-700",
  resolved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  closed: "bg-gray-100 text-gray-700",
};

export default function ComplaintCard({ complaint, onView }) {
  const date = complaint.created_at
    ? new Date(complaint.created_at).toLocaleDateString()
    : "Date unavailable";

  const statusLabel = (complaint.status || "")
    .replace(/_/g, " ");

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
            <FileText size={21} />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              {complaint.subject}
            </h3>
            <p className="mt-1 text-xs capitalize text-gray-500">
              {complaint.category} complaint · #{complaint.id}
            </p>
          </div>
        </div>

        <span
          className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            statusStyles[complaint.status] ||
            "bg-gray-100 text-gray-700"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-600">
        {complaint.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <span className="flex items-center gap-2 text-xs text-gray-500">
          <CalendarDays size={15} />
          Submitted {date}
        </span>

        <button
          type="button"
          onClick={() => onView(complaint.id)}
          className="flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800"
        >
          View Details
          <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}