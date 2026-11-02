
const categories = [
  { name: "Plumbing", percent: 22, color: "bg-violet-500" },
  { name: "Electrical", percent: 18, color: "bg-blue-500" },
  { name: "Cleaning", percent: 15, color: "bg-emerald-500" },
  { name: "AC Repair", percent: 12, color: "bg-amber-500" },
  { name: "Carpentry", percent: 10, color: "bg-orange-500" },
  { name: "Other Services", percent: 23, color: "bg-slate-400" },
];

export default function CategoryOverview() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="font-semibold text-slate-900">
          Service Category Overview
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Share of bookings by service
        </p>
      </div>

      <div className="space-y-5">
        {categories.map((category) => (
          <div key={category.name}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-600">{category.name}</span>
              <span className="font-medium text-slate-800">
                {category.percent}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${category.color}`}
                style={{ width: `${category.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Illustrative sample data
      </p>
    </section>
  );
}
