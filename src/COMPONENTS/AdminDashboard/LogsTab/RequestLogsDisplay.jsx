import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRequestLogs, setRequestFilters, setRequestPage, deleteRequestLog, deleteOldRequestLogs } from '../../../REDUX/Slices/logsSlice';
import { formatDistanceToNow } from 'date-fns';

export default function RequestLogsDisplay() {
  const dispatch = useDispatch();
  const { requestLogs, requestLogsPagination, requestLoading, requestError, requestFilters } = useSelector(state => state.logs);
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [deleteAge, setDeleteAge] = useState(7);

  useEffect(() => {
    dispatch(getRequestLogs(requestFilters));
  }, [dispatch, requestFilters]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'status') {
      setStatusFilter(value);
      dispatch(setRequestFilters({ statusCode: value }));
    } else if (filterType === 'method') {
      setMethodFilter(value);
      dispatch(setRequestFilters({ method: value }));
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setRequestPage(newPage));
  };

  const handleDeleteLog = (logId) => {
    if (window.confirm('Delete this log? This action cannot be undone.')) {
      dispatch(deleteRequestLog(logId));
    }
  };

  const handleDeleteOldLogs = () => {
    if (window.confirm(`Delete all request logs older than ${deleteAge} days?`)) {
      dispatch(deleteOldRequestLogs(deleteAge)).then(() => {
        dispatch(getRequestLogs(requestFilters));
      });
    }
  };

  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-400';
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-400';
    if (statusCode >= 500) return 'text-red-400';
    return 'text-blue-400';
  };

  const getMethodColor = (method) => {
    const colors = {
      'GET': 'bg-blue-500/20 text-blue-400',
      'POST': 'bg-green-500/20 text-green-400',
      'PUT': 'bg-yellow-500/20 text-yellow-400',
      'DELETE': 'bg-red-500/20 text-red-400',
      'PATCH': 'bg-purple-500/20 text-purple-400'
    };
    return colors[method] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Filters and Delete Controls */}
      <div className="bg-gray-900/50 p-4 rounded-lg border border-white/10 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Filters & Actions</h3>
          
          {/* Delete Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDeleteMenu(!showDeleteMenu)}
              className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 rounded transition"
            >
              🗑️ Delete Logs
            </button>
            
            {showDeleteMenu && (
              <div className="absolute right-0 mt-2 bg-gray-800 border border-white/10 rounded shadow-lg z-10 w-60 p-4 space-y-3">
                <p className="text-sm text-gray-300">Delete logs older than:</p>
                
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={deleteAge}
                    onChange={(e) => setDeleteAge(parseInt(e.target.value))}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                  <span className="text-gray-400 py-2">days</span>
                </div>
                
                <button
                  onClick={handleDeleteOldLogs}
                  className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                >
                  Confirm Delete
                </button>
                
                <button
                  onClick={() => setShowDeleteMenu(false)}
                  className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Method Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">HTTP Method</label>
            <select
              value={methodFilter}
              onChange={(e) => handleFilterChange('method', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>

          {/* Status Code Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status Code</label>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="200">200 - OK</option>
              <option value="201">201 - Created</option>
              <option value="400">400 - Bad Request</option>
              <option value="401">401 - Unauthorized</option>
              <option value="404">404 - Not Found</option>
              <option value="500">500 - Server Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {requestLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full"></div>
          </div>
          <p className="text-gray-400 mt-2">Processing...</p>
        </div>
      )}

      {/* Error State */}
      {requestError && (
        <div className="bg-red-500/20 border border-red-500/50 rounded p-4">
          <p className="text-red-400">Error: {requestError}</p>
        </div>
      )}

      {/* Logs Table */}
      {!requestLoading && requestLogs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Method</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Path</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Response Time</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">User</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">IP Address</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Timestamp</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {requestLogs.map((log, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getMethodColor(log.method)}`}>
                      {log.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 font-mono text-xs">{log.path}</td>
                  <td className={`px-4 py-3 font-semibold ${getStatusColor(log.statusCode)}`}>
                    {log.statusCode}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{log.responseTime}ms</td>
                  <td className="px-4 py-3 text-gray-400">{log.userEmail || 'Anonymous'}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{log.ipAddress}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteLog(log._id)}
                      className="px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded text-xs transition"
                      title="Delete this log"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!requestLoading && requestLogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No request logs found</p>
        </div>
      )}

      {/* Pagination */}
      {requestLogsPagination && requestLogsPagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(requestLogsPagination.currentPage - 1)}
            disabled={requestLogsPagination.currentPage === 1}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white"
          >
            Previous
          </button>
          
          <span className="text-gray-400">
            Page {requestLogsPagination.currentPage} of {requestLogsPagination.pages}
          </span>
          
          <button
            onClick={() => handlePageChange(requestLogsPagination.currentPage + 1)}
            disabled={requestLogsPagination.currentPage === requestLogsPagination.pages}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
