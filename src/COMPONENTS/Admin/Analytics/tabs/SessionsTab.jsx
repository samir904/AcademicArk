import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSessionsTimeline,
  fetchReturningUsers,
  fetchNewUsers
} from "../../../../REDUX/Slices/adminAnalyticsSlice";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-64 bg-gray-700 rounded-lg"></div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-40 bg-gray-700 rounded-lg"></div>
      <div className="h-40 bg-gray-700 rounded-lg"></div>
    </div>
  </div>
);

const SessionsTab = () => {
  const dispatch = useDispatch();
  const {
    sessionsTimeline,
    returningUsers,
    newUsers,
    loading,
    selectedRange
  } = useSelector((state) => state.adminAnalytics);

  useEffect(() => {
    dispatch(fetchSessionsTimeline({ range: selectedRange }));
    dispatch(fetchReturningUsers({ range: selectedRange }));
    dispatch(fetchNewUsers({ range: selectedRange }));
  }, [dispatch, selectedRange]);

  if (loading) return <SkeletonLoader />;

  // Prepare pie chart data
  const pieData = [
    {
      name: "New Users",
      value: newUsers.newUsers || 0,
      fill: "#10B981"
    },
    {
      name: "Returning Users",
      value: returningUsers.returningUsers || 0,
      fill: "#3B82F6"
    }
  ];

  const totalUsers =
    (newUsers.newUsers || 0) + (returningUsers.returningUsers || 0);

  return (
    <div className="space-y-6">
      {/* Main Line Chart - Sessions & Users Trend */}
      <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">
          📈 Sessions & Users Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sessionsTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                name="Sessions"
              />
              <Line
                type="monotone"
                dataKey="uniqueUsers"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Unique Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mini KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Avg Session Duration */}
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-4 backdrop-blur">
          <p className="text-gray-400 text-sm mb-2">⏱️ Avg Session Duration</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {Math.round(
                sessionsTimeline.reduce((sum, item) => sum + (item.avgDuration || 0), 0) /
                  (sessionsTimeline.length || 1) / 60
              )}
            </span>
            <span className="text-gray-400">minutes</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Good engagement indicator
          </p>
        </div>

        {/* Avg Pages per Session */}
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-4 backdrop-blur">
          <p className="text-gray-400 text-sm mb-2">📄 Avg Pages/Session</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {(
                sessionsTimeline.reduce((sum, item) => sum + (item.avgPageViews || 0), 0) /
                  (sessionsTimeline.length || 1)
              ).toFixed(2)}
            </span>
            <span className="text-gray-400">pages</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Shows exploration rate
          </p>
        </div>
      </div>

      {/* New vs Returning Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">
            👥 New vs Returning Users
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="bg-[#111111] border border-green-500/30 rounded-lg p-4 backdrop-blur">
            <p className="text-gray-400 text-sm mb-2">🆕 New Users</p>
            <p className="text-3xl font-bold text-green-400">
              {newUsers.newUsers || 0}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {totalUsers > 0
                ? ((((newUsers.newUsers || 0) / totalUsers) * 100).toFixed(2))
                : 0}
              % of total
            </p>
          </div>

          <div className="bg-[#111111] border border-blue-500/30 rounded-lg p-4 backdrop-blur">
            <p className="text-gray-400 text-sm mb-2">🔁 Returning Users</p>
            <p className="text-3xl font-bold text-blue-400">
              {returningUsers.returningUsers || 0}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {returningUsers.returningPercentage || 0}% retention
            </p>
          </div>

          <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 backdrop-blur">
            <p className="text-amber-300 text-sm">💡 Insight</p>
            <p className="text-xs text-amber-100 mt-1">
              {returningUsers.returningPercentage > 50
                ? "Strong retention! Users are coming back regularly."
                : "Low retention. Consider engagement strategies."}
            </p>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      {sessionsTimeline.length > 0 && (
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur overflow-x-auto">
          <h3 className="text-lg font-semibold text-white mb-4">
            📊 Sessions Timeline
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-2 text-gray-400 font-medium">
                  Date
                </th>
                <th className="text-left px-4 py-2 text-gray-400 font-medium">
                  Sessions
                </th>
                <th className="text-left px-4 py-2 text-gray-400 font-medium">
                  Unique Users
                </th>
                <th className="text-left px-4 py-2 text-gray-400 font-medium">
                  Avg Duration
                </th>
                <th className="text-left px-4 py-2 text-gray-400 font-medium">
                  Avg Pages
                </th>
              </tr>
            </thead>
            <tbody>
              {sessionsTimeline.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-700 hover:bg-gray-700/30"
                >
                  <td className="px-4 py-3 text-white">{item.date}</td>
                  <td className="px-4 py-3 text-green-400">{item.sessions}</td>
                  <td className="px-4 py-3 text-blue-400">
                    {item.uniqueUsers}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {Math.round(item.avgDuration / 60)}m
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {item.avgPageViews.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SessionsTab;