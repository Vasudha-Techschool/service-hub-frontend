import {
  Users,
  Clock3,
  CheckCircle2,
  XCircle,
  UserRoundX,
} from "lucide-react";

const cards = [
  {
    key: "total",
    label: "Total Providers",
    icon: Users,
    color: "text-blue-600 bg-blue-50",
  },
  {
    key: "pending",
    label: "Pending Verification",
    icon: Clock3,
    color: "text-amber-600 bg-amber-50",
  },
  {
    key: "approved",
    label: "Approved",
    icon: CheckCircle2,
    color: "text-green-600 bg-green-50",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    color: "text-red-600 bg-red-50",
  },
 
];

export default function ProviderStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <span className={`rounded-lg p-2 ${color}`}>
              <Icon size={20} />
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900">
            {stats[key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}