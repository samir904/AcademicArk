// Components/Admin/Tabs/RetentionTab.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRetentionMetrics,
  getChurnAnalysis,
  getUserLifetimeValue,
  getAllCohorts,
  getCohortDetails
} from '../../REDUX/Slices/adminSlice';

function RetentionTab() {
  const dispatch = useDispatch();
  const {
    retentionMetrics,
    churnAnalysis,
    ltv,
    cohorts,
    selectedCohort,
    retentionLoading
  } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(getRetentionMetrics());
    dispatch(getChurnAnalysis(30));
    dispatch(getUserLifetimeValue());
    dispatch(getAllCohorts());
  }, [dispatch]);

  if (retentionLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-400">Loading retention metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Retention Rate */}
        <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-500/30 rounded-lg p-6 hover:border-green-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Retention Rate</h3>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-4xl font-bold text-green-400">
            {retentionMetrics?.retentionRate || '0%'}
          </p>
          <p className="text-xs text-gray-500 mt-2">Users retained from last month</p>
        </div>

        {/* Churn Rate */}
        <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-500/30 rounded-lg p-6 hover:border-red-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Churn Rate</h3>
            <span className="text-2xl">📉</span>
          </div>
          <p className="text-4xl font-bold text-red-400">
            {retentionMetrics?.churnRate || '0%'}
          </p>
          <p className="text-xs text-gray-500 mt-2">Users who left</p>
        </div>

        {/* Active Users */}
        <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/30 rounded-lg p-6 hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-4xl font-bold text-blue-400">
            {retentionMetrics?.activeUsersThisMonth || 0}
          </p>
          <p className="text-xs text-gray-500 mt-2">Active this month</p>
        </div>

        {/* New Users */}
        <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">New Users</h3>
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-4xl font-bold text-purple-400">
            {retentionMetrics?.newUsersThisMonth || 0}
          </p>
          <p className="text-xs text-gray-500 mt-2">Signed up this month</p>
        </div>
      </div>

      {/* Churn Analysis */}
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Churn Analysis (Last 30 Days)</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-800/50 rounded p-4">
            <p className="text-gray-400 text-sm mb-2">Total Users</p>
            <p className="text-2xl font-bold text-white">{churnAnalysis?.totalUsers || 0}</p>
          </div>

          <div className="bg-gray-800/50 rounded p-4">
            <p className="text-gray-400 text-sm mb-2">Churned Users</p>
            <p className="text-2xl font-bold text-red-400">{churnAnalysis?.churnedUsers || 0}</p>
          </div>

          <div className="bg-gray-800/50 rounded p-4">
            <p className="text-gray-400 text-sm mb-2">At-Risk Users (3+ days)</p>
            <p className="text-2xl font-bold text-yellow-400">{churnAnalysis?.atRiskCount || 0}</p>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
          <p className="text-blue-300 text-sm">
            💡 <strong>Insight:</strong> {churnAnalysis?.atRiskCount || 0} users are at risk of churning. 
            Consider sending re-engagement campaigns.
          </p>
        </div>
      </div>

      {/* User Lifetime Value */}
<div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
  <h2 className="text-xl font-bold text-white mb-6">User Lifetime Value (LTV)</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Avg Session Duration */}
    <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-900/5 border border-cyan-500/30 rounded p-4">
      <p className="text-gray-400 text-sm mb-2">Avg Session Duration</p>
      <p className="text-2xl font-bold text-cyan-400">
        {Math.round((Number(ltv?.avgSessionDuration) || 0) / 60)} min
      </p>
    </div>

    {/* Avg Engagement */}
    <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 border border-emerald-500/30 rounded p-4">
      <p className="text-gray-400 text-sm mb-2">Avg Engagement</p>
      <p className="text-2xl font-bold text-emerald-400">
        {ltv?.avgEngagement 
          ? (Number(ltv.avgEngagement) || 0).toFixed(1)
          : '0.0'
        }
      </p>
      <p className="text-xs text-gray-500">downloads/user</p>
    </div>

    {/* Avg User Lifetime */}
    <div className="bg-gradient-to-br from-violet-900/20 to-violet-900/5 border border-violet-500/30 rounded p-4">
      <p className="text-gray-400 text-sm mb-2">Avg User Lifetime</p>
      <p className="text-2xl font-bold text-violet-400">
        {Math.round(Number(ltv?.avgUserLifetime) || 0)} days
      </p>
    </div>
  </div>
</div>


      {/* Cohort Retention Table */}
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6 overflow-x-auto">
        <h2 className="text-xl font-bold text-white mb-6">Cohort Retention Table</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-gray-400 font-semibold">Cohort</th>
              <th className="text-center py-3 px-4 text-gray-400 font-semibold">Users</th>
              <th className="text-center py-3 px-4 text-gray-400 font-semibold">Week 0</th>
              <th className="text-center py-3 px-4 text-gray-400 font-semibold">Week 1</th>
              <th className="text-center py-3 px-4 text-gray-400 font-semibold">Week 2</th>
              <th className="text-center py-3 px-4 text-gray-400 font-semibold">Month 1</th>
              <th className="text-center py-3 px-4 text-gray-400 font-semibold">Month 3</th>
              <th className="text-center py-3 px-4 text-gray-400 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {cohorts && cohorts.length > 0 ? (
              cohorts.map((cohort, idx) => (
                <tr
                  key={cohort._id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-white">{cohort.name}</td>
                  <td className="py-3 px-4 text-center text-gray-300">{cohort.totalUsers}</td>
                  <td className="py-3 px-4 text-center text-green-400 font-semibold">
                    {cohort.week0}%
                  </td>
                  <td className="py-3 px-4 text-center text-gray-300">{cohort.week1}%</td>
                  <td className="py-3 px-4 text-center text-gray-300">{cohort.week2}%</td>
                  <td className="py-3 px-4 text-center text-gray-300">{cohort.month1}%</td>
                  <td className="py-3 px-4 text-center text-gray-300">{cohort.month3}%</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => dispatch(getCohortDetails(cohort.name))}
                      className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-500">
                  No cohort data available. Start tracking user cohorts!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Insights Box */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">📊 Key Insights</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>✅ Retention Rate: Users returning from previous month</li>
          <li>✅ Churn Rate: Percentage of users becoming inactive</li>
          <li>✅ Cohort Analysis: Track user groups by signup date</li>
          <li>✅ At-Risk Users: Users inactive for 3+ days</li>
          <li>✅ LTV: How valuable each user is to your platform</li>
        </ul>
      </div>
    </div>
  );
}

export default RetentionTab;
