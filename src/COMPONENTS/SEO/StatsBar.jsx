import { FileText, Download, Eye, Star } from "lucide-react";

export default function StatsBar({ stats }) {
  const statItems = [
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Total Notes",
      value: stats.totalNotes,
      color: "blue"
    },
    {
      icon: <Download className="w-5 h-5" />,
      label: "Downloads",
      value: stats.totalDownloads.toLocaleString(),
      color: "green"
    },
    {
      icon: <Eye className="w-5 h-5" />,
      label: "Views",
      value: stats.totalViews.toLocaleString(),
      color: "purple"
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: "Avg Rating",
      value: stats.avgRating > 0 ? stats.avgRating : "N/A",
      color: "yellow"
    }
  ];

  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, idx) => (
        <div
          key={idx}
          className={`border rounded-xl p-4 ${colorClasses[item.color]} backdrop-blur-sm`}
        >
          <div className="flex items-center space-x-2 mb-2">
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </div>
          <div className="text-2xl font-bold">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
