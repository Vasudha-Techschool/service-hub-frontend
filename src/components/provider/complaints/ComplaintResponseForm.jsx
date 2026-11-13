
import { useState } from "react";
import {
  Send,
  MessageSquare,
  AlertCircle,
  Clock,
} from "lucide-react";

const ComplaintResponseForm = ({
  complaint,
  onSubmit,
  loading = false,
}) => {
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const maxLength = 2000;

  const isDeadlinePassed =
    complaint.response_deadline &&
    new Date(complaint.response_deadline).getTime() < Date.now();

  const canRespond =
    complaint.status === "awaiting_response" &&
    !isDeadlinePassed;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedResponse = response.trim();

    if (!trimmedResponse) {
      setError("Please provide a valid response.");
      return;
    }

    if (trimmedResponse.length > maxLength) {
      setError(`Response cannot exceed ${maxLength} characters.`);
      return;
    }

    setError("");

    await onSubmit({
      provider_response: trimmedResponse,
    });
  };

  // Display existing response
  if (complaint.provider_response) {
    return (
      <div className="border border-green-200 bg-green-50 rounded-xl p-5">
        <div className="flex items-center gap-2 text-green-700 mb-3">
          <MessageSquare size={18} />

          <h3 className="font-semibold">
            Your Submitted Response
          </h3>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {complaint.provider_response}
        </p>

        {complaint.provider_responded_at && (
          <p className="text-xs text-gray-500 mt-3">
            Submitted on:{" "}
            {new Date(
              complaint.provider_responded_at
            ).toLocaleString("en-IN")}
          </p>
        )}
      </div>
    );
  }

  // No response required
  if (!canRespond) {
    return (
      <div className="border border-gray-200 bg-gray-50 rounded-xl p-5">
        <div className="flex items-center gap-2 text-gray-600">
          <AlertCircle size={18} />

          <p className="text-sm font-medium">
            {complaint.status !== "awaiting_response"
              ? "No response is currently required for this complaint."
              : "The response deadline has passed. You can no longer submit a response."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-200 rounded-xl p-5 space-y-4"
    >
      {/* Form Header */}
      <div>
        <div className="flex items-center gap-2 text-gray-800">
          <MessageSquare size={19} />

          <h3 className="font-semibold">
            Submit Your Response
          </h3>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Explain your side of the situation clearly.
          Your response will be reviewed by the administration.
        </p>
      </div>

      {/* Deadline */}
      {complaint.response_deadline && (
        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 rounded-lg p-3 text-xs font-medium">
          <Clock size={16} />

          Response deadline:{" "}
          {new Date(
            complaint.response_deadline
          ).toLocaleString("en-IN")}
        </div>
      )}

      {/* Response Textarea */}
      <div>
        <label
          htmlFor="provider-response"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Explanation <span className="text-red-500">*</span>
        </label>

        <textarea
          id="provider-response"
          value={response}
          onChange={(e) => {
            setResponse(e.target.value);
            setError("");
          }}
          placeholder="Write your explanation here..."
          rows={5}
          maxLength={maxLength}
          disabled={loading}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100"
        />

        <div className="flex justify-between mt-2">
          {error ? (
            <p className="text-xs text-red-600">
              {error}
            </p>
          ) : (
            <p className="text-xs text-gray-400">
              Please provide a clear and professional explanation.
            </p>
          )}

          <span className="text-xs text-gray-400">
            {response.length}/{maxLength}
          </span>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !response.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Send size={16} />

          {loading ? "Submitting..." : "Submit Response"}
        </button>
      </div>
    </form>
  );
};

export default ComplaintResponseForm;
