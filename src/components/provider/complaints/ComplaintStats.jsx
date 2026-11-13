
import {
  AlertCircle,
  Clock,
  CheckCircle,
  FileText,
} from "lucide-react";

const ComplaintStats = ({ complaints = [] }) => {
  const stats = [
    {
      title: "Total Complaints",
      count: complaints.length,
      icon: FileText,
      color: "blue",
    },
    {
      title: "Awaiting Response",
      count: complaints.filter(
        (item) => item.status === "awaiting_response"
      ).length,
      icon: AlertCircle,
      color: "amber",
    },
    {
      title: "Under Review",
      count: complaints.filter(
        (item) => item.status === "under_review"
      ).length,
      icon: Clock,
      color: "purple",
    },
    {
      title: "Resolved",
      count: complaints.filter(
        (item) => item.status === "resolved"
      ).length,
      icon: CheckCircle,
      color: "green",
    },
  ];

  const colorStyles = {
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat) => { 
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  {stat.title}
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mt-2">
                  {stat.count}
                </h3>
              </div>

              <div
                className={`w-11 h-11 rounded-lg flex items-center justify-center ${colorStyles[stat.color]}`}
              >
                <Icon size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ComplaintStats;
