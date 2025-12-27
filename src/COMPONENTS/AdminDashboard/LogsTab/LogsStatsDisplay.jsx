import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLogStats } from '../../../REDUX/Slices/logsSlice';

export default function LogsStatsDisplay() {
  const dispatch = useDispatch();
  const { logStats, statsLoading, statsError } = useSelector(state => state.logs);

  useEffect(() => {
    dispatch(getLogStats(7)); // Last 7 days
  }, [dispatch]);

  return (
    <div className="space-y-6">
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
