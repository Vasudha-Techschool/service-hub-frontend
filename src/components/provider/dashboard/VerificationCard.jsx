import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const verificationStyles = {
  approved: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-red-50 text-red-700",
  unknown: "bg-gray-100 text-gray-600",
};

export default function VerificationStatus({
  status = "unknown",
}) {
  const navigate = useNavigate();

  const normalizedStatus = status?.toLowerCase() || "unknown";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
          <ShieldCheck size={22} />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Account Verification
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Check your provider verification status.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
            verificationStyles[normalizedStatus] ||
            verificationStyles.unknown
          }`}
        >
          {normalizedStatus}
        </span>

        <button
          type="button"
          onClick={() => navigate("/provider/verification")}
          className="text-sm font-medium text-green-700 hover:text-green-800"
        >
          View Details
        </button>
      </div>
    </div>
  );
}