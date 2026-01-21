
// ============================================
// COMPLETE: AcquisitionTab.jsx
// ============================================
// Ready to copy-paste into your project!
// File: src/COMPONENTS/TABS/AcquisitionTab.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTrafficSources,
  fetchEntryPagesBySource,
  fetchTopReferrers,
} from "../../../../REDUX/Slices/adminAnalyticsSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AcquisitionTab = ({ timeRange }) => {
  const dispatch = useDispatch();
  const {
    trafficSources,
    entryPagesBySource,
    topReferrers,
    loading,
    error,
  } = useSelector((state) => state.adminAnalytics);

  useEffect(() => {
    dispatch(fetchTrafficSources({ range: timeRange }));
    dispatch(fetchEntryPagesBySource({ range: timeRange }));
    dispatch(fetchTopReferrers({ range: timeRange }));
  }, [dispatch, timeRange]);

  // Color palette for charts
  const COLORS = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444",
    "#8B5CF6", "#EC4899", "#14B8A6", "#F97316",
  ];

  const chartColors = {
    sessions: "#3B82F6",
    avgDuration: "#10B981",
    bounceRate: "#EF4444",
    downloads: "#8B5CF6",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Traffic Sources</h2>
        <p className="text-gray-400 text-sm mt-1">
          Where users come from and how they behave
        </p>
      </div>

      {/* 1. Sessions by Source - Bar Chart */}
      <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Sessions by Source
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trafficSources}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="source" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Bar dataKey="sessions" fill={chartColors.sessions} radius={[8, 8, 0, 0]} />
            <Bar dataKey="downloads" fill={chartColors.downloads} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Traffic Source KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {trafficSources.slice(0, 4).map((source, idx) => (
          <div
            key={idx}
            className="bg-[#111111] border border-blue-500/30 rounded-lg p-4"
          >
            <p className="text-gray-400 text-sm font-medium mb-2">
              {source.source}
            </p>
            <div className="space-y-2">
              <div>
                <p className="text-2xl font-bold text-blue-400">
                  {source.sessions}
                </p>
                <p className="text-gray-500 text-xs">Sessions</p>
              </div>
              <div className="pt-2 border-t border-gray-700/50">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-green-400">
                    {source.avgDuration}s
                  </span>{" "}
                  avg duration
                </p>
                <p className="text-sm text-gray-300">
                  <span
                    className={
                      source.bounceRate > 50
                        ? "text-red-400"
                        : "text-green-400"
                    }
                  >
                    {source.bounceRate.toFixed(1)}%
                  </span>{" "}
                  bounce rate
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3 & 4. Bounce Rate and Duration Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Bounce Rate by Source
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trafficSources}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="source" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                }}
                labelStyle={{ color: "#E5E7EB" }}
                formatter={(value) => [`${value.toFixed(1)}%`, "Bounce Rate"]}
              />
              <Bar
                dataKey="bounceRate"
                fill={chartColors.bounceRate}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Avg Duration by Source
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trafficSources}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="source" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                }}
                labelStyle={{ color: "#E5E7EB" }}
                formatter={(value) => [`${value}s`, "Duration"]}
              />
              <Bar
                dataKey="avgDuration"
                fill={chartColors.avgDuration}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Entry Pages by Source - Table */}
      <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Entry Pages by Source
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Source
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Entry Page
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-300">
                  Sessions
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-300">
                  Bounce Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {entryPagesBySource.slice(0, 10).map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-700/30 hover:bg-gray-700/20 transition"
                >
                  <td className="py-3 px-4 text-gray-300">
                    <span className="inline-block bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                      {item.source}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {item.entryPage}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-200 font-semibold">
                    {item.sessions}
                  </td>
                  <td className="text-right py-3 px-4">
                    <span
                      className={
                        item.bounceRate > 50
                          ? "text-red-400 font-medium"
                          : "text-green-400 font-medium"
                      }
                    >
                      {item.bounceRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Top Referrers - List */}
      <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Top Referrers
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          External websites driving traffic
        </p>
        <div className="space-y-3">
          {topReferrers.map((ref, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-700/30 rounded-lg p-4 border border-gray-700/50 hover:border-blue-500/30 transition"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {ref.refUrl || "Direct"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Source: {ref.source}
                </p>
              </div>
              <div className="ml-4 text-right">
                <p className="text-lg font-bold text-blue-400">
                  {ref.sessions}
                </p>
                <p className="text-xs text-gray-500">sessions</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Traffic Distribution - Pie Chart */}
      <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Traffic Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={trafficSources}
              dataKey="sessions"
              nameKey="source"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {trafficSources.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#E5E7EB" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 8. Insights Box */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-300 mb-3">💡 Insights</h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>
            ✓ Top source:{" "}
            <span className="font-semibold text-blue-300">
              {trafficSources[0]?.source || "N/A"}
            </span>{" "}
            with {trafficSources[0]?.sessions || 0} sessions
          </li>
          <li>
            ✓ Lowest bounce rate:{" "}
            <span className="font-semibold text-green-300">
              {trafficSources.length > 0
                ? Math.min(...trafficSources.map((s) => s.bounceRate)).toFixed(1)
                : "N/A"}
              %
            </span>
          </li>
          <li>
            ✓ Most engaged source (longest duration):{" "}
            <span className="font-semibold text-green-300">
              {trafficSources.length > 0
                ? trafficSources.reduce((max, s) =>
                    s.avgDuration > max.avgDuration ? s : max
                  ).source
                : "N/A"}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AcquisitionTab;

// ============================================
// COPY THIS FILE TO:
// src/COMPONENTS/TABS/AcquisitionTab.jsx
// ============================================