
export default function ComplaintFilters({ value, onChange }) {
  const options = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Under Review", value: "under_review" },
    { label: "Awaiting Response", value: "awaiting_response" },
    { label: "Resolved", value: "resolved" },
    { label: "Rejected", value: "rejected" },
    { label: "Closed", value: "closed" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            value === option.value
              ? "bg-green-700 text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}