
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  MessageSquareWarning,
  Star,
  ChevronRight,
} from "lucide-react";

const pendingItems = [
  {
    title: "Provider Verification",
    count: 48,
    icon: ShieldCheck,
    path: "/admin/providers",
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Open Complaints",
    count: 23,
    icon: MessageSquareWarning,
    path: "/admin/complaints",
    color: "bg-rose-100 text-rose-600",
  },
  {
    title: "Reviews to Moderate",
    count: 12,
    icon: Star,
    path: "/admin/reviews",
    color: "bg-violet-100 text-violet-600",
  },
];

export default function PendingProvider() {
  const navigate = useNavigate();

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold text-slate-900">Pending Actions</h2>

      <div className="space-y-3">
        {pendingItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left hover:bg-slate-50"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                <Icon size={19} />
              </div>

              <span className="flex-1 text-sm font-medium text-slate-700">
                {item.title}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {item.count}
              </span>

              <ChevronRight size={16} className="text-slate-400" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
