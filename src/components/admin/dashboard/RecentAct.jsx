
import {
  Users,
  ShieldCheck,
  CalendarCheck,
  MessageSquareWarning,
  Star,
  Clock,
} from "lucide-react";

const activities = [
  {
    title: "New customer registered",
    detail: "Riya Sharma",
    time: "10 mins ago",
    icon: Users,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "Provider verification pending",
    detail: "Karthik Plumbing Services",
    time: "25 mins ago",
    icon: ShieldCheck,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "New booking created",
    detail: "AC Repair · BK1024",
    time: "42 mins ago",
    icon: CalendarCheck,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Complaint received",
    detail: "Service quality issue",
    time: "1 hour ago",
    icon: MessageSquareWarning,
    color: "bg-rose-100 text-rose-600",
  },
  {
    title: "New review submitted",
    detail: "Electrical service · 4 stars",
    time: "2 hours ago",
    icon: Star,
    color: "bg-amber-100 text-amber-600",
  },
];

export default function RecentAct() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold text-slate-900">Recent Activity</h2>

      <div className="divide-y divide-slate-100">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div key={activity.title} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activity.color}`}>
                <Icon size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800">
                  {activity.title}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {activity.detail}
                </p>
                <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} /> {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
