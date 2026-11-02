
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Star,
} from "lucide-react";

const stats = [
  {
    title: "Total Bookings",
    value: "12",
    icon: CalendarDays,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Pending",
    value: "03",
    icon: Clock,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Completed",
    value: "08",
    icon: CheckCircle2,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Reviews Given",
    value: "05",
    icon: Star,
    color: "bg-purple-50 text-purple-600",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {stat.title}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
              </div>

              <div className={`rounded-xl p-3 ${stat.color}`}>
                <Icon size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
