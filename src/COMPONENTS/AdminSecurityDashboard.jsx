import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getLoginsByDeviceStats,
  getLoginsByBrowserStats,
  getSuspiciousLoginsData,
} from '../REDUX/Slices/loginLogsSlice';
// import { ExclamationIcon, ShieldCheckIcon, DesktopComputerIcon, GlobeIcon } from '@heroicons/react/24/outline';
import {
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

const AdminSecurityDashboard = () => {
  const dispatch = useDispatch();
  const [timeRange, setTimeRange] = useState(30);

  const {
    deviceStats,
    deviceStatsLoading,
    browserStats,
    browserStatsLoading,
    suspiciousLogins,
    suspiciousLoginsLoading,
  } = useSelector((state) => state.loginLogs);

  useEffect(() => {
    // Load all data
    dispatch(getLoginsByDeviceStats({ days: timeRange }));
    dispatch(getLoginsByBrowserStats({ days: timeRange }));
    dispatch(getSuspiciousLoginsData());
  }, [dispatch, timeRange]);

  const handleTimeRangeChange = (days) => {
    setTimeRange(days);
  };

  // Utility to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate max count for progress bars
  const maxDeviceCount = Math.max(...(deviceStats?.map(d => d.count) || [1]));
  const maxBrowserCount = Math.max(...(browserStats?.map(b => b.count) || [1]));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Security Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor login activity and suspicious behavior</p>
        </div>
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => handleTimeRangeChange(days)}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                timeRange === days
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Alert - Suspicious Activity */}
      {suspiciousLogins?.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-red-300 font-semibold">⚠️ Suspicious Activity Detected</h3>
            <p className="text-red-400 text-sm mt-1">
              {suspiciousLogins.length} failed login attempts in the last 24 hours
            </p>
          </div>
        </div>
      )}

      {/* Device Stats */}
      <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <ComputerDesktopIcon className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Login by Device
          </h3>
          <span className="text-xs text-gray-400 ml-auto">
            Last {timeRange} days
          </span>
        </div>

        {deviceStatsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : deviceStats?.length === 0 ? (
          <p className="text-gray-400 py-4">No device data available</p>
        ) : (
          <div className="space-y-4">
            {deviceStats.map((device) => (
              <div key={device._id || 'unknown'} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 capitalize font-medium">
                    {device._id === 'unknown' ? 'Unknown Device' : device._id}
                  </span>
                  <span className="text-blue-400 font-semibold">{device.count}</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${(device.count / maxDeviceCount) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  Last login: {formatDate(device.lastLogin)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Browser Stats */}
      <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <GlobeAltIcon className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">
            Login by Browser
          </h3>
          <span className="text-xs text-gray-400 ml-auto">
            Last {timeRange} days
          </span>
        </div>

        {browserStatsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : browserStats?.length === 0 ? (
          <p className="text-gray-400 py-4">No browser data available</p>
        ) : (
          <div className="space-y-4">
            {browserStats.map((browser) => (
              <div key={browser._id || 'unknown'} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">
                    {browser._id || 'Unknown Browser'}
                  </span>
                  <span className="text-green-400 font-semibold">{browser.count}</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${(browser.count / maxBrowserCount) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  Last login: {formatDate(browser.lastLogin)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suspicious Logins */}
      <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-semibold text-white">
            Suspicious Logins
          </h3>
          <span className="text-xs text-gray-400 ml-auto">
            Last 24 hours
          </span>
        </div>

        {suspiciousLoginsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div>
          </div>
        ) : suspiciousLogins?.length === 0 ? (
          <div className="py-8 text-center">
            <ShieldCheckIcon className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="text-gray-400">No suspicious activity detected</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {suspiciousLogins.map((log, idx) => (
              <div
                key={log._id}
                className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-red-300">
                      {log.userId?.fullName || 'Unknown User'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {log.userId?.email}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatDate(log.loginTime)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mt-2">
                  <div>
                    <span className="text-gray-500">IP:</span> {log.ipAddress}
                  </div>
                  <div>
                    <span className="text-gray-500">Browser:</span> {log.browser?.name || 'Unknown'}
                  </div>
                  <div>
                    <span className="text-gray-500">OS:</span> {log.os?.name || 'Unknown'}
                  </div>
                  <div>
                    <span className="text-gray-500">Device:</span> {log.device || 'Unknown'}
                  </div>
                </div>
                {log.failureReason && (
                  <div className="mt-2 p-2 bg-red-500/10 rounded text-xs text-red-300">
                    <strong>Reason:</strong> {log.failureReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSecurityDashboard;