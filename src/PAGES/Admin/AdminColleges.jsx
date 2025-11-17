import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { approveCustomCollege, getAcademicAnalytics } from '../../REDUX/Slices/academicProfileSlice';

const AdminColleges = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.academicProfile);
  const [pendingColleges, setPendingColleges] = useState([]);

  useEffect(() => {
    dispatch(getAcademicAnalytics());
  }, [dispatch]);

  useEffect(() => {
    if (analytics?.pendingCustomColleges) {
      setPendingColleges(analytics.pendingCustomColleges);
    }
  }, [analytics]);

  const handleApproveCollege = (collegeName) => {
    if (window.confirm(`Approve college: "${collegeName}"?`)) {
      dispatch(approveCustomCollege(collegeName)).then((result) => {
        if (result.payload) {
          // Refresh analytics
          dispatch(getAcademicAnalytics());
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">College Approvals</h2>
        <p className="text-blue-200">Approve custom colleges submitted by users</p>
      </div>

      {/* Pending Colleges */}
      {pendingColleges.length > 0 ? (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Pending Approvals ({pendingColleges.length})
          </h3>

          <div className="space-y-3">
            {pendingColleges.map((college, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition"
              >
                <div>
                  <p className="text-white font-medium">{college.college}</p>
                  <p className="text-gray-400 text-sm">
                    {college.count} user{college.count > 1 ? 's' : ''} submitted
                  </p>
                </div>
                <button
                  onClick={() => handleApproveCollege(college.college)}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg font-medium transition"
                >
                  {loading ? 'Approving...' : 'Approve'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-gray-400">✅ No pending college approvals</p>
        </div>
      )}

      {/* Approved Colleges */}
      {analytics?.collegeDistribution && (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Approved Colleges ({analytics.collegeDistribution.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400">College</th>
                  <th className="text-left py-3 px-4 text-gray-400">Users</th>
                  <th className="text-left py-3 px-4 text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.collegeDistribution.map((college, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white">{college.college}</td>
                    <td className="py-3 px-4 text-blue-400 font-medium">{college.count}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          college.isPredefined
                            ? 'bg-blue-500/20 text-blue-400'
                            : college.isApproved
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {college.isPredefined
                          ? 'Predefined'
                          : college.isApproved
                          ? '✓ Approved'
                          : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminColleges;
