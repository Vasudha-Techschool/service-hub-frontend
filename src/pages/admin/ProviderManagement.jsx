import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Users } from "lucide-react";

import api from "../../api/axios";
import AdminSidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";

import ProviderStats from "../../components/admin/provider/ProviderStats";
import ProviderFilters from "../../components/admin/provider/ProviderFilters";
import ProviderTable from "../../components/admin/provider/ProviderTable";
import ProviderDetailsModal from "../../components/admin/provider/ProviderDetailsModal";

function getRows(response) {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.providers)) return data.providers;

  return [];
}
// normalizeProvider() to convert API data into a consistent format that your React components can use easily

function normalizeProvider(item) {
  const hasProfile = item.has_profile ?? item.hasProfile ?? true;

  return {
    id: item.id,
    user_id: item.user_id,
    full_name: item.full_name || "",
    email: item.email || "",
    phone: item.phone || "",
    bio: item.bio || "",
    service_category: item.service_category || "",
    experience_years: item.experience_years ?? 0,
    service_location: item.service_location || "",
    profile_photo: item.profile_photo || "",
    hasProfile,
    status: hasProfile
      ? item.verification_status || "pending"
      : "incomplete",
  };
}

function uniqueProviders(items) {
  const map = new Map();

  for (const provider of items) {
    // Prefer user ID for identity, since a User and ProviderProfile
    // may have different database IDs.
    const key = provider.userId ?? provider.id;
    if (key == null) continue;

    const existing = map.get(String(key));

    // Prefer the entry that has the actual profile information.
    if (!existing || (!existing.hasProfile && provider.hasProfile)) {
      map.set(String(key), provider);
    }
  }

  return Array.from(map.values());
}

export default function ProviderManagement() {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProviders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [allResult, pendingResult] = await Promise.allSettled([
  api.get("/api/providers/"),
  api.get("/api/admin/providers/pending/"),
]);

console.log("All providers result:", allResult);
console.log("Pending providers result:", pendingResult);

      if (allResult.status === "rejected" &&
          pendingResult.status === "rejected") {
        throw allResult.reason;
      }

      const allRows =
        allResult.status === "fulfilled"
          ? getRows(allResult.value)
          : [];

      const pendingRows =
        pendingResult.status === "fulfilled"
          ? getRows(pendingResult.value)
          : [];

      const normalized = uniqueProviders(
        [...allRows, ...pendingRows].map(normalizeProvider)
      );

      setProviders(normalized);

      if (
        allResult.status === "rejected" ||
        pendingResult.status === "rejected"
      ) {
        setError(
          "Some provider data could not be loaded. Check the API permissions and try refreshing."
        );
      }
    } catch (err) {
      console.error("Failed to load providers:", err);
      setError(
        err?.response?.data?.detail ||
          "Unable to load providers. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  const stats = useMemo(() => {
    return {
      total: providers.length,
      pending: providers.filter((p) => p.status === "pending").length,
      approved: providers.filter((p) => p.status === "approved").length,
      rejected: providers.filter((p) => p.status === "rejected").length,
      incomplete: providers.filter((p) => p.status === "incomplete").length,
    };
  }, [providers]);

  const filteredProviders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return providers.filter((provider) => {
      const matchesStatus =
        status === "all" || provider.status === status;

      const searchableText = [
        provider.full_name,
        provider.email,
        provider.phone,
        provider.service_category,
        provider.service_location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(query);
    });
  }, [providers, search, status]);

  const handleVerification = async (provider, nextStatus) => {
    if (!provider?.id || !["approved", "rejected"].includes(nextStatus)) {
      setError("Provider ID or verification status is missing.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to ${nextStatus === "approved" ? "approve" : "reject"} this provider?`
      )
    ) {
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");

    try {
      
      await api.patch(
        `/api/admin/providers/${provider.id}/verification/`,
        { verification_status: nextStatus }
      );

      setProviders((current) =>
        current.map((item) =>
          item.id === provider.id
            ? { ...item, status: nextStatus }
            : item
        )
      );

      setSelectedProvider((current) =>
        current?.id === provider.id
          ? { ...current, status: nextStatus }
          : current
      );

      setNotice(
        `Provider ${nextStatus === "approved" ? "approved" : "rejected"} successfully.`
      );

      // Reload to ensure the displayed data matches the server.
      await loadProviders();
    } catch (err) {
      console.error("Provider verification failed:", err);
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Verification update failed. Check your API request and permissions."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="space-y-6 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
             

              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Provider Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Review verification requests and manage registered providers.
              </p>
            </div>

            <button
              type="button"
              onClick={loadProviders}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                className="font-semibold underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            >
              {notice}
            </div>
          )}

          <ProviderStats stats={stats} />

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="space-y-4 border-b border-gray-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Registered Providers
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredProviders.length} provider
                  {filteredProviders.length === 1 ? "" : "s"} displayed
                </p>
              </div>

              <ProviderFilters
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
              />
            </div>

            <ProviderTable
              providers={filteredProviders}
              loading={loading}
              onView={setSelectedProvider}
              onVerify={handleVerification}
            />
          </section>
        </main>
      </div>

      <ProviderDetailsModal
        provider={selectedProvider}
        onClose={() => setSelectedProvider(null)}
        onVerify={handleVerification}
        busy={busy}
      />
    </div>
  );
}