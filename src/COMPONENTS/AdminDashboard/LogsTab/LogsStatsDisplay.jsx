import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLogStats } from '../../../REDUX/Slices/logsSlice';

export default function LogsStatsDisplay() {
  const dispatch = useDispatch();
  const { logStats, statsLoading, statsError } = useSelector(state => state.logs);
  const [selectedDays, setSelectedDays] = useState(7);

  useEffect(() => {
    dispatch(getLogStats(selectedDays));
  }, [dispatch, selectedDays]);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-400">Loading statistics...</div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
        <p className="text-red-400">Error: {statsError}</p>
      </div>
    );
  }

  const slowestRoutes = logStats.slowestRoutes || [];
  const requestStats = logStats.requestStats || [];
  const consoleStats = logStats.consoleStats || [];

  return (
    <div className="space-y-6">
      {/* Days selector */}
      <div className="flex gap-2">
        {[7, 14, 30].map(days => (
          <button
            key={days}
            onClick={() => setSelectedDays(days)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedDays === days
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Last {days} days
          </button>
        ))}
      </div>

      {/* 🔥 SLOWEST ROUTES SECTION */}
      <section className="rounded-lg border border-white/10 bg-gray-900/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            🐌 Slowest APIs
            <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">
              By Average Response Time
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          {slowestRoutes.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-400 text-sm">
                No data available for selected period.
              </p>
            </div>
          ) : (
            <table className="min-w-full text-sm text-left text-gray-300">
              <thead className="bg-gray-800/50 text-xs uppercase text-gray-400 sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-semibold">Method</th>
                  <th className="px-6 py-3 font-semibold">API Path</th>
                  <th className="px-6 py-3 font-semibold text-right">
                    Avg (ms) ⏱️
                  </th>
                  <th className="px-6 py-3 font-semibold text-right">
                    Max (ms) 📈
                  </th>
                  <th className="px-6 py-3 font-semibold text-right">
                    Min (ms) 📉
                  </th>
                  <th className="px-6 py-3 font-semibold text-right">
                    Hits 📊
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {slowestRoutes.map((route, index) => {
                  const avgTime = route.avgResponseTime.toFixed(1);
                  // Color code based on performance
                  const getColor = (ms) => {
                    if (ms < 100) return 'text-green-400';
                    if (ms < 300) return 'text-yellow-400';
                    if (ms < 500) return 'text-orange-400';
                    return 'text-red-400';
                  };

                  const getMethodColor = (method) => {
                    const colors = {
                      GET: 'bg-blue-500/20 text-blue-300',
                      POST: 'bg-green-500/20 text-green-300',
                      PUT: 'bg-yellow-500/20 text-yellow-300',
                      DELETE: 'bg-red-500/20 text-red-300',
                      PATCH: 'bg-purple-500/20 text-purple-300'
                    };
                    return colors[method] || 'bg-gray-500/20 text-gray-300';
                  };

                  return (
                    <tr
                      key={`${route._id.method}-${route._id.path}`}
                      className="hover:bg-gray-800/30 transition"
                    >
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${getMethodColor(
                            route._id.method
                          )}`}
                        >
                          {route._id.method}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-gray-200 max-w-md truncate hover:text-clip" title={route._id.path}>
                        {route._id.path}
                      </td>
                      <td className={`px-6 py-3 text-right font-semibold ${getColor(avgTime)}`}>
                        {avgTime}
                      </td>
                      <td className="px-6 py-3 text-right text-orange-300">
                        {route.maxResponseTime.toFixed(1)}
                      </td>
                      <td className="px-6 py-3 text-right text-green-300">
                        {route.minResponseTime.toFixed(1)}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-xs font-semibold">
                          {route.count}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {slowestRoutes.length > 0 && (
          <div className="px-6 py-3 bg-gray-800/30 border-t border-white/5 text-xs text-gray-400">
            ℹ️ Showing top {slowestRoutes.length} slowest APIs (minimum 5 hits in period)
          </div>
        )}
      </section>

      {/* STATUS CODE DISTRIBUTION */}
      <section className="rounded-lg border border-white/10 bg-gray-900/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Status Code Distribution</h3>
        </div>

        <div className="overflow-x-auto">
          {requestStats.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">
              No request data available.
            </div>
          ) : (
            <table className="min-w-full text-sm text-left text-gray-300">
              <thead className="bg-gray-800/50 text-xs uppercase text-gray-400 sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-semibold">Status Code</th>
                  <th className="px-6 py-3 font-semibold text-right">Count</th>
                  <th className="px-6 py-3 font-semibold text-right">Avg Response Time (ms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requestStats.map((stat) => {
                  const getStatusColor = (code) => {
                    if (code >= 200 && code < 300) return 'text-green-400';
                    if (code >= 300 && code < 400) return 'text-blue-400';
                    if (code >= 400 && code < 500) return 'text-yellow-400';
                    return 'text-red-400';
                  };

                  return (
                    <tr key={stat._id} className="hover:bg-gray-800/30 transition">
                      <td className={`px-6 py-3 font-semibold ${getStatusColor(stat._id)}`}>
                        {stat._id}
                      </td>
                      <td className="px-6 py-3 text-right">{stat.count}</td>
                      <td className="px-6 py-3 text-right">
                        {stat.avgResponseTime.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Request Stats */}
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Request Status Distribution (7 days)</h3>
        
        {statsLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {logStats.requestStats?.map((stat, index) => (
              <div key={index} className="bg-gray-800/50 p-4 rounded">
                <p className="text-gray-400 text-sm mb-1">Status Code {stat._id}</p>
                <p className="text-2xl font-bold text-white">{stat.count}</p>
                <p className="text-gray-500 text-xs mt-1">Requests</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Console Stats */}
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Console Log Distribution (7 days)</h3>
        
        {statsLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {logStats.consoleStats?.map((stat, index) => (
              <div key={index} className="bg-gray-800/50 p-4 rounded">
                <p className="text-gray-400 text-sm mb-1 capitalize">{stat._id} Logs</p>
                <p className="text-2xl font-bold text-white">{stat.count}</p>
                <p className="text-gray-500 text-xs mt-1">Total</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {statsError && (
        <div className="bg-red-500/20 border border-red-500/50 rounded p-4">
          <p className="text-red-400">Error: {statsError}</p>
        </div>
      )}
    </div>
  );
}