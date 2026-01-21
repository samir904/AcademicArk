import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeviceBreakdown,
  fetchBrowserBreakdown,
  fetchOSBreakdown
} from "../../../../REDUX/Slices/adminAnalyticsSlice";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="grid grid-cols-3 gap-4">
      <div className="h-64 bg-gray-700 rounded-lg"></div>
      <div className="h-64 bg-gray-700 rounded-lg"></div>
      <div className="h-64 bg-gray-700 rounded-lg"></div>
    </div>
    <div className="h-96 bg-gray-700 rounded-lg"></div>
  </div>
);

const DevicesTab = () => {
  const dispatch = useDispatch();
  const {
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    loading,
    selectedRange
  } = useSelector((state) => state.adminAnalytics);

  useEffect(() => {
    dispatch(fetchDeviceBreakdown({ range: selectedRange }));
    dispatch(fetchBrowserBreakdown({ range: selectedRange }));
    dispatch(fetchOSBreakdown({ range: selectedRange }));
  }, [dispatch, selectedRange]);

  if (loading) return <SkeletonLoader />;

  // Colors for pie charts
  const DEVICE_COLORS = ["#3B82F6", "#10B981", "#F59E0B"];
  const BROWSER_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
  const OS_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  // Prepare device data
  const deviceData = deviceBreakdown.map((item) => ({
    name: item.deviceType || "Unknown",
    value: item.sessions || 0,
    users: item.uniqueUsers || 0,
    duration: item.avgDuration || 0,
    percentage: item.percentage || 0
  }));

  // Prepare browser data
  const browserData = browserBreakdown.map((item) => ({
    name: item.browser || "Unknown",
    value: item.sessions || 0,
    users: item.uniqueUsers || 0
  }));

  // Prepare OS data
  const osData = osBreakdown.map((item) => ({
    name: item.osName || "Unknown",
    value: item.sessions || 0,
    users: item.uniqueUsers || 0
  }));

  return (
    <div className="space-y-6">
      {/* Three Main Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Distribution */}
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            📱 Device Distribution
          </h3>
          {deviceData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) =>
                      `${name}: ${percentage.toFixed(1)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DEVICE_COLORS[index % DEVICE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px"
                    }}
                    formatter={(value) => `${value} sessions`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Browser Distribution */}
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            🌐 Browser Usage
          </h3>
          {browserData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={browserData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name }) => name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {browserData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={BROWSER_COLORS[index % BROWSER_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px"
                    }}
                    formatter={(value) => `${value} sessions`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* OS Distribution */}
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            🖥️ Operating Systems
          </h3>
          {osData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={osData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name }) => name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {osData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={OS_COLORS[index % OS_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px"
                    }}
                    formatter={(value) => `${value} sessions`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Device Performance Table */}
      {deviceData.length > 0 && (
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur overflow-x-auto">
          <h3 className="text-lg font-semibold text-white mb-4">
            📊 Device Performance
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">
                  Device Type
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Sessions
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Users
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Avg Duration
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Share
                </th>
              </tr>
            </thead>
            <tbody>
              {deviceData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-700 hover:bg-gray-700/30"
                >
                  <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                  <td className="text-center px-4 py-3 text-blue-400 font-bold">
                    {item.value}
                  </td>
                  <td className="text-center px-4 py-3 text-green-400">
                    {item.users}
                  </td>
                  <td className="text-center px-4 py-3 text-gray-300">
                    {Math.round(item.duration / 60)}m
                  </td>
                  <td className="text-center px-4 py-3 text-amber-400 font-semibold">
                    {item.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Browser Breakdown Table */}
      {browserData.length > 0 && (
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur overflow-x-auto">
          <h3 className="text-lg font-semibold text-white mb-4">
            🌐 Browser Breakdown
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">
                  Browser
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Sessions
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Unique Users
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Share %
                </th>
              </tr>
            </thead>
            <tbody>
              {browserData.map((item, idx) => {
                const totalSessions = browserData.reduce(
                  (sum, b) => sum + b.value,
                  0
                );
                const share = ((item.value / totalSessions) * 100).toFixed(1);

                return (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-gray-700/30"
                  >
                    <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                    <td className="text-center px-4 py-3 text-blue-400 font-bold">
                      {item.value}
                    </td>
                    <td className="text-center px-4 py-3 text-green-400">
                      {item.users}
                    </td>
                    <td className="text-center px-4 py-3 text-amber-400 font-semibold">
                      {share}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* OS Breakdown Table */}
      {osData.length > 0 && (
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur overflow-x-auto">
          <h3 className="text-lg font-semibold text-white mb-4">
            🖥️ OS Breakdown
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">
                  Operating System
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Sessions
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Unique Users
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Share %
                </th>
              </tr>
            </thead>
            <tbody>
              {osData.map((item, idx) => {
                const totalSessions = osData.reduce((sum, o) => sum + o.value, 0);
                const share = ((item.value / totalSessions) * 100).toFixed(1);

                return (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-gray-700/30"
                  >
                    <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                    <td className="text-center px-4 py-3 text-blue-400 font-bold">
                      {item.value}
                    </td>
                    <td className="text-center px-4 py-3 text-green-400">
                      {item.users}
                    </td>
                    <td className="text-center px-4 py-3 text-amber-400 font-semibold">
                      {share}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Optimization Tips */}
      <div className="bg-[#111111] border border-blue-500/30 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-blue-300 mb-4">
          💡 Device Optimization Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-100">
          <li>
            • <strong>Mobile &gt;70%?</strong>: Your users are mobile-first. Ensure
            mobile UX is optimized.
          </li>
          <li>
            • <strong>Long avg duration on Desktop:</strong>: Power users on desktop.
            Don't deprioritize desktop features.
          </li>
          <li>
            • <strong>Chrome dominates?</strong>: Test on edge cases with Firefox/Safari
            too.
          </li>
          <li>
            • <strong>iOS vs Android imbalance:</strong>: Test specific to platform with
            higher share.
          </li>
          <li>
            • <strong>Windows/Android dominant:</strong>: Prioritize these in QA and
            performance testing.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DevicesTab;