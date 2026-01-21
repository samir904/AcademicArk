import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopViewedNotes,
  fetchTopDownloadedNotes,
  fetchNotesFunnel,
  fetchDeadContent
} from "../../../../REDUX/Slices/adminAnalyticsSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from "recharts";

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="h-64 bg-gray-700 rounded-lg"></div>
      <div className="h-64 bg-gray-700 rounded-lg"></div>
    </div>
    <div className="h-96 bg-gray-700 rounded-lg"></div>
  </div>
);

const NotesTab = () => {
  const dispatch = useDispatch();
  const {
    topViewedNotes,
    topDownloadedNotes,
    notesFunnel,
    deadContent,
    loading,
    selectedRange
  } = useSelector((state) => state.adminAnalytics);

  useEffect(() => {
    dispatch(fetchTopViewedNotes({ range: selectedRange }));
    dispatch(fetchTopDownloadedNotes({ range: selectedRange }));
    dispatch(fetchNotesFunnel({ range: selectedRange }));
    dispatch(fetchDeadContent({ range: selectedRange }));
  }, [dispatch, selectedRange]);

  if (loading) return <SkeletonLoader />;

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

  return (
    <div className="space-y-6">
      {/* Top Two Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed Notes */}
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">
            👀 Most Viewed Notes
          </h3>
          {topViewedNotes.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topViewedNotes.slice(0, 5)}
                  margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis
                    dataKey="title"
                    type="category"
                    stroke="#9CA3AF"
                    width={100}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="views" fill="#3B82F6" radius={[0, 8, 8, 0]}>
                    {topViewedNotes.map((entry, index) => (
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
              No data available
            </div>
          )}
        </div>

        {/* Most Downloaded Notes */}
        <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-white mb-4">
            📥 Most Downloaded Notes
          </h3>
          {topDownloadedNotes.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topDownloadedNotes.slice(0, 5)}
                  margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis
                    dataKey="title"
                    type="category"
                    stroke="#9CA3AF"
                    width={100}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="downloads" fill="#10B981" radius={[0, 8, 8, 0]}>
                    {topDownloadedNotes.map((entry, index) => (
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
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Funnel Stats */}
      <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-white mb-4">
          🔻 Notes Funnel (Views → Clicks → Downloads)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-2">👀 Views</p>
            <p className="text-3xl font-bold text-blue-400">
              {notesFunnel.views || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">Initial impressions</p>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-gray-500">→</div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-2">🖱️ Clicks</p>
            <p className="text-3xl font-bold text-amber-400">
              {notesFunnel.clicks || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {notesFunnel.clickThroughRate || 0}% CTR
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-gray-500">→</div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-2">⬇️ Downloads</p>
            <p className="text-3xl font-bold text-green-400">
              {notesFunnel.downloads || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {notesFunnel.downloadConversionRate || 0}% conversion
            </p>
          </div>
        </div>

        {/* Funnel Analysis */}
        <div className="mt-6 bg-[#111111] border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 font-semibold mb-2">📊 Funnel Analysis:</p>
          <ul className="space-y-1 text-sm text-blue-100">
            <li>
              • <strong>Overall Conversion:</strong> {notesFunnel.overallConversion || 0}%
              {(notesFunnel.overallConversion || 0) > 50
                ? " 🟢 (Good)"
                : " 🔴 (Needs improvement)"}
            </li>
            <li>
              • <strong>Click-Through Rate:</strong> {notesFunnel.clickThroughRate || 0}%
            </li>
            <li>
              • <strong>Download Conversion:</strong>{" "}
              {notesFunnel.downloadConversionRate || 0}%
            </li>
          </ul>
        </div>
      </div>

      {/* Dead Content Table */}
      <div className="bg-[#111111] border border-gray-700/50 rounded-lg p-6 backdrop-blur overflow-x-auto">
        <h3 className="text-lg font-semibold text-white mb-4">
          ⚠️ Dead Content Detection
        </h3>
        {deadContent.length > 0 ? (
          <div>
            <p className="text-red-400 text-sm mb-4">
              Found {deadContent.length} notes with high views but low
              conversions:
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">
                    Title
                  </th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">
                    Views
                  </th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">
                    Clicks
                  </th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">
                    Downloads
                  </th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">
                    Conversion
                  </th>
                  <th className="text-center px-4 py-3 text-gray-400 font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {deadContent.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-gray-700/30"
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {item.title || "Untitled"}
                    </td>
                    <td className="text-center px-4 py-3 text-blue-400">
                      {item.views || 0}
                    </td>
                    <td className="text-center px-4 py-3 text-gray-300">
                      {item.clicks || 0}
                    </td>
                    <td className="text-center px-4 py-3 text-gray-300">
                      {item.downloads || 0}
                    </td>
                    <td className="text-center px-4 py-3 font-bold text-red-400">
                      {((item.downloads || 0) / (item.views || 1) * 100).toFixed(1)}%
                    </td>
                    <td className="text-center px-4 py-3">
                      <button className="text-xs px-3 py-1 bg-amber-600/30 border border-amber-500/50 text-amber-300 rounded hover:bg-amber-600/50">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-green-400">
            ✅ No dead content detected! All notes are performing well.
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesTab;