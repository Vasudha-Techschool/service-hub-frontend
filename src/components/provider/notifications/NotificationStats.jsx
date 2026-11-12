
import { Bell, CheckCheck, Inbox } from "lucide-react";

export default function NotificationStats({
  total,
  unread,
  read,
}) {
  const stats = [
    {
      label: "Total Notifications",
      count: total,
      icon: Bell,
      iconColor: "text-violet-600",
    },
    {
      label: "Unread",
      count: unread,
      icon: Inbox,
      iconColor: "text-rose-500",
    },
    {
      label: "Read",
      count: read,
      icon: CheckCheck,
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                {stat.label}
              </p>
              <Icon className={stat.iconColor} size={21} />
            </div>

            <h2 className="mt-3 text-2xl font-bold text-slate-800">
              {stat.count}
            </h2>
          </div>
        );
      })}
    </div>
  );
}
