
import { useEffect, useState } from "react";
import { X, Save, ExternalLink } from "lucide-react";

const AdminComplaintDetailsModal = ({
  complaint,
  onClose,
  onUpdate,
  updating = false,
}) => {
  const [status, setStatus] = useState(complaint.status || "pending");
  const [adminNotes, setAdminNotes] = useState(
    complaint.admin_notes || ""
  );
  const [resolution, setResolution] = useState(
    complaint.resolution || ""
  );

  useEffect(() => {
    setStatus(complaint.status || "pending");
    setAdminNotes(complaint.admin_notes || "");
    setResolution(complaint.resolution || "");
  }, [complaint]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onUpdate({
      status,
      admin_notes: adminNotes,
      resolution,
    });
  };

  const formatStatus = (value) =>
    value?.replaceAll("_", " ").replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">

        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Complaint #{complaint.id}
            </h2>
            <p className="text-sm text-gray-500">
              Complaint details and admin review
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-5">

          {/* Complaint Information */}
          <section>
            <h3 className="mb-3 font-semibold text-gray-900">
              Complaint Information
            </h3>

            <div className="grid gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Customer</p>
                <p className="font-medium">
                  {complaint.customer_name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Provider</p>
                <p className="font-medium">
                  {complaint.provider_name || "Not linked"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-medium capitalize">
                  {complaint.category}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Service Request</p>
                <p className="font-medium">
                  {complaint.service_request
                    ? `#${complaint.service_request}`
                    : "General complaint"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Submitted On</p>
                <p className="font-medium">
                  {new Date(complaint.created_at).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Current Status</p>
                <p className="font-medium">
                  {formatStatus(complaint.status)}
                </p>
              </div>
            </div>
          </section>

          {/* Customer Description */}
          <section>
            <h3 className="mb-2 font-semibold text-gray-900">
              {complaint.subject}
            </h3>
            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
              {complaint.description}
            </p>

            {complaint.evidence && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Evidence
                </p>
                <a
                  href={complaint.evidence}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  View Evidence <ExternalLink size={14} />
                </a>
              </div>
            )}
          </section>

          {/* Provider Response */}
          {complaint.provider_response && (
            <section className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-900">
                Provider Response
              </h3>
              <p className="whitespace-pre-wrap text-sm text-blue-800">
                {complaint.provider_response}
              </p>

              {complaint.provider_responded_at && (
                <p className="mt-2 text-xs text-blue-600">
                  Responded on:{" "}
                  {new Date(
                    complaint.provider_responded_at
                  ).toLocaleString()}
                </p>
              )}
            </section>
          )}

          {/* Complaint History */}
          {complaint.history?.length > 0 && (
            <section>
              <h3 className="mb-3 font-semibold text-gray-900">
                Complaint History
              </h3>

              <div className="space-y-3">
                {complaint.history.map((item) => (
                  <div
                    key={item.id}
                    className="border-l-2 border-green-500 pl-4"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {item.event_type?.replaceAll("_", " ")}
                    </p>

                    {item.old_status && item.new_status && (
                      <p className="text-sm text-gray-500">
                        {formatStatus(item.old_status)} →{" "}
                        {formatStatus(item.new_status)}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Admin Review Form */}
          <form onSubmit={handleSubmit} className="space-y-4 border-t pt-5">
            <h3 className="font-semibold text-gray-900">
              Admin Review
            </h3>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Update Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-500"
              >
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="awaiting_response">Awaiting Provider Response</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="Add internal review notes..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Resolution
              </label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={3}
                placeholder="Enter the resolution or action taken..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={updating}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                <Save size={16} />
                {updating ? "Saving..." : "Save Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetailsModal;
