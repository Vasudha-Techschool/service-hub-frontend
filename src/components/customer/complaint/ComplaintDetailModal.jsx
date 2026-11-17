
import { X, Clock, FileText } from "lucide-react";

export default function ComplaintDetailsModal({
  complaint,
  loading,
  onClose,
}) {
  if (!complaint && !loading) return null;

  const formatStatus = (value) =>
    (value || "").replace(/_/g, " ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Complaint Details
            </h2>
            {complaint && (
              <p className="text-xs text-gray-500">
                Complaint #{complaint.id}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close complaint details"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <p className="p-10 text-center text-gray-500">
            Loading complaint details...
          </p>
        ) : (
          <div className="space-y-6 p-5">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FileText size={16} />
                <span className="capitalize">
                  {complaint.category} complaint
                </span>
              </div>

              <h3 className="mt-2 text-lg font-semibold text-gray-900">
                {complaint.subject}
              </h3>

              <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                {formatStatus(complaint.status)}
              </span>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-800">
                Description
              </h4>
              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                {complaint.description}
              </p>
            </div>

            {complaint.evidence && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-800">
                  Uploaded Evidence
                </h4>
                <a
                  href={complaint.evidence}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-green-700 underline"
                >
                  View attached evidence
                </a>
              </div>
            )}

            {complaint.provider_response && (
              <div className="rounded-xl bg-blue-50 p-4">
                <h4 className="text-sm font-semibold text-blue-900">
                  Provider Response
                </h4>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-blue-800">
                  {complaint.provider_response}
                </p>
              </div>
            )}

            {complaint.resolution && (
              <div className="rounded-xl bg-green-50 p-4">
                <h4 className="text-sm font-semibold text-green-900">
                  Admin Resolution
                </h4>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-green-800">
                  {complaint.resolution}
                </p>
              </div>
            )}

            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Clock size={16} />
                Complaint History
              </h4>

              {complaint.history?.length ? (
                <div className="space-y-4 border-l-2 border-gray-200 pl-4">
                  {complaint.history.map((item) => (
                    <div key={item.id} className="relative">
                      <span className="absolute -left-[22px] top-1 h-2.5 w-2.5 rounded-full bg-green-600" />

                      <p className="text-sm font-medium capitalize text-gray-800">
                        {formatStatus(item.event_type)}
                      </p>

                      {item.old_status && item.new_status && (
                        <p className="mt-1 text-xs text-gray-500">
                          {formatStatus(item.old_status)}
                          {" → "}
                          {formatStatus(item.new_status)}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No complaint history available.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}