import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLoginAnalytics, setAnalyticsTimeRange } from '../REDUX/Slices/loginLogsSlice';
import { CalendarIcon } from '@heroicons/react/24/outline';

const LoginAnalytics = () => {
  const dispatch = useDispatch();

  const {
    loginAnalytics,
    analyticsLoading,
    analyticsTimeRange,
  } = useSelector((state) => state.loginLogs);

  useEffect(() => {
    dispatch(getLoginAnalytics({ days: analyticsTimeRange }));
  }, [dispatch, analyticsTimeRange]);

  const handleTimeRangeChange = (days) => {
    dispatch(setAnalyticsTimeRange(days));
    dispatch(getLoginAnalytics({ days }));
  };

  if (analyticsLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!loginAnalytics) {
    return (
      <div className="text-center py-8 text-gray-400">
        No analytics data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[7, 30, 90].map((days) => (
          <button
            key={days}
            onClick={() => handleTimeRangeChange(days)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              analyticsTimeRange === days
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Last {days} days
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Logins */}
        <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
          <div className="text-gray-400 text-sm mb-2">Total Logins</div>
          <div className="text-3xl font-bold text-blue-400">
            {loginAnalytics?.totalLogins || 0}
          </div>
          <div className="text-gray-500 text-xs mt-2">
            Successful: {loginAnalytics?.successfulLogins || 0}
          </div>
        </div>

        {/* Failed Logins */}
        <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
          <div className="text-gray-400 text-sm mb-2">Failed Logins</div>
          <div className="text-3xl font-bold text-red-400">
            {loginAnalytics?.failedLogins || 0}
          </div>
          <div className="text-gray-500 text-xs mt-2">
            {loginAnalytics?.failureRate || 0}% failure rate
          </div>
        </div>

        {/* Unique Users */}
        <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
          <div className="text-gray-400 text-sm mb-2">Unique Users</div>
          <div className="text-3xl font-bold text-green-400">
            {loginAnalytics?.uniqueUsers || 0}
          </div>
          <div className="text-gray-500 text-xs mt-2">
            Average {loginAnalytics?.avgLoginsPerUser || 0} logins/user
          </div>
        </div>
      </div>

      {/* Browser Stats */}
      {loginAnalytics?.topBrowsers && (
        <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Top Browsers</h4>
          <div className="space-y-3">
            {loginAnalytics.topBrowsers.map((browser, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-gray-300">{browser.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${
                          (browser.count /
                            (loginAnalytics.topBrowsers?.count || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm w-12 text-right">
                    {browser.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OS Stats */}
      {loginAnalytics?.topOS && (
        <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Top Operating Systems</h4>
          <div className="space-y-3">
            {loginAnalytics.topOS.map((os, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-gray-300">{os.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${
                          (os.count / (loginAnalytics.topOS?.count || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm w-12 text-right">
                    {os.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* // Device Stats */}
{loginAnalytics?.topDevices && loginAnalytics.topDevices.length > 0 && (
  <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
    <h4 className="text-lg font-semibold text-white mb-4">Top Devices</h4>
    <div className="space-y-3">
      {loginAnalytics.topDevices.map((device, idx) => (
        <div key={idx} className="flex justify-between items-center">
          <span className="text-gray-300">
            {device.name === 'desktop'
              ? 'Desktop'
              : device.name === 'mobile'
              ? 'Mobile'
              : device.name === 'tablet'
              ? 'Tablet'
              : device.name || 'Unknown'}
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500"
                style={{
                  width: `${
                    (device.count /
                      (loginAnalytics.topDevices?.reduce(
                        (sum, d) => sum + d.count,
                        0
                      ) || 1)) * 100
                  }%`,
                }}
              />
            </div>
            <span className="text-gray-400 text-sm w-12 text-right">
              {device.count}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
};

export default LoginAnalytics;
