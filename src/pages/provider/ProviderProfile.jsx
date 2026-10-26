import { useEffect, useState } from "react";
import api from "../../api/axios"; // Change to your existing Axios instance

const initialForm = {
  phone: "",
  bio: "",
  experience_years: 0,
  service_location: "",
};

export default function ProviderProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState("view");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load the logged-in provider's profile
  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "/api/providers/me/profile/"
      );

      setProfile(response.data);
      setMode("view");
    } catch (err) {
      if (err.response?.status === 404) {
        // A 404 means this provider has not created a profile.
        setProfile(null);
        setMode("view");
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to load your profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "experience_years" ? Number(value) : value,
    }));
  };

  // Step 1: Request OTP before creating a profile
  const handleSendOTP = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post(
        "/api/providers/profile/",
        form
      );

      setMessage(
        response.data?.detail || "OTP sent successfully."
      );
      setMode("otp");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not send OTP. Please check your details."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Verify OTP; your existing backend creates the profile
  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post(
        "/api/providers/phone/verify-otp/",
        { otp }
      );

      setMessage(
        response.data?.detail || "Profile created successfully."
      );

      // Fetch the newly created profile
      await loadProfile();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-600">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800">
        My Profile
      </h1>

      <p className="mt-2 text-gray-500">
        View and manage your provider information.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {message && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      {/* Existing profile */}
      {profile && mode === "view" && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-700">
              {profile.full_name?.charAt(0)?.toUpperCase() || "P"}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {profile.full_name}
              </h2>
              <p className="text-sm text-gray-500">
                {profile.email}
              </p>
              <p className="mt-1 text-sm text-teal-700">
                Verification: {profile.verification_status}
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField label="Phone" value={profile.phone} />
            <ProfileField
              label="Service Location"
              value={profile.service_location}
            />
            <ProfileField
              label="Experience"
              value={`${profile.experience_years ?? 0} years`}
            />
            <ProfileField label="About" value={profile.bio} />
          </div>
        </div>
      )}

      {/* No profile found */}
      {!profile && mode === "view" && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            Your provider profile is not created yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Create your profile to add your contact details,
            experience and service location.
          </p>

          <button
            type="button"
            onClick={() => {
              setError("");
              setMessage("");
              setMode("create");
            }}
            className="mt-5 rounded-lg bg-teal-700 px-5 py-3 font-medium text-white hover:bg-teal-800"
          >
            Create Profile
          </button>
        </div>
      )}

      {/* Profile creation form */}
      {!profile && mode === "create" && (
        <form
          onSubmit={handleSendOTP}
          className="mt-6 space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800">
            Create Provider Profile
          </h2>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              inputMode="numeric"
              maxLength={15}
              placeholder="Enter your phone number"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Service Location / Address
            </label>
            <input
              name="service_location"
              value={form.service_location}
              onChange={handleChange}
              placeholder="Enter your service area or address"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Years of Experience
            </label>
            <input
              type="number"
              name="experience_years"
              value={form.experience_years}
              onChange={handleChange}
              min="0"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              About You
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Describe your experience and services"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-teal-700 px-5 py-3 font-medium text-white disabled:opacity-50"
            >
              {submitting ? "Sending OTP..." : "Send OTP"}
            </button>

            <button
              type="button"
              onClick={() => setMode("view")}
              className="rounded-lg border border-gray-300 px-5 py-3 text-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* OTP verification form */}
      {!profile && mode === "otp" && (
        <form
          onSubmit={handleVerifyOTP}
          className="mt-6 space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800">
            Verify OTP
          </h2>

          <p className="text-sm text-gray-500">
            Enter the six-digit OTP sent to your registered email.
          </p>

          <input
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
            minLength={6}
            maxLength={6}
            inputMode="numeric"
            placeholder="Enter 6-digit OTP"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
          />

          <button
            type="submit"
            disabled={submitting || otp.length !== 6}
            className="rounded-lg bg-teal-700 px-5 py-3 font-medium text-white disabled:opacity-50"
          >
            {submitting ? "Verifying..." : "Verify OTP & Create Profile"}
          </button>
        </form>
      )}
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap font-medium text-gray-800">
        {value || "Not provided"}
      </p>
    </div>
  );
}