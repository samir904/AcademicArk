import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminRequests, updateRequestStatus } from '../../REDUX/Slices/requestSlice';

export default function AdminRequests() {
  const dispatch = useDispatch();
  const { adminRequests, stats, loading, pagination } = useSelector((state) => state.request);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    dispatch(getAdminRequests({ status: statusFilter, page: 1 }));
  }, [dispatch, statusFilter]);

  const handleUpdateStatus = async (requestId, status, adminNotes = '') => {
    await dispatch(updateRequestStatus({ requestId, status, adminNotes }));
    dispatch(getAdminRequests({ status: statusFilter, page: 1 }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">User Requests</h2>
        <p className="text-blue-200">Manage student material requests</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-400">Pending</p>
            <p className="text-3xl font-bold text-yellow-400">{stats.PENDING}</p>
          </div>
          <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-400">In Progress</p>
            <p className="text-3xl font-bold text-blue-400">{stats.IN_PROGRESS}</p>
          </div>
          <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-400">Fulfilled</p>
            <p className="text-3xl font-bold text-green-400">{stats.FULFILLED}</p>
          </div>
          <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-400">Rejected</p>
            <p className="text-3xl font-bold text-red-400">{stats.REJECTED}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex space-x-3">
        {['PENDING', 'IN_PROGRESS', 'FULFILLED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {adminRequests.map((request) => (
          <div
            key={request._id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">
                    {request.requestType === 'NOTES' ? '📚' : request.requestType === 'PYQ' ? '📄' : '❓'}
                  </span>
                  <h3 className="text-xl font-bold text-white">{request.subject}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                    request.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                    request.status === 'FULFILLED' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>📖 Sem {request.semester}</span>
                  <span>🎓 {request.branch}</span>
                  <span>👤 {request.requestedBy?.fullName}</span>
                  <span>👍 {request.upvoteCount} upvotes</span>
                  <span>📅 {new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
                {request.description && (
                  <p className="text-gray-300 mt-2 text-sm">{request.description}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              {request.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(request._id, 'IN_PROGRESS')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(request._id, 'FULFILLED')}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                  >
                    Mark Fulfilled
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(request._id, 'REJECTED', 'Not available')}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                  >
                    Reject
                  </button>
                </>
              )}
              {request.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => handleUpdateStatus(request._id, 'FULFILLED')}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                >
                  Mark Fulfilled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}