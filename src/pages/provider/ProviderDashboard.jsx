
export default function ProviderDashboard() {
  const stats = [
    { title: "New Requests", value: 0 },
    { title: "Upcoming Bookings", value: 0 },
    { title: "Completed Jobs", value: 0 },
    { title: "Average Rating", value: "—" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome to Service Hub!
      </h1>
      <p className="mt-2 text-gray-500">
        Manage your bookings and service business here.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="mt-3 text-3xl font-bold text-gray-800">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
