
import React from "react";

const ComplaintModal = ({
  request = null,
  onClose,
  onSubmit,
  submitting = false,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Automatically attach service request when opened from RequestDetails
    if (request?.id) {
      formData.append("service_request", request.id);
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Raise a Complaint
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-xl text-gray-400 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-500">
          {request?.id
            ? `Request #${request.id} - Describe your complaint below.`
            : "Describe your complaint below."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Complaint Category
            </label>

            <select
              name="category"
              required
              defaultValue=""
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="" disabled>Select Category</option>
              <option value="service">Service Related</option>
              <option value="provider">Provider Related</option>
              <option value="platform">Platform Related</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Subject
            </label>

            <input
              type="text"
              name="subject"
              required
              maxLength={255}
              placeholder="Enter complaint subject"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              required
              rows={4}
              placeholder="Explain your complaint..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Evidence Image (Optional)
            </label>

            <input
              type="file"
              name="evidence"
              accept="image/*"
              className="w-full text-sm text-gray-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ComplaintModal;
