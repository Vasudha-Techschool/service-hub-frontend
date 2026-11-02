import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import api from "../../api/axios";

const INITIAL_FORM = {
  problem_description: "",
  service_location: "",
};

const formatLocation = (properties = {}) => {
  const parts = [
    properties.name,
    properties.street,
    properties.district,
    properties.city,
    properties.state,
    properties.country,
  ].filter(Boolean);

  return [...new Set(parts)].join(", ");
};

const ProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Request modal and submission state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestMessageType, setRequestMessageType] = useState("error");
  const [requestSent, setRequestSent] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);

  // Photon location autocomplete state
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] =
    useState(false);
  const [selectedLocation, setSelectedLocation] = useState(false);
  const locationRequestRef = useRef(0);

  // Fetch provider details
  useEffect(() => {
    let isMounted = true;

    const fetchProviderDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/api/providers/${id}/profile/`);

        if (isMounted) {
          setProvider(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch provider details:", err);

        if (isMounted) {
          setError(
            err.response?.status === 404
              ? "Provider details could not be found."
              : "Unable to load provider details. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchProviderDetails();
    } else {
      setError("Provider ID is missing.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Check whether this customer already has an active request for this provider
  useEffect(() => {
    let isMounted = true;

    const checkRequestStatus = async () => {
      if (!provider?.id) return;

      try {
        const response = await api.get(
          `/api/services/providers/${provider.id}/service-request/`
        );

        if (isMounted) {
          setRequestSent(Boolean(response.data.has_active_request));
        }
      } catch (err) {
        console.error("Error checking request status:", err);
      }
    };

    checkRequestStatus();

    return () => {
      isMounted = false;
    };
  }, [provider?.id]);

  // Search locations with Photon.komoot after the customer types 3 characters.
  useEffect(() => {
    const query = form.service_location.trim();
    const requestId = ++locationRequestRef.current;

    if (selectedLocation || query.length < 3 || !showRequestModal) {
      setLocationSuggestions([]);
      setLocationLoading(false);
      setLocationError("");
      return undefined;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLocationLoading(true);
        setLocationError("");

        const url =
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}` +
          "&limit=5&lang=en&lat=10.0&lon=76.3&zoom=8";

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Location request failed");
        }

        const data = await response.json();

        if (requestId !== locationRequestRef.current) return;

        const suggestions = (data.features || [])
          .map((feature) => ({
            label: formatLocation(feature.properties),
          }))
          .filter((item) => item.label);

        setLocationSuggestions(suggestions);
      } catch (err) {
        if (
          err.name !== "AbortError" &&
          requestId === locationRequestRef.current
        ) {
          setLocationSuggestions([]);
          setLocationError("Unable to search locations. Please try again.");
        }
      } finally {
        if (requestId === locationRequestRef.current) {
          setLocationLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    form.service_location,
    selectedLocation,
    showRequestModal,
  ]);

  const openRequestModal = () => {
    setForm(INITIAL_FORM);
    setSelectedLocation(false);
    setLocationSuggestions([]);
    setLocationError("");
    setShowLocationSuggestions(false);
    setRequestMessage("");
    setShowRequestModal(true);
  };

  const closeRequestModal = () => {
    if (sendingRequest) return;

    setShowRequestModal(false);
    setShowLocationSuggestions(false);
    setRequestMessage("");
  };

  const handleSelectLocation = (location) => {
    setForm((current) => ({
      ...current,
      service_location: location,
    }));

    setSelectedLocation(true);
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
    setLocationError("");
  };

  const handleSubmitRequest = async (event) => {
    event.preventDefault();

    const problemDescription = form.problem_description.trim();
    const serviceLocation = form.service_location.trim();

    if (!problemDescription) {
      setRequestMessageType("error");
      setRequestMessage("Please describe the problem you are facing.");
      return;
    }

    if (!serviceLocation || !selectedLocation) {
      setRequestMessageType("error");
      setRequestMessage("Please select a service location from the suggestions.");
      return;
    }

    if (!provider?.id) {
      setRequestMessageType("error");
      setRequestMessage("Provider details are not available. Please try again.");
      return;
    }

    try {
      setSendingRequest(true);
      setRequestMessage("");

      // Customer ID is taken from the authenticated user on the backend.
      // ProviderProfile ID is passed in the URL.
      const response = await api.post(
        `/api/services/providers/${provider.id}/service-request/`,
        {
          problem_description: problemDescription,
          service_location: serviceLocation,
        }
      );

      if (response.status === 201) {
        setRequestSent(true);
        setShowRequestModal(false);
        setForm(INITIAL_FORM);
        setRequestMessageType("success");
        setRequestMessage(
          response.data.message || "Service request sent successfully."
        );
      } else if (response.data.has_active_request) {
        setRequestSent(true);
        setShowRequestModal(false);
        setRequestMessageType("success");
        setRequestMessage(
          response.data.message || "You already have an active request for this provider."
        );
      } else {
        setRequestMessageType("error");
        setRequestMessage(
          response.data.message || "The request could not be submitted."
        );
      }
    } catch (err) {
      setRequestMessageType("error");
      setRequestMessage(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Unable to send the request. Please try again."
      );
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
            <div className="flex items-center gap-5">
              <div className="h-24 w-24 rounded-2xl bg-slate-200" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-48 rounded bg-slate-200" />
                <div className="h-4 w-36 rounded bg-slate-200" />
              </div>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="h-24 rounded-xl bg-slate-100" />
              <div className="h-24 rounded-xl bg-slate-100" />
              <div className="h-24 rounded-xl bg-slate-100" />
              <div className="h-24 rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <UserRound size={26} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Unable to load profile
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error || "Provider details could not be found."}
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const user = provider.user || {};
  const providerName =
    provider.provider_name ||
    provider.full_name ||
    user.full_name ||
    user.username ||
    "Service Provider";

  const category =
    provider.service_category ||
    provider.services ||
    "General Services";

  const experience = provider.experience_years;
  const providerLocation =
    provider.service_location || provider.address;

  const isVerified =
    provider.verification_status === "approved" ||
    provider.verification_status === "verified";

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Navigation */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
        >
          <ArrowLeft
            size={18}
            className="transition group-hover:-translate-x-1"
          />
          Back to search results
        </button>

        {/* Provider profile header */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-2 bg-emerald-600" />

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {provider.profile_photo ? (
                <img
                  src={provider.profile_photo}
                  alt={providerName}
                  className="h-24 w-24 shrink-0 rounded-2xl border border-slate-200 object-cover sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-4xl font-semibold text-emerald-700 sm:h-28 sm:w-28">
                  {providerName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {providerName}
                  </h1>

                  {isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <ShieldCheck size={14} />
                      Verified
                    </span>
                  )}
                </div>

                <p className="mt-2 text-base font-medium text-emerald-700">
                  {category}
                </p>

                {providerLocation && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin
                      size={17}
                      className="shrink-0 text-slate-400"
                    />
                    {providerLocation}
                  </p>
                )}

                <p className="mt-4 text-sm text-slate-500">
                  Professional service provider on Service Hub
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[180px]">
                <button
                  type="button"
                  onClick={openRequestModal}
                  disabled={sendingRequest || requestSent}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {requestSent ? "Request Sent" : "Send Request"}
                </button>

                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <MessageCircle size={17} />
                  Chat
                </button>
              </div>
            </div>

            {requestMessage && !showRequestModal && (
              <p
                role="status"
                className={`mt-4 text-sm ${
                  requestMessageType === "success"
                    ? "text-emerald-700"
                    : "text-red-600"
                }`}
              >
                {requestMessage}
              </p>
            )}

            {/* Quick information */}
            <div className="mt-8 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <BriefcaseBusiness size={19} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Experience
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {experience != null
                      ? `${experience} years`
                      : "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <MapPin size={19} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">
                    Service Area
                  </p>
                  <p className="mt-1 truncate font-semibold text-slate-900">
                    {providerLocation || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 sm:col-span-2 lg:col-span-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                  <Wrench size={19} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Service Category
                  </p>
                  <p className="mt-1 font-semibold capitalize text-slate-900">
                    {category}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Provider details */}
        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <UserRound size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  About the Provider
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Professional background and introduction
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                {provider.bio ||
                  "This provider has not added a professional introduction yet."}
              </p>
            </div>

            <div className="mt-7 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="flex items-start gap-3">
                <Clock3
                  size={19}
                  className="mt-0.5 shrink-0 text-emerald-700"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Experience and expertise
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {experience != null
                      ? `${providerName} has ${experience} years of experience in ${String(
                          category
                        ).toLowerCase()}.`
                      : `Contact ${providerName} to learn more about their experience in ${String(
                          category
                        ).toLowerCase()}.`}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Phone size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Contact Information
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Provider contact details
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <ContactItem
                icon={<Phone size={17} />}
                label="Phone Number"
                value={provider.phone}
              />

              <ContactItem
                icon={<Mail size={17} />}
                label="Email Address"
                value={provider.email || user.email}
              />

              <ContactItem
                icon={<MapPin size={17} />}
                label="Service Location"
                value={providerLocation}
              />
            </div>

            <div className="mt-7 border-t border-slate-100 pt-5">
              <p className="text-xs leading-5 text-slate-500">
                Contact information is displayed according to the details
                shared by the service provider.
              </p>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              >
                <ArrowLeft size={16} />
                Return to Search
              </button>
            </div>
          </section>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Service Hub · Connecting you with local service professionals
        </p>
      </main>

      {/* Send service request modal */}
      {showRequestModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeRequestModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-modal-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2
                  id="request-modal-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Send Service Request
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Request a service from {providerName}
                </p>
              </div>

              <button
                type="button"
                onClick={closeRequestModal}
                disabled={sendingRequest}
                aria-label="Close request form"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-5 p-6">
              {/* Problem description */}
              <div>
                <label
                  htmlFor="problem_description"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Describe Your Problem
                </label>

                <textarea
                  id="problem_description"
                  name="problem_description"
                  value={form.problem_description}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      problem_description: event.target.value,
                    }));
                    setRequestMessage("");
                  }}
                  placeholder="Explain the problem you are facing..."
                  rows={4}
                  maxLength={2000}
                  required
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Service location with Photon autocomplete */}
              <div>
                <label
                  htmlFor="service_location"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Service Location / Address
                </label>

                <div className="relative">
                  <input
                    id="service_location"
                    name="service_location"
                    type="text"
                    value={form.service_location}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        service_location: event.target.value,
                      }));

                      setSelectedLocation(false);
                      setShowLocationSuggestions(true);
                      setRequestMessage("");
                    }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    onBlur={() => {
                      // Allow a suggestion click to run before hiding the list.
                      setTimeout(() => {
                        setShowLocationSuggestions(false);
                      }, 150);
                    }}
                    autoComplete="off"
                    placeholder="Search your area, city or address"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />

                  {showLocationSuggestions &&
                    form.service_location.trim().length >= 3 &&
                    !selectedLocation && (
                      <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                        {locationLoading && (
                          <p className="px-4 py-3 text-sm text-gray-500">
                            Searching locations...
                          </p>
                        )}

                        {!locationLoading &&
                          !locationError &&
                          locationSuggestions.length === 0 && (
                            <p className="px-4 py-3 text-sm text-gray-500">
                              No locations found.
                            </p>
                          )}

                        {locationError && (
                          <p className="px-4 py-3 text-sm text-red-600">
                            {locationError}
                          </p>
                        )}

                        {locationSuggestions.map((item, index) => (
                          <button
                            key={`${item.label}-${index}`}
                            type="button"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => handleSelectLocation(item.label)}
                            className="flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left text-sm text-gray-700 hover:bg-emerald-50"
                          >
                            <MapPin
                              size={17}
                              className="mt-0.5 shrink-0 text-emerald-600"
                            />
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Type at least 3 characters and select a location from the
                  suggestions.
                </p>

                {selectedLocation && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                    <ShieldCheck size={14} />
                    Location selected
                  </p>
                )}
              </div>

              {/* Form error */}
              {requestMessage && (
                <p
                  role="alert"
                  className={`rounded-lg px-3 py-2 text-sm ${
                    requestMessageType === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {requestMessage}
                </p>
              )}

              {/* Form actions */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={closeRequestModal}
                  disabled={sendingRequest}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={sendingRequest}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={16} />
                  {sendingRequest ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ContactItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

export default ProviderDetails;
