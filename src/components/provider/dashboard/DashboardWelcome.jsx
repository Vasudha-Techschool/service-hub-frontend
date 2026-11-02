import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList } from "lucide-react";

export default function WelcomeSection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Welcome to your Dashboard
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Monitor your service requests and manage your business.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate("/provider/bookings")}
        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
      >
        <ClipboardList size={17} />
        View Requests
      </button>
    </div>
  );
}