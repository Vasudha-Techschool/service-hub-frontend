
// import { useNavigate } from "react-router-dom";
// import { ArrowRight } from "lucide-react";

// const bookings = [
//   {
//     id: "SH-1001",
//     service: "AC Repair",
//     provider: "Service Provider",
//     date: "Sample date",
//     status: "Pending",
//   },
//   {
//     id: "SH-1002",
//     service: "Plumbing",
//     provider: "Service Provider",
//     date: "Sample date",
//     status: "Completed",
//   },
//   {
//     id: "SH-1003",
//     service: "Electrical Repair",
//     provider: "Service Provider",
//     date: "Sample date",
//     status: "In Progress",
//   },
// ];

// const statusStyles = {
//   Pending: "bg-amber-50 text-amber-700",
//   Completed: "bg-green-50 text-green-700",
//   "In Progress": "bg-blue-50 text-blue-700",
// };

// export default function RecentBookings() {
//   const navigate = useNavigate();

//   return (
//     <section className="rounded-xl border border-gray-200 bg-white">
//       <div className="flex items-center justify-between border-b border-gray-100 p-5">
//         <h2 className="font-semibold text-gray-900">
//           Recent Bookings
//         </h2>

//         <button
//           onClick={() => navigate("/customer/bookings")}
//           className="flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800"
//         >
//           View All <ArrowRight size={16} />
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[600px] text-left text-sm">
//           <thead className="bg-gray-50 text-gray-500">
//             <tr>
//               <th className="px-5 py-3 font-medium">Booking ID</th>
//               <th className="px-5 py-3 font-medium">Service</th>
//               <th className="px-5 py-3 font-medium">Date</th>
//               <th className="px-5 py-3 font-medium">Status</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-100">
//             {bookings.map((booking) => (
//               <tr key={booking.id}>
//                 <td className="px-5 py-4 font-medium text-gray-700">
//                   {booking.id}
//                 </td>
//                 <td className="px-5 py-4 text-gray-600">
//                   {booking.service}
//                 </td>
//                 <td className="px-5 py-4 text-gray-500">
//                   {booking.date}
//                 </td>
//                 <td className="px-5 py-4">
//                   <span
//                     className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
//                       statusStyles[booking.status] ||
//                       "bg-gray-100 text-gray-600"
//                     }`}
//                   >
//                     {booking.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// }




import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, RefreshCw } from "lucide-react";
import api from "../../../api/axios";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
  completed: "bg-blue-50 text-blue-700",
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function RecentBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecentBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/services/customers/service-requests/");

      // Supports both normal arrays and paginated DRF responses
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      // Latest requests first, display only 5
      const latestBookings = [...data]
        .sort(
          (a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        )
        .slice(0, 5);

      setBookings(latestBookings);
    } catch (err) {
      console.error("Error fetching recent bookings:", err);
      setError(
        err.response?.data?.detail ||
        "Unable to load recent bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900">
          Recent Bookings
        </h2>

        <button
          onClick={() => navigate("/customer/requests")}
          className="flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          View All <ArrowRight size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Booking ID</th>
              <th className="px-5 py-3 font-medium">Service</th>
              <th className="px-5 py-3 font-medium">Provider</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center text-gray-500">
                  <RefreshCw
                    size={18}
                    className="mx-auto mb-2 animate-spin"
                  />
                  Loading recent bookings...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center text-red-500">
                  {error}
                  <button
                    onClick={fetchRecentBookings}
                    className="ml-2 font-medium text-teal-700 hover:underline"
                  >
                    Retry
                  </button>
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center text-gray-500">
                  No service requests found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const status = booking.status?.toLowerCase();

                return (
                  <tr key={booking.id}>
                    <td className="px-5 py-4 font-medium text-gray-700">
                      SH-{String(booking.id).padStart(4, "0")}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {booking.service_category || "Service"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {booking.provider_name || "Service Provider"}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-gray-500">
                      {formatDate(booking.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {booking.status
                          ? booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)
                          : "Unknown"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
