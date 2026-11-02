
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const bookings = [
  { id: "BK1024", service: "AC Repair", customer: "Riya Sharma", provider: "CoolTech Services", status: "In Progress", date: "27 Oct, 10:00 AM" },
  { id: "BK1023", service: "Plumbing", customer: "Anoop Nair", provider: "QuickFix Plumbers", status: "Confirmed", date: "27 Oct, 11:30 AM" },
  { id: "BK1022", service: "Electrical", customer: "Sneha R", provider: "Bright Electric", status: "Completed", date: "26 Oct, 04:15 PM" },
  { id: "BK1021", service: "Cleaning", customer: "Fathima K", provider: "CleanPro Services", status: "Pending", date: "26 Oct, 02:00 PM" },
  { id: "BK1020", service: "Carpentry", customer: "Vijay Kumar", provider: "WoodWorks", status: "Cancelled", date: "25 Oct, 05:20 PM" },
];

const statusStyles = {
  "In Progress": "bg-blue-50 text-blue-700",
  Confirmed: "bg-emerald-50 text-emerald-700",
  Completed: "bg-violet-50 text-violet-700",
  Pending: "bg-amber-50 text-amber-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

function BookingChart() {
  const values = [110, 145, 205, 275, 355, 440];
  const points = values.map((value, index) => ({
    x: 25 + index * 63,
    y: 145 - (value / 500) * 125,
  }));
  const line = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div>
      <svg viewBox="0 0 350 185" className="w-full" role="img" aria-label="Sample monthly booking trend">
        {[0, 100, 200, 300, 400, 500].map((value) => {
          const y = 145 - (value / 500) * 125;

          return (
            <g key={value}>
              <line x1="25" y1={y} x2="340" y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
              <text x="20" y={y + 3} fontSize="9" textAnchor="end" fill="#94a3b8">{value}</text>
            </g>
          );
        })}

        <polygon points={`25,145 ${line} 340,145`} fill="#8b5cf6" opacity="0.12" />
        <polyline points={line} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinejoin="round" />

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#7c3aed" />
        ))}

        {["May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((month, i) => (
          <text key={month} x={points[i].x} y="166" textAnchor="middle" fontSize="10" fill="#64748b">
            {month}
          </text>
        ))}
      </svg>
      <p className="text-xs text-slate-400">Illustrative sample data</p>
    </div>
  );
}

function BookingTable() {
  const [search, setSearch] = useState("");

  const filtered = bookings.filter((booking) =>
    Object.values(booking).some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter bookings..."
        className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50 text-xs text-slate-500">
              <th className="px-3 py-3 font-medium">Booking ID</th>
              <th className="px-3 py-3 font-medium">Service</th>
              <th className="px-3 py-3 font-medium">Customer</th>
              <th className="px-3 py-3 font-medium">Provider</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filtered.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50">
                <td className="px-3 py-4 font-semibold text-violet-700">{booking.id}</td>
                <td className="px-3 py-4">{booking.service}</td>
                <td className="px-3 py-4">{booking.customer}</td>
                <td className="px-3 py-4">{booking.provider}</td>
                <td className="px-3 py-4">
                  <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[booking.status]}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-500">{booking.date}</td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function BookingOverview() {
  const navigate = useNavigate();

  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Bookings Overview</h2>
          <button onClick={() => navigate("/admin/analytics")} className="flex items-center gap-1 text-xs font-medium text-violet-600">
            Reports <ArrowUpRight size={14} />
          </button>
        </div>
        <BookingChart />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-900">Recent Bookings</h2>
          <span className="text-xs text-slate-500">Latest records</span>
        </div>
        <BookingTable />
      </div>
    </section>
  );
}
