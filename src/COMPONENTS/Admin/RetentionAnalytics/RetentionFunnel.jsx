import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRetentionFunnel } from '../../../REDUX/Slices/retention.slice';
import { ArrowDownIcon, UsersIcon } from '@heroicons/react/24/outline';

const RetentionFunnel = () => {
  const dispatch = useDispatch();
  const { funnel, funnelLoading, funnelError } = useSelector(state => state.retention);

  useEffect(() => {
    dispatch(getRetentionFunnel());
  }, [dispatch]);

  if (funnelLoading) {
    return (
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-8 text-center">
        <div className="animate-pulse text-gray-400">Loading retention funnel...</div>
      </div>
    );
  }

  if (funnelError) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400">
        {funnelError}
      </div>
    );
  }

  if (!funnel?.funnel || funnel.funnel.length === 0) {
    return <div className="text-gray-400">No funnel data available</div>;
  }

  const stages = funnel.funnel;

  // Helper function to safely calculate percentage
  const calculatePercentage = (completed, total) => {
    if (!total || total === 0) return 0;
    return (completed / total) * 100;
  };

  // Helper function to safely get value
  const safeGet = (value, defaultValue = 0) => {
    return value !== undefined && value !== null ? value : defaultValue;
  };
  const safeGetFloat = (value, defaultValue = 0) => {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2">7-Stage Retention Funnel</h3>
        <p className="text-sm text-gray-400">
          Total Users: <span className="text-blue-400 font-semibold">{safeGet(funnel.totalUsers, 0)}</span>
        </p>
      </div>

      {/* Stages */}
      <div className="space-y-4">
        {stages.map((stage, index) => {
          // Calculate percentage - use stage.percentage if available, otherwise calculate
          const percentage = stage.percentage || calculatePercentage(
            safeGet(stage.usersCompleted, 0), 
            safeGet(funnel.totalUsers, 0)
          );
          const usersCompleted = safeGet(stage.usersCompleted, 0);
          const dropoff = safeGet(stage.dropoffFromPrevious, 0);
          const avgDays = safeGet(stage.avgDaysSinceRegistration, 0);

          return (
            <div key={stage.stage} className="space-y-2">
              {/* Stage Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                    <span className="text-blue-400 font-bold text-sm">{stage.stage}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{stage.name || 'Stage'}</p>
                    <p className="text-xs text-gray-400">
                      {avgDays > 0 && `Avg: ${avgDays.toFixed(1)} days`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{usersCompleted.toLocaleString()}</p>
                  <p className="text-sm text-blue-400">{percentage.toFixed(1)}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              {/* Dropoff Info */}
              {dropoff > 0 && (
                <div className="flex items-center space-x-2 text-xs text-red-400">
                  <ArrowDownIcon className="w-4 h-4" />
                  <span>{dropoff.toFixed(1)}% dropped off</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {funnel.summary && (
        <div className="mt-8 grid grid-cols-3 gap-4 p-4 bg-gray-800/30 rounded-lg border border-white/5">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Reg → First Login</p>
            <p className="text-xl font-bold text-blue-400">
              {safeGetFloat(funnel.summary.registrationToFirstLogin, 0).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Reg → First Download</p>
            <p className="text-xl font-bold text-blue-400">
              {safeGetFloat(funnel.summary.registrationToFirstDownload, 0).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Reg → Sustained</p>
            <p className="text-xl font-bold text-blue-400">
              {safeGetFloat(funnel.summary.registrationToSustainedEngagement, 0).toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetentionFunnel;
