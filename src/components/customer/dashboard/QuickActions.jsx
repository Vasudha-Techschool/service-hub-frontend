
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bot,
  CalendarPlus,
  MessageCircle,
} from "lucide-react";

const actions = [
  {
    title: "Find a Service",
    description: "Browse available service providers",
    icon: Search,
    path: "/customer/services",
  },
  {
    title: "AI Assistant",
    description: "Get help identifying your issue",
    icon: Bot,
    path: "/customer/ai-assistant",
  },
  {
    title: "My Bookings",
    description: "Check your booking status",
    icon: CalendarPlus,
    path: "/customer/bookings",
  },
  {
    title: "Messages",
    description: "Contact your service provider",
    icon: MessageCircle,
    path: "/customer/messages",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-teal-300 hover:shadow-sm"
            >
              <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                <Icon size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  {action.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
