
import { Search, Filter, RotateCcw } from "lucide-react";

const ComplaintFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  category,
  setCategory,
  onReset,
}) => {
  const statuses = [
    { label: "All Statuses", value: "all" },
    { label: "Awaiting Response", value: "awaiting_response" },
    { label: "Under Review", value: "under_review" },
    { label: "Resolved", value: "resolved" },
    { label: "Rejected", value: "rejected" },
    { label: "Closed", value: "closed" },
  ];

  const categories = [
    { label: "All Categories", value: "all" },
    { label: "Service", value: "service" },
    { label: "Provider", value: "provider" },
    { label: "Platform", value: "platform" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={18} className="text-gray-600" />

        <h3 className="font-semibold text-gray-800">
          Filter Complaints
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          <RotateCcw size={16} />
          Reset Filters
        </button>

      </div>
    </div>
  );
};

export default ComplaintFilters;