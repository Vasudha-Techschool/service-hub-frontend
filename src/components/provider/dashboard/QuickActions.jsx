import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  BriefcaseBusiness,
  CalendarDays,
  MessageCircle,
} from "lucide-react";

import QuickActionCard from "./QuickActionCard";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Manage Requests",
      description: "View and respond to customer requests",
      icon: ClipboardList,
      path: "/provider/bookings",
    },
    {
      title: "Manage Services",
      description: "Update your offered services",
      icon: BriefcaseBusiness,
      path: "/provider/services",
    },
    {
      title: "Availability",
      description: "Manage available days and times",
      icon: CalendarDays,
      path: "/provider/availability",
    },
    {
      title: "Messages",
      description: "Communicate with customers",
      icon: MessageCircle,
      path: "/provider/messages",
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Access your frequently used features.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <QuickActionCard
            key={action.path}
            {...action}
            onClick={() => navigate(action.path)}
          />
        ))}
      </div>
    </section>
  );
}