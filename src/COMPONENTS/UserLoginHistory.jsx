import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyLoginHistory, logoutFromDevice } from '../REDUX/Slices/loginLogsSlice';
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const UserLoginHistory = () => {
  const dispatch = useDispatch();

  const {
    loginHistory,
    loginHistoryLoading,
    loginHistoryPagination,
    logoutDeviceLoading,
  } = useSelector((state) => state.loginLogs);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getMyLoginHistory({ page, limit: 10 }));
  }, [dispatch, page]);

  const handleLogoutDevice = (sessionId) => {
    if (window.confirm('Logout from this device?')) {
      dispatch(logoutFromDevice(sessionId)).then(() => {
        dispatch(getMyLoginHistory({ page: 1, limit: 10 }));
      });
    }
  };

  const getDeviceIcon = (device) => {
    if (device?.toLowerCase().includes('mobile')) {
      return <DevicePhoneMobileIcon className="w-5 h-5 text-blue-400" />;
    }
    return <ComputerDesktopIcon className="w-5 h-5 text-gray-400" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Login History</h3>

      {loginHistoryLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : loginHistory.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No login history available</p>
      ) : (
        <div className="space-y-4">
          {loginHistory.map((log) => (
            <div
              key={log._id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                {getDeviceIcon(log.device)}
                <div className="flex-1">
                  <div className="text-white font-medium">
                    {log.browser?.name} on {log.os?.name}
                  </div>
                  <div className="text-gray-400 text-sm flex items-center space-x-2 mt-1">
                    <GlobeAltIcon className="w-4 h-4" />
                    <span>{log.ipAddress}</span>
                    <span className="text-gray-500">•</span>
                    <span>{log.location}</span>
                  </div>
                  <div className="text-gray-500 text-xs mt-2">
                    {formatDate(log.loginTime)} ({getTimeAgo(log.loginTime)})
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleLogoutDevice(log._id)}
                disabled={logoutDeviceLoading}
                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {loginHistoryPagination && loginHistoryPagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-800 text-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-400 py-1">
            Page {page} of {loginHistoryPagination.pages}
          </span>
          <button
            onClick={() =>
              setPage(Math.min(loginHistoryPagination.pages, page + 1))
            }
            disabled={page === loginHistoryPagination.pages}
            className="px-3 py-1 rounded bg-gray-800 text-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserLoginHistory;
