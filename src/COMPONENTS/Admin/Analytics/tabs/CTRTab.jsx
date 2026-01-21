import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCTRBySection,
  fetchEngagementSummary
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
    <div className="h-64 bg-gray-700 rounded-lg"></div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-40 bg-gray-700 rounded-lg"></div>
      <div className="h-40 bg-gray-700 rounded-lg"></div>
    </div>
  </div>
);

const CTRTab = () => {
  const dispatch = useDispatch();
  const {
    ctrBySection,
    engagementSummary,
    loading,
    selectedRange
  } = useSelector((state) => state.adminAnalytics);

  useEffect(() => {
    dispatch(fetchCTRBySection({ range: selectedRange }));
    dispatch(fetchEngagementSummary({ range: selectedRange }));
  }, [dispatch, selectedRange]);

  if (loading) return <SkeletonLoader />;

  // Find best performing section
  const bestSection =
    ctrBySection.length > 0
      ? ctrBySection.reduce((max, item) => {
          return item.ctr > (max.ctr || 0) ? item : max;
        })
      : null;

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

  return (
    <div className="space-y-6">
      {/* Main CTR Chart */}
      <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">
          📊 CTR by Section
        </h3>
        {ctrBySection.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ctrBySection}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#9CA3AF" label={{ value: "CTR %", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="ctr" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                  {ctrBySection.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400">
            No CTR data available for this period
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111111] border border-blue-500/30 rounded-lg p-4 backdrop-blur">
          <p className="text-gray-400 text-sm mb-2">👁️ Total Impressions</p>
          <p className="text-3xl font-bold text-blue-400">
            {ctrBySection.reduce((sum, item) => sum + (item.impressions || 0), 0)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Times section shown</p>
        </div>

        <div className="bg-[#111111] border border-green-500/30 rounded-lg p-4 backdrop-blur">
          <p className="text-gray-400 text-sm mb-2">🖱️ Total Clicks</p>
          <p className="text-3xl font-bold text-green-400">
            {ctrBySection.reduce((sum, item) => sum + (item.clicks || 0), 0)}
          </p>
          <p className="text-xs text-gray-500 mt-2">User interactions</p>
        </div>

        <div className="bg-[#111111] border border-amber-500/30 rounded-lg p-4 backdrop-blur">
          <p className="text-gray-400 text-sm mb-2">📈 Average CTR</p>
          <p className="text-3xl font-bold text-amber-400">
            {(ctrBySection.reduce((sum, item) => sum + (item.ctr || 0), 0) /
              (ctrBySection.length || 1)).toFixed(2)}
            %
          </p>
          <p className="text-xs text-gray-500 mt-2">Across all sections</p>
        </div>
      </div>

      {/* Best Performing Section */}
      {bestSection && (
        <div className="bg-[#111111] border border-green-500/30 rounded-lg p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-green-300 mb-4">
            ⭐ Best Performing Section
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Section</p>
              <p className="text-2xl font-bold text-green-400">{bestSection.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">CTR</p>
              <p className="text-2xl font-bold text-green-400">
                {bestSection.ctr}%
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Impressions</p>
              <p className="text-2xl font-bold text-green-400">
                {bestSection.impressions}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Clicks</p>
              <p className="text-2xl font-bold text-green-400">
                {bestSection.clicks}
              </p>
            </div>
          </div>
          <p className="text-sm text-green-100 mt-4">
            💡 This section resonates well with users. Consider promoting similar
            content or layouts.
          </p>
        </div>
      )}

      {/* Detailed CTR Table */}
      <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur overflow-x-auto">
        <h3 className="text-lg font-semibold text-white mb-4">
          📋 Detailed CTR Breakdown
        </h3>
        {ctrBySection.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">
                  Section
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Impressions
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Clicks
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  CTR %
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody>
              {ctrBySection.map((item, idx) => {
                let performanceColor = "text-gray-400";
                let performanceLabel = "Average";

                if (item.ctr > 5) {
                  performanceColor = "text-green-400";
                  performanceLabel = "🟢 Excellent";
                } else if (item.ctr > 2) {
                  performanceColor = "text-blue-400";
                  performanceLabel = "🔵 Good";
                } else if (item.ctr > 0) {
                  performanceColor = "text-amber-400";
                  performanceLabel = "🟡 Low";
                }

                return (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-gray-700/30"
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {item.name}
                    </td>
                    <td className="text-center px-4 py-3 text-gray-300">
                      {item.impressions}
                    </td>
                    <td className="text-center px-4 py-3 text-gray-300">
                      {item.clicks}
                    </td>
                    <td className="text-center px-4 py-3 text-lg font-bold text-blue-400">
                      {item.ctr}%
                    </td>
                    <td className={`text-center px-4 py-3 font-semibold ${performanceColor}`}>
                      {performanceLabel}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No CTR data available
          </div>
        )}
      </div>

      {/* Engagement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Engagement */}
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">
            📊 Engagement Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-400">Avg Page Views</span>
              <span className="text-2xl font-bold text-blue-400">
                {engagementSummary.avgPageViews?.toFixed(2) || 0}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-400">Avg Clicks</span>
              <span className="text-2xl font-bold text-green-400">
                {engagementSummary.avgClicks?.toFixed(2) || 0}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-400">Avg Scroll Depth</span>
              <span className="text-2xl font-bold text-amber-400">
                {engagementSummary.avgScrollDepth?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Avg Session Duration</span>
              <span className="text-2xl font-bold text-purple-400">
                {Math.round(engagementSummary.avgSessionDuration / 60) || 0}m
              </span>
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">
            📈 User Actions
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
              <span className="text-gray-400">Total Bookmarks</span>
              <span className="text-2xl font-bold text-blue-400">
                {engagementSummary.totalBookmarks || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Ratings</span>
              <span className="text-2xl font-bold text-yellow-400">
                {engagementSummary.totalRatings || 0}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            💡 Users bookmarking and rating content is a strong engagement signal.
            Encourage more interaction.
          </p>
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="bg-[#111111] border border-blue-500/30 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-blue-300 mb-4">
          💡 CTR & Engagement Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-100">
          <li>
            • <strong>CTR Below 1%?</strong>: Section might not be relevant to
            users. Test different placement or messaging.
          </li>
          <li>
            • <strong>Good CTR but Low Conversions?</strong>: Users interested but
            not converting. Simplify download/action process.
          </li>
          <li>
            • <strong>Low Avg Clicks?</strong>: Interactive elements not visible
            enough. Test different layouts.
          </li>
          <li>
            • <strong>Low Scroll Depth?</strong>: Important content below fold.
            Reorganize page structure.
          </li>
          <li>
            • <strong>High Bookmarks & Ratings?</strong>: 🎉 Content resonates well.
            Consider promoting in other sections.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CTRTab;