
// import { useEffect, useRef, useState } from "react";
// import api from "../../api/axios";

// const initialForm = {
//   phone: "",
//   bio: "",
//   service_category: "",
//   experience_years: 0,
//   service_location: "",
// };

// const formatLocation = (properties) => {
//   const parts = [
//     properties.name,
//     properties.street,
//     properties.locality,
//     properties.district,
//     properties.city,
//     properties.county,
//     properties.state,
//     properties.country,
//   ];

//   return [...new Set(parts.filter(Boolean))].join(", ");
// };

// export default function ProviderProfile() {
//   const [profile, setProfile] = useState(null);
//   const [form, setForm] = useState(initialForm);
//   const [otp, setOtp] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [mode, setMode] = useState("view");

//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   // Location autocomplete state
//   const [locationSuggestions, setLocationSuggestions] = useState([]);
//   const [locationLoading, setLocationLoading] = useState(false);
//   const [showLocationSuggestions, setShowLocationSuggestions] =
//     useState(false);
//   const [locationError, setLocationError] = useState("");

//   const locationRequestRef = useRef(0);

//   // Fetch locations from Photon
//   useEffect(() => {
//     const query = form.service_location.trim();
//     const requestId = ++locationRequestRef.current;
//     let controller;

//     if (query.length < 3) {
//       setLocationSuggestions([]);
//       setLocationLoading(false);
//       setLocationError("");
//       return;
//     }

//     const timer = setTimeout(async () => {
//       controller = new AbortController();

//       try {
//         setLocationLoading(true);
//         setLocationError("");

//         const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
//           query
//         )}&limit=5&lang=en&lat=10.0&lon=76.3&zoom=8`;

//         const response = await fetch(url, {
//           signal: controller.signal,
//         });

//         if (!response.ok) {
//           throw new Error(`Location request failed: ${response.status}`);
//         }

//         const data = await response.json();

//         if (requestId !== locationRequestRef.current) {
//           return;
//         }

//         const suggestions = (data.features || [])
//           .map((feature) => ({
//             label: formatLocation(feature.properties),
//             coordinates: feature.geometry.coordinates,
//           }))
//           .filter((item) => item.label);

//         setLocationSuggestions(suggestions);
//       } catch (err) {
//         if (
//           err.name !== "AbortError" &&
//           requestId === locationRequestRef.current
//         ) {
//           console.error("Photon autocomplete failed:", err);
//           setLocationSuggestions([]);
//           setLocationError("Unable to search locations. Please try again.");
//         }
//       } finally {
//         if (requestId === locationRequestRef.current) {
//           setLocationLoading(false);
//         }
//       }
//     }, 400);

//     return () => {
//       clearTimeout(timer);
//       controller?.abort();
//     };
//   }, [form.service_location]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setForm((previous) => ({
//       ...previous,
//       [name]:
//         name === "experience_years" ? Number(value) : value,
//     }));
//   };

//   const selectLocation = (location) => {
//     setForm((previous) => ({
//       ...previous,
//       service_location: location,
//     }));

//     setLocationSuggestions([]);
//     setShowLocationSuggestions(false);
//     setLocationError("");
//   };

//   // Load the logged-in provider's profile
//   const loadProfile = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const response = await api.get("/api/providers/me/profile/");

//       setProfile(response.data);
//       setMode("view");
//     } catch (err) {
//       if (err.response?.status === 404) {
//         setProfile(null);
//         setMode("view");
//       } else {
//         setError(
//           err.response?.data?.detail ||
//             "Unable to load your profile."
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   // Step 1: Request OTP
//   const handleSendOTP = async (event) => {
//     event.preventDefault();
//     setSubmitting(true);
//     setError("");
//     setMessage("");

//     try {
//       const response = await api.post(
//         "/api/providers/profile/",
//         form
//       );

//       setMessage(
//         response.data?.detail || "OTP sent successfully."
//       );

//       setShowLocationSuggestions(false);
//       setMode("otp");
//     } catch (err) {
//       setError(
//         err.response?.data?.detail ||
//           "Could not send OTP. Please check your details."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Step 2: Verify OTP
//   const handleVerifyOTP = async (event) => {
//     event.preventDefault();
//     setSubmitting(true);
//     setError("");
//     setMessage("");

//     try {
//       const response = await api.post(
//         "/api/providers/phone/verify-otp/",
//         { otp }
//       );

//       setMessage(
//         response.data?.detail || "Profile created successfully."
//       );

//       await loadProfile();
//     } catch (err) {
//       setError(
//         err.response?.data?.detail ||
//           "OTP verification failed. Please try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 text-gray-600">
//         Loading your profile...
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-3xl">
//       <h1 className="text-2xl font-bold text-gray-800">
//         My Profile
//       </h1>

//       <p className="mt-2 text-gray-500">
//         View and manage your provider information.
//       </p>

//       {error && (
//         <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
//           {error}
//         </p>
//       )}

//       {message && (
//         <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
//           {message}
//         </p>
//       )}

//       {/* Existing profile */}
//       {profile && mode === "view" && (
//         <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//           <div className="mb-6 flex items-center gap-4">
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-700">
//               {profile.full_name?.charAt(0)?.toUpperCase() || "P"}
//             </div>

//             <div>
//               <h2 className="text-xl font-semibold text-gray-800">
//                 {profile.full_name}
//               </h2>
//               <p className="text-sm text-gray-500">
//                 {profile.email}
//               </p>
//               <p className="mt-1 text-sm text-teal-700">
//                 Verification: {profile.verification_status}
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-5 sm:grid-cols-2">
//             <ProfileField
//               label="Phone"
//               value={profile.phone}
//             />
//             <ProfileField
//               label="Service Category"
//               value={profile.service_category}
//             />
//             <ProfileField
//               label="Service Location"
//               value={profile.service_location}
//             />
//             <ProfileField
//               label="Years of Experience"
//               value={profile.experience_years}
//             />
//             <div className="sm:col-span-2">
//               <ProfileField
//                 label="About You"
//                 value={profile.bio}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* No profile found */}
//       {!profile && mode === "view" && (
//         <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Your provider profile is not created yet
//           </h2>

//           <p className="mt-2 text-sm text-gray-500">
//             Create your profile to add your contact details,
//             services, experience and service location.
//           </p>

//           <button
//             type="button"
//             onClick={() => {
//               setError("");
//               setMessage("");
//               setForm(initialForm);
//               setMode("create");
//             }}
//             className="mt-5 rounded-lg bg-teal-700 px-5 py-3 font-medium text-white hover:bg-teal-800"
//           >
//             Create Profile
//           </button>
//         </div>
//       )}

//       {/* Profile creation form */}
//       {!profile && mode === "create" && (
//         <form
//           onSubmit={handleSendOTP}
//           className="mt-6 space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
//         >
//           <h2 className="text-lg font-semibold text-gray-800">
//             Create Provider Profile
//           </h2>

//           {/* Phone */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Phone Number
//             </label>
//             <input
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//               required
//               inputMode="numeric"
//               maxLength={15}
//               placeholder="Enter your phone number"
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
//             />
//           </div>

//           {/* Service category */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Service Category
//             </label>
//             <input
//               name="service_category"
//               value={form.service_category}
//               onChange={handleChange}
//               required
//               placeholder="e.g. Plumbing, Electrical, Cleaning"
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
//             />
//           </div>

//           {/* Service location with autocomplete */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Service Location / Address
//             </label>

//             <div className="relative">
//               <input
//                 name="service_location"
//                 value={form.service_location}
//                 onChange={(event) => {
//                   handleChange(event);
//                   setShowLocationSuggestions(true);
//                 }}
//                 onFocus={() => setShowLocationSuggestions(true)}
//                 onBlur={() => {
//                   // Allow suggestion button click to register first.
//                   setTimeout(() => {
//                     setShowLocationSuggestions(false);
//                   }, 150);
//                 }}
//                 autoComplete="off"
//                 placeholder="Start typing your area, city or address"
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
//               />

//               {showLocationSuggestions &&
//                 form.service_location.trim().length >= 3 && (
//                   <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
//                     {locationLoading && (
//                       <p className="px-4 py-3 text-sm text-gray-500">
//                         Searching locations...
//                       </p>
//                     )}

//                     {!locationLoading &&
//                       !locationError &&
//                       locationSuggestions.length === 0 && (
//                         <p className="px-4 py-3 text-sm text-gray-500">
//                           No locations found.
//                         </p>
//                       )}

//                     {locationError && (
//                       <p className="px-4 py-3 text-sm text-red-600">
//                         {locationError}
//                       </p>
//                     )}

//                     {locationSuggestions.map((item, index) => (
//                       <button
//                         key={`${item.label}-${index}`}
//                         type="button"
//                         onMouseDown={(event) => event.preventDefault()}
//                         onClick={() => selectLocation(item.label)}
//                         className="block w-full border-b border-gray-100 px-4 py-3 text-left text-sm text-gray-700 hover:bg-teal-50"
//                       >
//                         {item.label}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//             </div>

//             <p className="mt-1 text-xs text-gray-500">
//               Select a suggested location or enter your address manually.
//             </p>
//           </div>

//           {/* Experience */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Years of Experience
//             </label>
//             <input
//               type="number"
//               name="experience_years"
//               value={form.experience_years}
//               onChange={handleChange}
//               min="0"
//               required
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
//             />
//           </div>

//           {/* About */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               About You
//             </label>
//             <textarea
//               name="bio"
//               value={form.bio}
//               onChange={handleChange}
//               rows={4}
//               placeholder="Describe your experience and services"
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
//             />
//           </div>

//           {/* Actions */}
//           <div className="flex flex-wrap gap-3">
//             <button
//               type="submit"
//               disabled={submitting}
//               className="rounded-lg bg-teal-700 px-5 py-3 font-medium text-white hover:bg-teal-800 disabled:opacity-50"
//             >
//               {submitting ? "Sending OTP..." : "Send OTP"}
//             </button>

//             <button
//               type="button"
//               onClick={() => {
//                 setShowLocationSuggestions(false);
//                 setMode("view");
//               }}
//               className="rounded-lg border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}

//       {/* OTP verification form */}
//       {!profile && mode === "otp" && (
//         <form
//           onSubmit={handleVerifyOTP}
//           className="mt-6 space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
//         >
//           <h2 className="text-lg font-semibold text-gray-800">
//             Verify OTP
//           </h2>

//           <p className="text-sm text-gray-500">
//             Enter the six-digit OTP sent to your registered email.
//           </p>

//           <input
//             value={otp}
//             onChange={(event) =>
//               setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
//             }
//             required
//             minLength={6}
//             maxLength={6}
//             inputMode="numeric"
//             placeholder="Enter 6-digit OTP"
//             className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
//           />

//           <button
//             type="submit"
//             disabled={submitting || otp.length !== 6}
//             className="rounded-lg bg-teal-700 px-5 py-3 font-medium text-white hover:bg-teal-800 disabled:opacity-50"
//           >
//             {submitting
//               ? "Verifying..."
//               : "Verify OTP & Create Profile"}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }

// function ProfileField({ label, value }) {
//   return (
//     <div>
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className="mt-1 whitespace-pre-wrap font-medium text-gray-800">
//         {value ?? "Not provided"}
//       </p>
//     </div>
//   );
// }





import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";

const initialForm = {
  phone: "",
  bio: "",
  service_category: "",
  experience_years: 0,
  service_location: "",
};

const formatLocation = (properties) => {
  const parts = [
    properties.name,
    properties.street,
    properties.locality,
    properties.district,
    properties.city,
    properties.county,
    properties.state,
    properties.country,
  ];

  return [...new Set(parts.filter(Boolean))].join(", ");
};

export default function ProviderProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState("view");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] =
    useState(false);
  const [locationError, setLocationError] = useState("");

  const locationRequestRef = useRef(0);

  // Location autocomplete
  useEffect(() => {
    const query = form.service_location.trim();
    const requestId = ++locationRequestRef.current;
    let controller;

    if (query.length < 3) {
      setLocationSuggestions([]);
      setLocationLoading(false);
      setLocationError("");
      return;
    }

    const timer = setTimeout(async () => {
      controller = new AbortController();

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

        setLocationSuggestions(
          (data.features || [])
            .map((feature) => ({
              label: formatLocation(feature.properties),
            }))
            .filter((item) => item.label)
        );
      } catch (err) {
        if (
          err.name !== "AbortError" &&
          requestId === locationRequestRef.current
        ) {
          setLocationSuggestions([]);
          setLocationError("Unable to search locations.");
        }
      } finally {
        if (requestId === locationRequestRef.current) {
          setLocationLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller?.abort();
    };
  }, [form.service_location]);

  // Clean up local photo preview URLs
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "experience_years" ? Number(value) : value,
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photo must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setProfilePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const selectLocation = (location) => {
    setForm((previous) => ({
      ...previous,
      service_location: location,
    }));

    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
    setLocationError("");
  };

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/providers/me/profile/");
      setProfile(response.data);
      setMode("view");
    } catch (err) {
      if (err.response?.status === 404) {
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

  const startCreate = () => {
    setForm(initialForm);
    setProfilePhoto(null);
    setPhotoPreview("");
    setOtp("");
    setError("");
    setMessage("");
    setMode("create");
  };

  const startEdit = () => {
    setForm({
      phone: profile.phone || "",
      bio: profile.bio || "",
      service_category: profile.service_category || "",
      experience_years: profile.experience_years ?? 0,
      service_location: profile.service_location || "",
    });

    setProfilePhoto(null);
    setPhotoPreview("");
    setError("");
    setMessage("");
    setMode("edit");
  };

  // Create profile: send details and request OTP
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

      setShowLocationSuggestions(false);
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

  // Save a photo after the profile is created
  const uploadCreatedProfilePhoto = async () => {
    if (!profilePhoto) return;

    const data = new FormData();
    data.append("profile_photo", profilePhoto);

    await api.patch(
      "/api/providers/me/profile/update/",
      data
    );
  };

  // Verify OTP, create profile, then optionally upload photo
  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await api.post(
        "/api/providers/phone/verify-otp/",
        { otp }
      );

      if (profilePhoto) {
        try {
          await uploadCreatedProfilePhoto();
        } catch (photoError) {
          await loadProfile();
          setError(
            "Your profile was created, but the photo upload failed. " +
              "Please edit your profile and upload the photo again."
          );
          return;
        }
      }

      setMessage("Profile created successfully.");
      setProfilePhoto(null);
      setPhotoPreview("");
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

  // Update existing profile and optionally its photo
  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      // Update text fields
      await api.patch(
        "/api/providers/me/profile/update/",
        form
      );

      // Upload the image separately as multipart/form-data
      if (profilePhoto) {
        const data = new FormData();
        data.append("profile_photo", profilePhoto);

        await api.patch(
          "/api/providers/me/profile/update/",
          data
        );
      }

      setMessage("Profile updated successfully.");
      setProfilePhoto(null);
      setPhotoPreview("");
      await loadProfile();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to update your profile."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const cancelForm = () => {
    setError("");
    setMessage("");
    setShowLocationSuggestions(false);
    setProfilePhoto(null);
    setPhotoPreview("");
    setMode("view");
  };

  if (loading) {
    return <div className="p-6 text-gray-600">Loading your profile...</div>;
  }

  const displayedPhoto =
    photoPreview || profile?.profile_photo || "";

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

      {/* Existing profile view */}
      {profile && mode === "view" && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            {displayedPhoto ? (
              <img
                src={displayedPhoto}
                alt="Provider profile"
                className="h-16 w-16 rounded-full border object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-700">
                {profile.full_name?.charAt(0)?.toUpperCase() || "P"}
              </div>
            )}

            <div className="min-w-0 flex-1">
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

            <button
              type="button"
              onClick={startEdit}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              Edit Profile
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField label="Phone" value={profile.phone} />
            <ProfileField
              label="Service Category"
              value={profile.service_category}
            />
            <ProfileField
              label="Service Location"
              value={profile.service_location}
            />
            <ProfileField
              label="Years of Experience"
              value={profile.experience_years}
            />
            <div className="sm:col-span-2">
              <ProfileField label="About You" value={profile.bio} />
            </div>
          </div>
        </div>
      )}

      {/* No profile */}
      {!profile && mode === "view" && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            Your provider profile is not created yet
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Create your profile to add your contact details,
            services, experience and service location.
          </p>
          <button
            type="button"
            onClick={startCreate}
            className="mt-5 rounded-lg bg-teal-700 px-5 py-3 font-medium text-white hover:bg-teal-800"
          >
            Create Profile
          </button>
        </div>
      )}

      {/* Shared create/edit form */}
      {(mode === "create" || mode === "edit") && (
        <form
          onSubmit={
            mode === "create"
              ? handleSendOTP
              : handleUpdateProfile
          }
          className="mt-6 space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800">
            {mode === "create"
              ? "Create Provider Profile"
              : "Edit Provider Profile"}
          </h2>

          {/* Profile photo */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Profile Photo
            </label>

            {displayedPhoto && (
              <img
                src={displayedPhoto}
                alt="Selected profile"
                className="mb-3 h-20 w-20 rounded-full border object-cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:font-medium file:text-teal-700 hover:file:bg-teal-100"
            />

            <p className="mt-1 text-xs text-gray-500">
              Optional. Image files only, maximum 5 MB.
              {mode === "edit" &&
                " Leave empty to keep your current photo."}
            </p>
          </div>

          <FormInput
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
          />

          <FormInput
            label="Service Category"
            name="service_category"
            value={form.service_category}
            onChange={handleChange}
            required
            placeholder="e.g. Plumbing, Electrical, Cleaning"
          />

          {/* Location autocomplete */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Service Location / Address
            </label>

            <div className="relative">
              <input
                name="service_location"
                value={form.service_location}
                onChange={(event) => {
                  handleChange(event);
                  setShowLocationSuggestions(true);
                }}
                onFocus={() => setShowLocationSuggestions(true)}
                onBlur={() => {
                  setTimeout(
                    () => setShowLocationSuggestions(false),
                    150
                  );
                }}
                autoComplete="off"
                placeholder="Start typing your area, city or address"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
              />

              {showLocationSuggestions &&
                form.service_location.trim().length >= 3 && (
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
                        onMouseDown={(event) =>
                          event.preventDefault()
                        }
                        onClick={() => selectLocation(item.label)}
                        className="block w-full border-b border-gray-100 px-4 py-3 text-left text-sm text-gray-700 hover:bg-teal-50"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Select a suggestion or enter your address manually.
            </p>
          </div>

          <FormInput
            label="Years of Experience"
            name="experience_years"
            type="number"
            value={form.experience_years}
            onChange={handleChange}
            min="0"
            required
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              About You
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your experience and services"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-teal-700 px-5 py-3 font-medium text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {submitting
                ? mode === "create"
                  ? "Sending OTP..."
                  : "Saving..."
                : mode === "create"
                  ? "Send OTP"
                  : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={cancelForm}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* OTP verification */}
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
            className="rounded-lg bg-teal-700 px-5 py-3 font-medium text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {submitting ? "Verifying..." : "Verify OTP & Create Profile"}
          </button>
        </form>
      )}
    </div>
  );
}

function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  ...props
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        {...props}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
      />
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap font-medium text-gray-800">
        {value ?? "Not provided"}
      </p>
    </div>
  );
}
