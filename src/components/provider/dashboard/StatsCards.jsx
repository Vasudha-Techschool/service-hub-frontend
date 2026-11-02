import React from "react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bg,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {value ?? 0}
          </h3>
        </div>

        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
          <Icon size={21} className={color} />
        </div>
      </div>
    </div>
  );
}