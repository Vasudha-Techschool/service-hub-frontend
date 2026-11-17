
const NotificationFilters = ({
  activeFilter,
  onFilterChange,
  totalCount,
  unreadCount,
  readCount,
}) => {
  const filters = [
    { value: "all", label: "All", count: totalCount },
    { value: "unread", label: "Unread", count: unreadCount },
    { value: "read", label: "Read", count: readCount },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onFilterChange(filter.value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeFilter === filter.value
              ? "bg-green-600 text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {filter.label}

          <span className="ml-2 text-xs">
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default NotificationFilters;
