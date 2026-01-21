import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOverview } from "../../../../REDUX/Slices/adminAnalyticsSlice";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-24 bg-gray-700 rounded-lg"></div>
    <div className="h-64 bg-gray-700 rounded-lg"></div>
  </div>
);

const KPICard = ({ label, value, trend, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "border-blue-500/30",
    green: "border-green-500/30",
    amber: "border-amber-500/30",
    red: "border-red-500/30"
  };

  const trendColor = trend > 0 ? "text-green-400" : "text-red-400";

  return (
    <div
      className={`bg-gray-800/50 border ${colorClasses[color]} rounded-lg p-4 backdrop-blur`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          <p className={`text-xs mt-1 ${trendColor}`}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </p>
        </div>
        <span className="text-2xl opacity-20">{icon}</span>
      </div>
    </div>
  );
};

const OverviewTab = () => {
  const dispatch = useDispatch();
  const { overview, loading, selectedRange } = useSelector(
    (state) => state.adminAnalytics
  );

  useEffect(() => {
    dispatch(fetchOverview({ range: selectedRange }));
  }, [dispatch, selectedRange]);

  if (loading) return <SkeletonLoader />;

  // Sample trend data - in production, calculate from historical data
  const trends = {
    sessions: 10,
    users: 5,
    downloads: 15,
    bounce: -8,
    duration: 12,
    views: 20
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards - Row 1: Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          label="Total Sessions"
          value={overview.totalSessions}
          trend={trends.sessions}
          icon="📊"
          color="blue"
        />
        <KPICard
          label="Active Users Today"
          value={overview.activeUsersToday}
          trend={trends.users}
          icon="👥"
          color="green"
        />
        <KPICard
          label="Total Downloads"
          value={overview.totalDownloads}
          trend={trends.downloads}
          icon="📥"
          color="green"
        />
      </div>

      {/* KPI Cards - Row 2: Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          label="Bounce Rate"
          value={`${overview.bounceRate}%`}
          trend={trends.bounce}
          icon="📉"
          color="red"
        />
        <KPICard
          label="Avg Session Duration"
          value={`${Math.round(overview.avgSessionDuration / 60)}m`}
          trend={trends.duration}
          icon="⏱️"
          color="blue"
        />
        <KPICard
          label="Total Page Views"
          value={overview.totalPageViews}
          trend={trends.views}
          icon="📄"
          color="blue"
        />
      </div>

      {/* Trend Chart */}
      <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">
          📈 Platform Health Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                {
                  name: "Overview",
                  sessions: overview.totalSessions,
                  users: overview.activeUsersToday
                }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px"
                }}
              />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#3B82F6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">
          🧠 Key Insights
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <span className="text-amber-400 text-xl">⚠️</span>
            <p className="text-gray-300">
              {overview.totalSessions} total sessions recorded in this period
            </p>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-green-400 text-xl">✅</span>
            <p className="text-gray-300">
              Average session duration is{" "}
              {Math.round(overview.avgSessionDuration / 60)} minutes - indicates
              good engagement
            </p>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-blue-400 text-xl">ℹ️</span>
            <p className="text-gray-300">
              {overview.bounceRate}% bounce rate suggests users are exploring
              multiple pages
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;