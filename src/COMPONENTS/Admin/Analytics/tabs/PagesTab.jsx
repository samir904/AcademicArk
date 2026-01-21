import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopPages, fetchPageEngagement } from "../../../../REDUX/Slices/adminAnalyticsSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts";

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-64 bg-gray-700 rounded-lg"></div>
    <div className="h-96 bg-gray-700 rounded-lg"></div>
  </div>
);

const getExitRateColor = (rate) => {
  if (rate > 75) return "text-red-400";
  if (rate > 50) return "text-amber-400";
  return "text-green-400";
};

const getScrollDepthColor = (depth) => {
  if (depth < 30) return "text-red-400";
  if (depth < 60) return "text-amber-400";
  return "text-green-400";
};

const PagesTab = () => {
  const dispatch = useDispatch();
  const { topPages, loading, selectedRange } = useSelector(
    (state) => state.adminAnalytics
  );

  useEffect(() => {
    dispatch(fetchTopPages({ range: selectedRange }));
  }, [dispatch, selectedRange]);

  if (loading) return <SkeletonLoader />;

  // Colors for bar chart
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

  return (
    <div className="space-y-6">
      {/* Bar Chart - Top Pages by Views */}
      <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">
          📊 Top Pages by Views
        </h3>
        {topPages.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topPages}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="pageName"
                  stroke="#9CA3AF"
                  angle={-45}
                  textAnchor="end"
                  height={100}
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
                <Bar dataKey="views" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                  {topPages.map((entry, index) => (
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
            No data available for this range
          </div>
        )}
      </div>

      {/* Page Engagement Details Table */}
      <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur overflow-x-auto">
        <h3 className="text-lg font-semibold text-white mb-4">
          📋 Page Engagement Details
        </h3>
        {topPages.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">
                  Page
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Views
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Avg Time
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Scroll Depth
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Exit Rate
                </th>
                <th className="text-center px-4 py-3 text-gray-400 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((page, idx) => {
                const scrollDepth = page.avgScrollDepth || 0;
                const exitRate = page.exitPercentage || 0;
                let status = "✅ Good";

                if (exitRate > 75) status = "🔴 High Exit";
                else if (scrollDepth < 30) status = "⚠️ Low Engagement";
                else if (scrollDepth > 60) status = "✅ Excellent";

                return (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-gray-700/30"
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {page.pageName}
                    </td>
                    <td className="text-center px-4 py-3 text-blue-400 font-bold">
                      {page.views}
                    </td>
                    <td className="text-center px-4 py-3 text-gray-300">
                      {page.avgTimeSpent}s
                    </td>
                    <td
                      className={`text-center px-4 py-3 font-semibold ${getScrollDepthColor(
                        scrollDepth
                      )}`}
                    >
                      {scrollDepth.toFixed(1)}%
                    </td>
                    <td
                      className={`text-center px-4 py-3 font-semibold ${getExitRateColor(
                        exitRate
                      )}`}
                    >
                      {exitRate.toFixed(1)}%
                    </td>
                    <td className="text-center px-4 py-3">{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No data available for this range
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-[#111111] border border-blue-500/30 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-blue-300 mb-4">
          💡 Page Optimization Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-100">
          <li>
            • <strong>High Exit Rate (&gt;75%)</strong>: Content not matching user
            expectations. Review page copy and CTA.
          </li>
          <li>
            • <strong>Low Scroll Depth (&lt;30%)</strong>: Users not scrolling.
            Consider moving important info above fold.
          </li>
          <li>
            • <strong>High Views + Low Duration</strong>: Page is found but not
            engaging. Update content quality.
          </li>
          <li>
            • <strong>Best Performers</strong>: Analyze what makes high-engagement
            pages successful. Replicate patterns.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PagesTab;