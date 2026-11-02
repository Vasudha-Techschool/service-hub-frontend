import { X, MapPin, Phone, Mail, BriefcaseBusiness } from "lucide-react";

export default function ProviderDetailsModal({
  provider,
  onClose,
  onVerify,
  busy,
}) {
  if (!provider) return null;

  const details = [
    { label: "Email", value: provider.email, icon: Mail },
    { label: "Phone", value: provider.phone, icon: Phone },
    {
      label: "Service location",
      value: provider.service_location,
      icon: MapPin,
    },
    {
      label: "Experience",
      value: provider.hasProfile
        ? `${provider.experience_years} years`
        : "Profile not created",
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="provider-details-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2
              id="provider-details-title"
              className="text-lg font-bold text-gray-900"
            >
              Provider Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Provider ID: {provider.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex items-center gap-4">
            {provider.profile_photo ? (
              <img
                src={provider.profile_photo}
                alt=""
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-xl font-bold text-indigo-700">
                {(provider.full_name || "P").charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {provider.full_name || "Unnamed provider"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {provider.hasProfile
                  ? "Provider profile available"
                  : "Provider has not created a profile"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {details.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="mb-2 flex items-center gap-2 text-gray-500">
                  <Icon size={16} />
                  <span className="text-sm">{label}</span>
                </div>
                <p className="break-words font-medium text-gray-900">
                  {value || "Not provided"}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-700">
              About the provider
            </h4>
            <p className="whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
              {provider.bio || "No provider bio available."}
            </p>
          </div>

          {!provider.hasProfile && (
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
              This provider has registered but has no provider profile yet.
              Profile-completion reminders can be added later.
            </div>
          )}

          {provider.status === "pending" && provider.hasProfile && (
            <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                disabled={busy}
                onClick={() => onVerify(provider, "rejected")}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => onVerify(provider, "approved")}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                Approve Provider
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}