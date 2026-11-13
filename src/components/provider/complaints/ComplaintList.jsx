
import { MessageSquare, Search } from "lucide-react";
import ComplaintCard from "./ComplaintCard";

const ComplaintList = ({
  complaints = [],
  onViewDetails,
}) => {
  return (
    <div className="space-y-4">

      {/* List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Complaints
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage and respond to customer complaints.
          </p>
        </div>

        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
          {complaints.length}{" "}
          {complaints.length === 1 ? "Complaint" : "Complaints"}
        </span>
      </div>

      {/* Complaint Cards */}
      {complaints.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
            <MessageSquare
              size={28}
              className="text-gray-400"
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            No Complaints Found
          </h3>

          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            There are no complaints matching your selected filters.
            Try changing your search or filter criteria.
          </p>

        </div>
      )}

    </div>
  );
};

export default ComplaintList;