import React from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Star,
} from "lucide-react";

import StatCard from "./StatsCards";

export default function DashboardStats({ stats = {} }) {
  const statItems = [
    {
      title: "Total Requests",
      value: stats.totalBookings,
      icon: ClipboardList,
      color: "text-green-700",
      bg: "bg-green-50",
    },
    {
      title: "Pending Requests",
      value: stats.pendingBookings,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Completed Jobs",
      value: stats.completedBookings,
      icon: CheckCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Average Rating",
      value:
        stats.averageRating != null
          ? Number(stats.averageRating).toFixed(1)
          : "—",
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statItems.map((item) => (
        <StatCard key={item.title} {...item} />
      ))}
    </div>
  );
}