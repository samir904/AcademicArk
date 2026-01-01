import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEngagementMetrics } from '../../../REDUX/Slices/retention.slice';
// import { FireIcon, TrendingUpIcon } from '@heroicons/react/24/outline';

const EngagementMetrics = () => {
  const dispatch = useDispatch();
  const { engagement, engagementLoading, engagementError } = useSelector(
    state => state.retention
  );

  useEffect(() => {
    dispatch(getEngagementMetrics());
  }, [dispatch]);

  if (engagementLoading) {
    return (
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-8 text-center">
        <div className="animate-pulse text-gray-400">Loading metrics...</div>
      </div>
    );
  }

  if (engagementError) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400">
        {engagementError}
      </div>
    );
  }

  if (!engagement) {
    return <div className="text-gray-400">No engagement data available</div>;
  }

  const metrics = [
    {
      label: 'Avg Engagement Score',
      value: parseFloat(engagement.averages?.engagementScore || 0).toFixed(1),
      unit: '/100',
      icon: '🎯',
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Avg Logins',
      value: parseFloat(engagement.averages?.logins || 0).toFixed(1),
      unit: 'times',
      icon: '📱',
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Avg Downloads',
      value: parseFloat(engagement.averages?.downloads || 0).toFixed(1),
      unit: 'files',
      icon: '⬇️',
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Avg Note Views',
      value: parseFloat(engagement.averages?.noteViews || 0).toFixed(1),
      unit: 'views',
      icon: '👁️',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${metric.color} p-6 rounded-lg space-y-2 transform hover:scale-105 transition-transform`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{metric.icon}</span>
              <p className="text-xs text-white/70 uppercase tracking-wider">Average</p>
            </div>
            <p className="text-white/70 text-sm">{metric.label}</p>
            <p className="text-4xl font-bold text-white">
              {metric.value}
              <span className="text-lg ml-1">{metric.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Distribution */}
      {engagement.retentionDistribution && (
        <div className="p-6 bg-gray-900/50 border border-white/10 rounded-lg space-y-4">
          <h4 className="text-white font-bold text-lg">User Engagement Distribution</h4>
          <div className="space-y-3">
            {Object.entries(engagement.retentionDistribution).map(([key, data]) => {
              const labels = {
                highlyActive: { label: '🔥 Highly Active', color: 'bg-green-500' },
                active: { label: '✅ Active', color: 'bg-blue-500' },
                atRisk: { label: '⚠️ At Risk', color: 'bg-yellow-500' },
                churned: { label: '❌ Churned', color: 'bg-red-500' }
              };

              const labelData = labels[key];
              if (!labelData) return null;

              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400">{labelData.label}</span>
                    <span className="text-sm font-semibold text-white">
                      {data.count} ({parseFloat(data.percentage).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`${labelData.color} h-full rounded-full`}
                      style={{ width: `${parseFloat(data.percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementMetrics;
