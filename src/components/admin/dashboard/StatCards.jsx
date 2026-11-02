
import {
  Users,
  BriefcaseBusiness,
  CalendarCheck,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total Customers",
    value: "1,248",
    change: "+12%",
    icon: Users,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "Total Providers",
    value: "862",
    change: "+8%",
    icon: BriefcaseBusiness,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Total Bookings",
    value: "2,496",
    change: "+15%",
    icon: CalendarCheck,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Pending Verifications",
    value: "48",
    change: "Requires attention",
    icon: ShieldCheck,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Open Complaints",
    value: "23",
    change: "Requires attention",
    icon: AlertTriangle,
    color: "bg-rose-100 text-rose-600",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon size={22} />
              </div>

              {item.change.startsWith("+") && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <TrendingUp size={14} />
                  {item.change}
                </span>
              )}
            </div>

            <p className="mt-4 text-sm text-slate-500">
              {item.title}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {item.value}
            </h2>

            {!item.change.startsWith("+") && (
              <p className="mt-2 text-xs text-amber-600">
                {item.change}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
