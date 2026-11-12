
import { X, CalendarDays, UserRound, FileText } from "lucide-react";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  under_review: "bg-blue-100 text-blue-700",
  awaiting_response: "bg-orange-100 text-orange-700",
  resolved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  closed: "bg-gray-100 text-gray-700",
};

const ComplaintDetailsModal = ({ complaint, onClose }) => {
  if (!complaint) return null;

  const formatStatus = (status) =>
    status?.replaceAll("_", " ").replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString() : "Not available";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Complaint Details
            </h2>
            <p className="text-sm text-gray-500">
              Complaint #{complaint.id}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {complaint.subject}
            </h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                statusStyles[complaint.status] || statusStyles.closed
              }`}
            >
              {formatStatus(complaint.status)}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500">Category</p>
              <p className="mt-1 font-medium capitalize">
                {complaint.category}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Service Request</p>
              <p className="mt-1 font-medium">
                {complaint.service_request ?? "General Complaint"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Provider</p>
              <p className="mt-1 font-medium">
                {complaint.provider_name || "Not applicable"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Submitted On</p>
              <p className="mt-1 flex items-center gap-2 font-medium">
                <CalendarDays size={16} />
                {formatDate(complaint.created_at)}
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-800">
              <FileText size={17} /> Description
            </h4>
            <p className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">
              {complaint.description}
            </p>
          </div>

          {complaint.evidence && (
            <div>
              <h4 className="mb-2 font-semibold text-gray-800">Evidence</h4>
              <a
                href={complaint.evidence}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 underline"
              >
                View uploaded evidence
              </a>
            </div>
          )}

          {complaint.provider_response && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-800">
                <UserRound size={17} /> Provider Response
              </h4>
              <p className="rounded-lg bg-blue-50 p-4 text-sm text-gray-700">
                {complaint.provider_response}
              </p>
            </div>
          )}

          {complaint.resolution && (
            <div>
              <h4 className="mb-2 font-semibold text-gray-800">Admin Resolution</h4>
              <p className="rounded-lg bg-green-50 p-4 text-sm text-gray-700">
                {complaint.resolution}
              </p>
            </div>
          )}

          <div>
            <h4 className="mb-3 font-semibold text-gray-800">
              Complaint History
            </h4>

            {complaint.history?.length > 0 ? (
              <div className="space-y-3">
                {complaint.history.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="border-l-2 border-blue-200 pl-4"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {formatStatus(item.status || item.action || "Updated")}
                    </p>
                    {item.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {item.description}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(item.created_at)}
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

        <div className="border-t p-5 text-right">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-5 py-2 text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsModal;
