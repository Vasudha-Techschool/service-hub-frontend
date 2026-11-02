
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  MessageSquareWarning,
  Star,
  ArrowUpRight,
} from "lucide-react";

const actions = [
  {
    title: "Verify Providers",
    description: "Review provider applications",
    icon: ShieldCheck,
    path: "/admin/providers",
  },
  {
    title: "Manage Complaints",
    description: "Resolve customer issues",
    icon: MessageSquareWarning,
    path: "/admin/complaints",
  },
  {
    title: "Review Moderation",
    description: "Moderate inappropriate reviews",
    icon: Star,
    path: "/admin/reviews",
  },
];

export default function QuickAction() {
  const navigate = useNavigate();

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold text-slate-900">Quick Actions</h2>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-violet-200 hover:bg-violet-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <Icon size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {action.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {action.description}
                </p>
              </div>

              <ArrowUpRight size={17} className="text-slate-400" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
