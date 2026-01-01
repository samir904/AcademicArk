import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRetentionStatus } from '../../../REDUX/Slices/retention.slice';
import { UserGroupIcon } from '@heroicons/react/24/outline';

const RetentionStatus = () => {
  const dispatch = useDispatch();
  const { retentionStatus, retentionStatusLoading, retentionStatusError } = useSelector(
    state => state.retention
  );

  useEffect(() => {
    dispatch(getRetentionStatus());
  }, [dispatch]);

  if (retentionStatusLoading) {
    return (
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-8 text-center">
        <div className="animate-pulse text-gray-400">Loading retention status...</div>
      </div>
    );
  }

  if (retentionStatusError) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400">
        {retentionStatusError}
      </div>
    );
  }

  if (!retentionStatus) {
    return <div className="text-gray-400">No status data available</div>;
  }

  const statuses = [
    {
      key: 'highlyActive',
      label: 'Highly Active',
      color: 'bg-green-500/20 border-green-500',
      textColor: 'text-green-400',
      icon: '🔥',
      description: 'Logged in last 24h'
    },
    {
      key: 'active',
      label: 'Active',
      color: 'bg-blue-500/20 border-blue-500',
      textColor: 'text-blue-400',
      icon: '✅',
      description: 'Logged in last 7 days'
    },
    {
      key: 'atRisk',
      label: 'At Risk',
      color: 'bg-yellow-500/20 border-yellow-500',
      textColor: 'text-yellow-400',
      icon: '⚠️',
      description: 'No login 14+ days'
    },
    {
      key: 'churned',
      label: 'Churned',
      color: 'bg-red-500/20 border-red-500',
      textColor: 'text-red-400',
      icon: '❌',
      description: 'No login 30+ days'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">User Retention Status</h3>
        <p className="text-sm text-gray-400">
          Total Users: <span className="text-blue-400 font-semibold">{retentionStatus.totalUsers}</span>
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map(status => {
          const count = retentionStatus.byStatus?.[status.key] || 0;
          const percentage = retentionStatus.totalUsers > 0
            ? ((count / retentionStatus.totalUsers) * 100).toFixed(1)
            : 0;

          return (
            <div
              key={status.key}
              className={`${status.color} border rounded-lg p-4 space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{status.icon}</span>
                <p className={`text-sm ${status.textColor}`}>{percentage}%</p>
              </div>
              <p className="text-white font-semibold">{status.label}</p>
              <p className="text-2xl font-bold text-white">{count.toLocaleString()}</p>
              <p className="text-xs text-gray-400">{status.description}</p>
            </div>
          );
        })}
      </div>

      {/* Weekly Trend */}
      {retentionStatus.weeklyRetention && (
        <div className="mt-8 p-4 bg-gray-800/30 rounded-lg border border-white/5">
          <h4 className="text-white font-semibold mb-4">Weekly Retention Trend</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {retentionStatus.weeklyRetention.slice(-12).map((week, index) => (
              <div key={index} className="flex items-center justify-between">
                <p className="text-sm text-gray-400 w-20">{week.week}</p>
                <div className="flex-1 mx-4 bg-gray-700 rounded h-2">
                  <div
                    className="bg-blue-500 h-full rounded"
                    style={{ width: `${week.retention}%` }}
                  />
                </div>
                <p className="text-sm text-blue-400 font-semibold w-12">{week.retention}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RetentionStatus;
