import { Eye, Check, X, UserRound } from "lucide-react";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  incomplete: "bg-purple-50 text-purple-700",
};

const statusLabels = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  incomplete: "Profile Incomplete",
};

export default function ProviderTable({
  providers,
  loading,
  onView,
  onVerify,
}) {
  if (loading) {
    return (
      <div className="p-10 text-center text-sm text-gray-500">
        Loading providers...
      </div>
    );
  }

  if (!providers.length) {
    return (
      <div className="p-10 text-center">
        <UserRound className="mx-auto mb-3 text-gray-400" size={32} />
        <p className="font-medium text-gray-800">No providers found</p>
        <p className="mt-1 text-sm text-gray-500">
          Try changing your search or status filter.
        </p>
      </div>
    );
  }
  console.log("providers :",providers)

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-5 py-4 font-semibold">Provider</th>
            <th className="px-5 py-4 font-semibold">Contact</th>
            <th className="px-5 py-4 font-semibold">Service / Location</th>
            <th className="px-5 py-4 font-semibold">Experience</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {providers.map((provider) => (
            <tr
              key={provider.id}
              className="transition hover:bg-gray-50"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {provider.profile_photo ? (
                    <img
                      src={provider.profile_photo}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-700">
                      {(provider.full_name || "P").charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-gray-900">
                      {provider.full_name || "Unnamed provider"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      ID: {provider.id}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <p className="text-gray-800">{provider.email || "—"}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {provider.phone || "Phone not added"}
                </p>
              </td>

              <td className="px-5 py-4">
                <p className="text-gray-800">
                  {provider.service_category || "Not specified"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {provider.service_location || "Location not added"}
                </p>
              </td>

              <td className="px-5 py-4 text-gray-700">
                {provider.hasProfile
                  ? `${provider.experience_years} years`
                  : "—"}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                    statusStyles[provider.status] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {statusLabels[provider.status] || provider.status}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onView(provider)}
                    title="View details"
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Eye size={16} />
                  </button>

                  {provider.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => onVerify(provider, "approved")}
                        title="Approve provider"
                        className="rounded-lg border border-green-200 p-2 text-green-700 hover:bg-green-50"
                      >
                        <Check size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onVerify(provider, "rejected")}
                        title="Reject provider"
                        className="rounded-lg border border-red-200 p-2 text-red-700 hover:bg-red-50"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}