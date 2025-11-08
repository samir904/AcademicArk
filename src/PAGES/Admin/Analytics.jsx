import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAnalyticsOverview,
  getTopPages,
  getTrafficSources
} from '../../REDUX/Slices/analyticsSlice'
import HomeLayout from '../../LAYOUTS/Homelayout'

const Analytics = () => {
  const dispatch = useDispatch()
  const { overview, topPages, trafficSources, loading } = useSelector(
    state => state.analytics
  )

  useEffect(() => {
    dispatch(getAnalyticsOverview())
    dispatch(getTopPages())
    dispatch(getTrafficSources())
  }, [dispatch])

  if (loading) {
    return (
              
                  <div className="min-h-screen bg-black flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  </div>
             
          );
  }

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <KPICard
          title="Total Sessions"
          value={overview?.totalSessions || 0}
          icon="📊"
        />
        <KPICard
          title="Page Views"
          value={overview?.totalPageViews || 0}
          icon="👁️"
        />
        <KPICard
          title="Avg Bounce Rate"
          value={overview?.avgBounceRate || 0}
          suffix="%"
          icon="📉"
        />
        <KPICard
          title="Avg Session Time"
          value={overview?.avgSessionTime || 0}
          suffix="s"
          icon="⏱️"
        />
      </div>

      {/* Top Pages */}
      <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">📄 Top Pages</h3>
        <div className="space-y-2">
          {topPages?.map((page, idx) => (
            <div
              key={idx}
              className="flex justify-between p-3 bg-gray-800 rounded hover:bg-gray-700 transition"
            >
              <span className="text-gray-300 truncate">{page.page}</span>
              <span className="text-blue-400 font-bold">{page.views} views</span>
            </div>
          ))}
          {topPages?.length === 0 && (
            <p className="text-gray-400">No data available</p>
          )}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">🚀 Traffic Sources</h3>
        <div className="space-y-2">
          {trafficSources?.map((source, idx) => (
            <div
              key={idx}
              className="flex justify-between p-3 bg-gray-800 rounded hover:bg-gray-700 transition"
            >
              <span className="text-gray-300">{source.source || 'Direct'}</span>
              <span className="text-green-400 font-bold">{source.sessions} sessions</span>
            </div>
          ))}
          {trafficSources?.length === 0 && (
            <p className="text-gray-400">No data available</p>
          )}
        </div>
      </div>
    </div>
  )
}

const KPICard = ({ title, value, icon, suffix = '' }) => (
  <div className="bg-gray-900/50 rounded-lg p-4 border border-white/10 hover:border-white/20 transition">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-2">
          {value}
          {suffix}
        </p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
)

export default Analytics
