
export default function ReviewFilters({ value, onChange }) {
  const options = [
    { label: "All Reviews", value: "all" },
    { label: "5 Stars", value: "5" },
    { label: "4 Stars", value: "4" },
    { label: "3 Stars", value: "3" },
    { label: "2 Stars", value: "2" },
    { label: "1 Star", value: "1" },
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