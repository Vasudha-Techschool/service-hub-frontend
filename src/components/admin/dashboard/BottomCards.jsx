
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  MessageSquareWarning,
  Star,
  ArrowUpRight,
} from "lucide-react";

const cards = [
  {
    title: "Provider Verification",
    description: "Review and approve provider accounts.",
    icon: ShieldCheck,
    path: "/admin/providers",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Complaint Management",
    description: "Investigate and resolve customer issues.",
    icon: MessageSquareWarning,
    path: "/admin/complaints",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Review Moderation",
    description: "Manage inappropriate reviews.",
    icon: Star,
    path: "/admin/reviews",
    color: "bg-violet-100 text-violet-600",
  },
];

export default function BottomCards() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <button
            key={card.title}
            onClick={() => navigate(card.path)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-violet-200 hover:shadow-md"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.color}`}>
              <Icon size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {card.description}
              </p>
            </div>

            <ArrowUpRight size={17} className="shrink-0 text-slate-400" />
          </button>
        );
      })}
    </div>
  );
}
