import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CustomerSearch = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      if (!search.trim()) {
        setProviders([]);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/services/search/", {
          params: { q: search.trim() },
        });

        setProviders(response.data);
      } catch (err) {
        console.error("Service search failed:", err);
        setError("Unable to load service providers. Please try again.");
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        

        {loading && (
          <p className="mt-8 text-gray-600">
            Searching for providers...
          </p>
        )}

        {error && (
          <p className="mt-8 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && search.trim() && providers.length === 0 && (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-semibold text-gray-800">
              No providers found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Try another service or location.
            </p>
          </div>
        )}

        {!loading && !error && providers.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <article
                key={provider.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {provider.profile_photo ? (
                    <img
                      src={provider.profile_photo}
                      alt={provider.provider_name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-700">
                      {provider.provider_name?.charAt(0).toUpperCase() || "P"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-gray-800">
                      {provider.provider_name}
                    </h2>
                    <p className="text-sm capitalize text-green-700">
                      {provider.service_category}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {provider.service_location || "Not specified"}
                  </p>

                  <p>
                    <span className="font-medium">Experience:</span>{" "}
                    {provider.experience_years ?? 0} years
                  </p>

                  {provider.bio && (
                    <p className="line-clamp-2 leading-6 text-gray-500">
                      {provider.bio}
                    </p>
                  )}
                </div>

                {/* View More Button */}
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/customer/providers/${provider.id}`)
                  }
                  className="mt-5 w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  View More
                </button>
              </article>
            ))}
          </div>
        )}

       
      </div>
    </div>
  );
};

export default CustomerSearch;