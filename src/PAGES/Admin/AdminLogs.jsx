// src/PAGES/Admin/AdminLogs.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminLogs } from '../../REDUX/Slices/adminSlice';

const AdminLogs = () => {
  const dispatch = useDispatch();
  const { adminLogs = [], adminLogsPagination = {}, loading } = useSelector(state => state.admin);
  const [days, setDays] = useState(7);
  const [actionFilter, setActionFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAdminLogs({ days, action: actionFilter, page }));
  }, [dispatch, days, actionFilter, page]);

  const actionColors = {
    DELETE_USER: 'bg-red-500/10 text-red-400',
    DELETE_NOTE: 'bg-orange-500/10 text-orange-400',
    UPDATE_ROLE: 'bg-blue-500/10 text-blue-400',
    CREATE_BANNER: 'bg-green-500/10 text-green-400',
  };

  const actionIcons = {
    DELETE_USER: '👤',
    DELETE_NOTE: '📝',
    UPDATE_ROLE: '👥',
    CREATE_BANNER: '📢',
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Days Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Time Period</label>
            <select 
              value={days} 
              onChange={(e) => { setDays(Number(e.target.value)); setPage(1); }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            >
              <option value={1}>Last 24 Hours</option>
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </div>

          {/* Action Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Action Type</label>
            <select 
              value={actionFilter} 
              onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Actions</option>
              <option value="DELETE_USER">Delete User</option>
              <option value="DELETE_NOTE">Delete Note</option>
              <option value="UPDATE_ROLE">Update Role</option>
              <option value="CREATE_BANNER">Create Banner</option>
            </select>
          </div>

          {/* Total logs info */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Statistics</label>
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
              Total: <span className="font-bold text-blue-400">{adminLogsPagination?.total || 0}</span> logs
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Action</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Admin</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Target</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    Loading logs...
                  </td>
                </tr>
              ) : adminLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    No admin logs found
                  </td>
                </tr>
              ) : (
                adminLogs.map((log) => (
                  <tr key={log._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${actionColors[log.action] || 'bg-gray-700 text-gray-300'}`}>
                        {actionIcons[log.action]} {log.action.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{log.adminName}</p>
                        <p className="text-xs text-gray-500">{log.adminId?.email || 'Unknown'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white">{log.targetName || `${log.targetType} #${log.targetId.slice(-6)}`}</p>
                        <p className="text-xs text-gray-500">{log.targetType}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        log.status === 'SUCCESS' 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {adminLogsPagination?.pages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button 
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-400">
            Page {page} of {adminLogsPagination.pages}
          </span>
          <button 
            onClick={() => setPage(Math.min(adminLogsPagination.pages, page + 1))}
            disabled={page === adminLogsPagination.pages}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminLogs;