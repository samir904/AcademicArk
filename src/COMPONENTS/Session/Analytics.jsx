import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSessionAnalytics, getPageMetrics } from "../../REDUX/Slices/sessionSlice";

export default function Analytics() {
  const dispatch = useDispatch();
  const { analytics, pageMetrics, analyticsLoading } = useSelector(
    state => state.session
  );

  useEffect(() => {
    dispatch(getSessionAnalytics());
    dispatch(getPageMetrics());
  }, [dispatch]);

  if (analyticsLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">📊 Analytics Dashboard</h1>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-black p-4 rounded-lg shadow">
          <p className="text-gray-600">Engagement Score</p>
          <p className="text-3xl font-bold text-blue-600">
            {analytics.engagementScore || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600">Bounce Rate</p>
          <p className="text-3xl font-bold text-red-600">
            {analytics.bounceRate || 0}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600">Avg Duration</p>
          <p className="text-3xl font-bold text-green-600">
            {Math.floor(analytics.avgDuration / 60)}m
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600">Total Sessions</p>
          <p className="text-3xl font-bold text-purple-600">
            {pageMetrics.length}
          </p>
        </div>
      </div>

      {/* Conversion Funnel */}
      {analytics.conversionFunnel && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">📈 Conversion Funnel</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span>Viewed</span>
                <span className="font-bold">
                  {analytics.conversionFunnel.viewed}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{width: `${analytics.conversionFunnel.viewed}%`}}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Clicked</span>
                <span className="font-bold">
                  {analytics.conversionFunnel.clicked}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{width: `${analytics.conversionFunnel.clicked}%`}}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Downloaded</span>
                <span className="font-bold">
                  {analytics.conversionFunnel.downloaded}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full"
                  style={{width: `${analytics.conversionFunnel.downloaded}%`}}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Device Breakdown */}
      {analytics.deviceBreakdown && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">📱 Device Breakdown</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {analytics.deviceBreakdown.MOBILE}%
              </p>
              <p className="text-gray-600">Mobile</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {analytics.deviceBreakdown.TABLET}%
              </p>
              <p className="text-gray-600">Tablet</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {analytics.deviceBreakdown.DESKTOP}%
              </p>
              <p className="text-gray-600">Desktop</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
