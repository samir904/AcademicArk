import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllLoginLogs } from '../REDUX/Slices/loginLogsSlice';
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';


const LoginLogsDisplay = () => {
  const dispatch = useDispatch();

  const {
    allLoginLogs,
    allLogsPagination,
    allLogsLoading,
    allLogsError,
  } = useSelector((state) => state.loginLogs);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: 'success',
  });

  const [searchEmail, setSearchEmail] = useState('');

  // ============================================
  // FETCH LOGS
  // ============================================

  useEffect(() => {
    dispatch(
      getAllLoginLogs({
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
      })
    );
  }, [dispatch, filters]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleStatusChange = (status) => {
    setFilters({ ...filters, status, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  // ============================================
  // GET DEVICE ICON
  // ============================================

  const getDeviceIcon = (device) => {
    const iconClass = 'w-5 h-5';

    if (device?.toLowerCase().includes('mobile') || device?.toLowerCase().includes('iphone')) {
      return <DevicePhoneMobileIcon className={`${iconClass} text-blue-400`} />;
    } else if (device?.toLowerCase().includes('tablet')) {
      return <DevicePhoneMobileIcon className={`${iconClass} text-purple-400`} />;
    }
    return <ComputerDesktopIcon className={`${iconClass} text-gray-400`} />;
  };

  // ============================================
  // GET STATUS BADGE
  // ============================================

  const getStatusBadge = (status) => {
    if (status === 'success') {
      return (
        <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400">
          <CheckCircleIcon className="w-4 h-4" />
          <span className="text-xs font-semibold">Success</span>
        </div>
      );
    } else if (status === 'failed') {
      return (
        <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400">
          <XCircleIcon className="w-4 h-4" />
          <span className="text-xs font-semibold">Failed</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-500/20 text-gray-400">
        <span className="text-xs font-semibold">Pending</span>
      </div>
    );
  };

  // ============================================
  // FORMAT DATE
  // ============================================

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
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  // ============================================
  // GET LOCATION STRING - FIX FOR OBJECT
  // ============================================

  const getLocationString = (location) => {
    if (!location) return 'Unknown Location';
    
    // Handle both object and string formats
    if (typeof location === 'string') {
      return location;
    }

    if (location.city && location.country) {
      return `${location.city}, ${location.country}`;
    }

    if (location.city) return location.city;
    if (location.country) return location.country;
    if (location.region) return location.region;
    
    return 'Unknown Location';
  };

  // ============================================
  // FILTER LOGS
  // ============================================

  const filteredLogs = allLoginLogs.filter((log) => {
    if (!searchEmail) return true;
    return (
      log.userId?.email?.toLowerCase().includes(searchEmail.toLowerCase()) ||
      log.userId?.fullName?.toLowerCase().includes(searchEmail.toLowerCase())
    );
  });

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">User Login Logs</h2>
        <p className="text-gray-400">
          Monitor all user login activities across the platform
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/20 rounded-xl p-4">
          <div className="text-gray-400 text-sm mb-1">Total Logins</div>
          <div className="text-3xl font-bold text-blue-400">
            {allLogsPagination?.total || 0}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/20 rounded-xl p-4">
          <div className="text-gray-400 text-sm mb-1">Successful</div>
          <div className="text-3xl font-bold text-green-400">
            {allLoginLogs.filter(log => log.status === 'success').length}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-500/20 rounded-xl p-4">
          <div className="text-gray-400 text-sm mb-1">Failed Attempts</div>
          <div className="text-3xl font-bold text-red-400">
            {allLoginLogs.filter(log => log.status === 'failed').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="success">Successful</option>
              <option value="failed">Failed</option>
              <option value="">All</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Per Page
            </label>
            <select
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 })}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search User
            </label>
            <input
              type="text"
              placeholder="Email or name..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Error State */}
      {allLogsError && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 text-red-400">
          {allLogsError}
        </div>
      )}

      {/* Loading State */}
      {allLogsLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
          <CalendarIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No login logs found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-white/10">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                      User
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                      Device
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                      Browser
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                      IP Address
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                      Login Time
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log._id}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {log.userId?.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">
                              {log.userId?.fullName || 'Unknown'}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {log.userId?.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getDeviceIcon(log.device)}
                          <span className="text-white text-sm">
                            {log.device || 'Unknown'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-white text-sm">
                          {log.browser?.name || 'Unknown'}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {log.os?.name || 'Unknown OS'}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-white font-mono text-sm">
                          {log.ipAddress || 'N/A'}
                        </div>
                        {/* ✅ FIXED - Now renders location string properly */}
                        <div className="text-gray-400 text-xs flex items-center space-x-1 mt-1">
                          <GlobeAltIcon className="w-3 h-3" />
                          <span>{getLocationString(log.location)}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-white text-sm">
                          {formatDate(log.loginTime)}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {getTimeAgo(log.loginTime)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {getStatusBadge(log.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log._id}
                className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {log.userId?.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {log.userId?.fullName}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {log.userId?.email}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(log.status)}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Device:</span>
                    <span className="text-white">{log.device}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Browser:</span>
                    <span className="text-white">{log.browser?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">IP:</span>
                    <span className="text-white font-mono text-xs">
                      {log.ipAddress}
                    </span>
                  </div>
                  {/* ✅ FIXED - Mobile location display */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white text-xs">
                      {getLocationString(log.location)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-white">{getTimeAgo(log.loginTime)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {allLogsPagination && allLogsPagination.pages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <div className="text-gray-400 text-sm">
                Page {allLogsPagination.currentPage} of {allLogsPagination.pages}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, filters.page - 1))
                  }
                  disabled={filters.page === 1}
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-1">
                  {Array.from(
                    { length: Math.min(5, allLogsPagination.pages) },
                    (_, i) => {
                      const pageNum = Math.max(1, filters.page - 2) + i;
                      if (pageNum > allLogsPagination.pages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg ${
                            filters.page === pageNum
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() =>
                    handlePageChange(
                      Math.min(allLogsPagination.pages, filters.page + 1)
                    )
                  }
                  disabled={filters.page === allLogsPagination.pages}
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoginLogsDisplay;
