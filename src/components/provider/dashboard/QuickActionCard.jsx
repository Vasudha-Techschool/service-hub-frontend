import React from "react";
import { ArrowRight } from "lucide-react";

export default function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-green-300 hover:bg-green-50/40"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
        <Icon size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-gray-800">
          {title}
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      </div>

      <ArrowRight size={17} className="text-gray-400" />
    </button>
  );
}