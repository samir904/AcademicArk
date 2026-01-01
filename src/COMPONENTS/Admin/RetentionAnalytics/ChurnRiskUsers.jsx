import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChurnRiskUsers } from '../../../REDUX/Slices/retention.slice';
import { ExclamationTriangleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const ChurnRiskUsers = () => {
  const dispatch = useDispatch();
  const { churnRiskUsers, churnRiskLoading, churnRiskError } = useSelector(
    state => state.retention
  );

  useEffect(() => {
    dispatch(getChurnRiskUsers({ limit: 50 }));
  }, [dispatch]);

  if (churnRiskLoading) {
    return (
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-8 text-center">
        <div className="animate-pulse text-gray-400">Loading at-risk users...</div>
      </div>
    );
  }

  if (churnRiskError) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400">
        {churnRiskError}
      </div>
    );
  }

  if (!churnRiskUsers?.users || churnRiskUsers.users.length === 0) {
    return (
      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-green-400">
        ✅ No users at risk of churning!
      </div>
    );
  }

  const getRiskLevel = (probability) => {
    const prob = parseFloat(probability);
    if (prob >= 75) return { label: 'Critical', color: 'bg-red-500/20 border-red-500 text-red-400' };
    if (prob >= 50) return { label: 'High', color: 'bg-orange-500/20 border-orange-500 text-orange-400' };
    if (prob >= 20) return { label: 'Medium', color: 'bg-yellow-500/20 border-yellow-500 text-yellow-400' };
    return { label: 'Low', color: 'bg-blue-500/20 border-blue-500 text-blue-400' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Users at Churn Risk</h3>
        <p className="text-sm text-gray-400">
          Total at risk: <span className="text-red-400 font-semibold">{churnRiskUsers.totalAtRisk}</span>
        </p>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-gray-900/50 border border-white/10 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Email</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-400">Risk Level</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-400">Churn %</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-400">Days Inactive</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-400">Engagement</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {churnRiskUsers.users.map((user) => {
              const risk = getRiskLevel(user.churnProbability);
              const engagement = parseInt(user.engagementScore);

              return (
                <tr key={user.userId} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-sm text-white font-medium">{user.userName}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{user.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${risk.color}`}>
                      {risk.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-red-400 font-bold">{user.churnProbability}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-400">
                    {user.daysSinceLastActivity} days
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-16 h-2 bg-gray-700 rounded">
                        <div
                          className={`h-full rounded ${
                            engagement > 60 ? 'bg-green-500' :
                            engagement > 30 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${engagement}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{engagement}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                      <EnvelopeIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChurnRiskUsers;
