
// FunnelTab.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDownloadFunnel,
  fetchConversionsSummary
} from "../../../../REDUX/Slices/adminAnalyticsSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-72 bg-gray-700 rounded-lg"></div>
    <div className="h-48 bg-gray-700 rounded-lg"></div>
  </div>
);

const FunnelTab = () => {
  const dispatch = useDispatch();
  const {
    downloadFunnel,
    conversionsSummary,
    loading,
    selectedRange
  } = useSelector((state) => state.adminAnalytics);

  useEffect(() => {
    dispatch(fetchDownloadFunnel({ range: selectedRange }));
    dispatch(fetchConversionsSummary({ range: selectedRange }));
  }, [dispatch, selectedRange]);

  if (loading) return <SkeletonLoader />;

  // Prepare funnel data
  const funnelData = [
    {
      step: "Homepage",
      users: downloadFunnel.step1_homepage || 0,
      color: "#3B82F6"
    },
    {
      step: "Notes List",
      users: downloadFunnel.step2_notesList || 0,
      color: "#10B981"
    },
    {
      step: "Note Detail",
      users: downloadFunnel.step3_noteDetail || 0,
      color: "#F59E0B"
    },
    {
      step: "Download",
      users: downloadFunnel.step4_download || 0,
      color: "#EF4444"
    }
  ];

  // Calculate dropoff percentages
  const totalStart = funnelData[0].users || 1;
  const funnelWithDropoff = funnelData.map((item, idx) => ({
    ...item,
    dropoff:
      idx > 0
        ? Math.round(
            ((funnelData[idx - 1].users - item.users) /
              funnelData[idx - 1].users) *
              100
          )
        : 0,
    retention: Math.round((item.users / totalStart) * 100)
  }));

  return (
    <div className="space-y-6">
      {/* Main Funnel Visualization */}
      <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-6">
          🔻 Download Funnel: User Journey
        </h3>

        {/* Visual Funnel */}
        <div className="space-y-4 mb-8">
          {funnelWithDropoff.map((item, idx) => (
            <div key={idx}>
              {/* Funnel Step */}
              <div className="flex items-center gap-4">
                <div
                  className="text-sm font-semibold text-white bg-opacity-10 rounded px-3 py-1 w-32"
                  style={{
                    backgroundColor: item.color + "30",
                    borderLeft: `4px solid ${item.color}`
                  }}
                >
                  {item.step}
                </div>

                {/* Bar representing users */}
                <div className="flex-1 h-10 rounded flex items-center px-4 text-white font-bold gap-3" style={{ backgroundColor: item.color + "40", width: `${item.retention}%` }}>
                  <span>{item.users} users</span>
                  <span className="text-xs opacity-75">{item.retention}%</span>
                </div>

                {/* Numbers */}
                <div className="text-right w-24">
                  <p className="text-sm font-bold text-white">{item.users}</p>
                  <p className="text-xs text-gray-400">{item.retention}% retained</p>
                </div>
              </div>

              {/* Dropoff indicator */}
              {idx < funnelWithDropoff.length - 1 && (
                <div className="ml-4 py-2 text-xs text-red-400 font-semibold">
                  ↓ {item.dropoff}% dropped off
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Funnel Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-700">
          {funnelWithDropoff.map((item, idx) => (
            <div key={idx} className="text-center">
              <p className="text-xs text-gray-400 mb-1">{item.step}</p>
              <p className="text-2xl font-bold text-white">{item.users}</p>
              <p className="text-xs text-gray-500">{item.retention}% of start</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-blue-500/30 rounded-lg p-4 backdrop-blur">
          <p className="text-gray-400 text-sm mb-2">📊 Total Sessions</p>
          <p className="text-3xl font-bold text-blue-400">
            {conversionsSummary.totalSessions || 0}
          </p>
          <p className="text-xs text-gray-500 mt-2">In this period</p>
        </div>

        <div className="bg-[#111111] border border-amber-500/30 rounded-lg p-4 backdrop-blur">
          <p className="text-gray-400 text-sm mb-2">🎯 Sessions w/ Conversion</p>
          <p className="text-3xl font-bold text-amber-400">
            {conversionsSummary.sessionsWithConversions || 0}
          </p>
          <p className="text-xs text-gray-500 mt-2">Converted sessions</p>
        </div>

        <div className="bg-[#111111] border border-green-500/30 rounded-lg p-4 backdrop-blur">
          <p className="text-gray-400 text-sm mb-2">⬇️ Total Conversions</p>
          <p className="text-3xl font-bold text-green-400">
            {conversionsSummary.totalConversions || 0}
          </p>
          <p className="text-xs text-gray-500 mt-2">Downloads + Bookmarks</p>
        </div>

        <div className="bg-[#111111] border border-purple-500/30 rounded-lg p-4 backdrop-blur">
          <p className="text-gray-400 text-sm mb-2">📈 Conversion Rate</p>
          <p className="text-3xl font-bold text-purple-400">
            {(conversionsSummary.conversionRate || 0).toFixed(2)}%
          </p>
          <p className="text-xs text-gray-500 mt-2">Overall</p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Download Conversions */}
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">
            📥 Download Conversions
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Downloads</span>
              <span className="text-2xl font-bold text-green-400">
                {conversionsSummary.downloadConversions || 0}
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${
                    (conversionsSummary.downloadConversions /
                      (conversionsSummary.totalConversions || 1)) *
                    100
                  }%`
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-400">
              {(
                (conversionsSummary.downloadConversions /
                  (conversionsSummary.totalConversions || 1)) *
                100
              ).toFixed(1)}
              % of total conversions
            </p>
          </div>
        </div>

        {/* Bookmark Conversions */}
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">
            🔖 Bookmark Conversions
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Bookmarks</span>
              <span className="text-2xl font-bold text-blue-400">
                {conversionsSummary.bookmarkConversions || 0}
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${
                    (conversionsSummary.bookmarkConversions /
                      (conversionsSummary.totalConversions || 1)) *
                    100
                  }%`
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-400">
              {(
                (conversionsSummary.bookmarkConversions /
                  (conversionsSummary.totalConversions || 1)) *
                100
              ).toFixed(1)}
              % of total conversions
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-[#111111] border border-blue-500/30 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-blue-300 mb-4">
          💡 Funnel Optimization Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-100">
          <li>
            • <strong>High Dropoff at Notes List?</strong>: Users can't find what
            they need. Improve search/filtering.
          </li>
          <li>
            • <strong>Lost Users at Note Detail?</strong>: Content preview might
            not match expectations. Update note descriptions.
          </li>
          <li>
            • <strong>Few Downloads?</strong>: Check if download button is visible.
            Consider one-click download.
          </li>
          <li>
            • <strong>Low Bookmarks?</strong>: Promote bookmarking in UI. It's a
            strong retention signal.
          </li>
          <li>
            • <strong>Overall Conversion &gt;10%?</strong>: 🎉 Great! Keep
            optimizing for even better results.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FunnelTab;