import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserIPsData,
  getMyLoginHistory,
} from '../REDUX/Slices/loginLogsSlice';
import {
  ShieldCheckIcon,
  MapPinIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const UserSecurityPage = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const {
    userIPs,
    userIPsLoading,
    loginHistory,
    loginHistoryLoading,
  } = useSelector((state) => state.loginLogs);

  useEffect(() => {
    dispatch(getUserIPsData());
    dispatch(getMyLoginHistory({ page, limit: 15 }));
  }, [dispatch, page]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'desktop':
        return <ComputerDesktopIcon className="w-5 h-5" />;
      case 'mobile':
        return <DevicePhoneMobileIcon className="w-5 h-5" />;
      case 'tablet':
        return <DevicePhoneMobileIcon className="w-5 h-5" />;
      default:
        return <GlobeAltIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Security & Privacy</h1>
        <p className="text-gray-400 mt-1">Review your login locations and activity</p>
      </div>

      {/* Your Login Locations */}
      <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPinIcon className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-semibold text-white">Your Login Locations</h2>
        </div>

        {userIPsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : userIPs?.length === 0 ? (
          <div className="py-12 text-center">
            <ShieldCheckIcon className="w-16 h-16 text-green-500 mx-auto mb-3 opacity-50" />
            <p className="text-gray-400 text-lg">No login history yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userIPs.map((ip) => (
              <div
                key={ip._id}
                className="p-5 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-white/5 rounded-lg hover:border-white/10 transition-all"
              >
                {/* IP Address - Main */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-mono text-lg text-blue-400 font-semibold">
                      {ip._id}
                    </div>
                    {ip.location?.city && (
                      <div className="text-sm text-gray-400 mt-1">
                        📍 {ip.location.city}, {ip.location.region || ''}, {ip.location.country}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{ip.count}</div>
                    <div className="text-xs text-gray-500">logins</div>
                  </div>
                </div>

                {/* Device Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  {/* Device Type */}
                  <div className="flex items-center gap-2 p-2 bg-gray-900/50 rounded">
                    <div className="text-purple-400">
                      {getDeviceIcon(ip.device)}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Device</div>
                      <div className="text-sm text-gray-300 capitalize">
                        {ip.device === 'unknown' ? 'Unknown' : ip.device}
                      </div>
                    </div>
                  </div>

                  {/* Browser */}
                  <div className="flex items-center gap-2 p-2 bg-gray-900/50 rounded">
                    <div className="text-blue-400">🌐</div>
                    <div>
                      <div className="text-xs text-gray-500">Browser</div>
                      <div className="text-sm text-gray-300">
                        {ip.browser || 'Unknown'}
                      </div>
                    </div>
                  </div>

                  {/* OS */}
                  <div className="flex items-center gap-2 p-2 bg-gray-900/50 rounded">
                    <div className="text-green-400">🖥️</div>
                    <div>
                      <div className="text-xs text-gray-500">Operating System</div>
                      <div className="text-sm text-gray-300">
                        {ip.os || 'Unknown'}
                      </div>
                    </div>
                  </div>

                  {/* Last Login */}
                  <div className="flex items-center gap-2 p-2 bg-gray-900/50 rounded">
                    <div className="text-orange-400">⏱️</div>
                    <div>
                      <div className="text-xs text-gray-500">Last Login</div>
                      <div className="text-sm text-gray-300">
                        {ip.lastLogin ? formatDate(ip.lastLogin) : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timezone (if available) */}
                {ip.location?.timezone && (
                  <div className="text-xs text-gray-500 mt-2">
                    Timezone: {ip.location.timezone}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Login History */}
      <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheckIcon className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-semibold text-white">Recent Login Activity</h2>
        </div>

        {loginHistoryLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : loginHistory?.length === 0 ? (
          <p className="text-gray-400 py-8 text-center">No recent login activity</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loginHistory.map((log) => (
              <div
                key={log._id}
                className={`p-4 rounded-lg border transition-all ${
                  log.status === 'success'
                    ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10'
                    : 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {log.status === 'success' ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                    ) : (
                      <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                    )}
                    <div>
                      <span className="font-medium text-gray-300">
                        {log.status === 'success' ? 'Successful Login' : 'Failed Login'}
                      </span>
                      <div className="text-sm text-gray-500">
                        {log.ipAddress} • {log.device}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {formatDate(log.loginTime)}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-3">
                  <span>🌐 {log.browser?.name || 'Unknown'}</span>
                  <span>🖥️ {log.os?.name || 'Unknown'}</span>
                  {log.loginMethod && <span>🔐 {log.loginMethod}</span>}
                </div>

                {log.status === 'failed' && log.failureReason && (
                  <div className="mt-2 text-xs text-red-300">
                    Reason: {log.failureReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Tips */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-3">Security Tips</h3>
        <ul className="space-y-2 text-sm text-blue-200">
          <li>✓ Regularly review your login locations for unusual IPs.</li>
          <li>✓ Log out from devices you don't recognize.</li>
          <li>✓ Use strong, unique passwords for your account.</li>
          <li>✓ Enable two-factor authentication if available.</li>
          <li>✓ Keep your browser and operating system up to date.</li>
        </ul>
      </div>
    </div>
  );
};

export default UserSecurityPage;