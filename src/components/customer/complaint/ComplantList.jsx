
import ComplaintCard from "./ComplaintCard";

export default function ComplaintList({
  complaints,
  loading,
  onView,
}) {
  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-gray-500">
        Loading your complaints...
      </p>
    );
  }

  if (!complaints.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h3 className="font-semibold text-gray-800">
          No complaints registered
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Complaints you submit will appear here so you can track their progress.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {complaints.map((complaint) => (
        <ComplaintCard
          key={complaint.id}
          complaint={complaint}
          onView={onView}
        />
      ))}
    </div>
  );
}