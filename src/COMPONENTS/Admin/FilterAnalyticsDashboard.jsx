import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminDashboard,
  fetchMostViewedNotes,
  fetchContentGaps,
  fetchSubjectPerformance,
  fetchDeviceAnalytics,
  fetchPeakUsageTimes,
  fetchPopularCombinations,
  fetchTopDownloadedNotes,
  fetchConversionFunnel,
  selectAdminDashboard,
  selectMostViewedNotes,
  selectContentGaps,
  selectSubjectPerformance,
  selectDeviceAnalytics,
  selectPeakUsage,
  selectPopularCombinations,
  selectTopDownloaded,
  selectConversionFunnel
} from '../../REDUX/Slices/filterAnalyticsSlice';
import {
  TrendingUp,
  Users,
  Download,
  Search,
  AlertCircle,
  Clock,
  Smartphone,
  Tablet,  // ✅ ADD THIS
  Monitor,
  BarChart3,
  Filter,
  Eye,
  Target,
  Zap,
  Calendar,
  RefreshCw
} from 'lucide-react';

const FilterAnalyticsDashboard = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const dashboard = useSelector(selectAdminDashboard);
  const mostViewed = useSelector(selectMostViewedNotes);
  const contentGaps = useSelector(selectContentGaps);
  const subjectPerformance = useSelector(selectSubjectPerformance);
  const deviceAnalytics = useSelector(selectDeviceAnalytics);
  const peakUsage = useSelector(selectPeakUsage);
  const popularCombinations = useSelector(selectPopularCombinations);
  const topDownloaded = useSelector(selectTopDownloaded);
  const conversionFunnel = useSelector(selectConversionFunnel);

  // Filters
  const [timeRange, setTimeRange] = useState(7);
  const [selectedSemester, setSelectedSemester] = useState('');

  // Fetch all data
  const fetchAllData = () => {
    dispatch(fetchAdminDashboard(timeRange));
    dispatch(fetchMostViewedNotes({ 
      semester: selectedSemester, 
      days: 30,
      limit: 10 
    }));
    dispatch(fetchContentGaps({ days: 30, minSearches: 3 }));
    dispatch(fetchSubjectPerformance({ 
      semester: selectedSemester, 
      days: 30 
    }));
    dispatch(fetchDeviceAnalytics(30));
    dispatch(fetchPeakUsageTimes(30));
    dispatch(fetchPopularCombinations({ 
      semester: selectedSemester, 
      days: 30, 
      minOccurrences: 5 
    }));
    dispatch(fetchTopDownloadedNotes({ 
      semester: selectedSemester, 
      days: 30 
    }));
    dispatch(fetchConversionFunnel({ 
      semester: selectedSemester, 
      days: timeRange 
    }));
  };

  useEffect(() => {
    fetchAllData();
  }, [dispatch, timeRange, selectedSemester]);

  // Loading state
  const isLoading = dashboard.loading || mostViewed.loading;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              📊 Filter Analytics Dashboard
            </h1>
            <p className="text-gray-400">
              Comprehensive insights into user search behavior and content performance
            </p>
          </div>

          <div className="flex gap-3">
            {/* Time Range Filter */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="px-4 py-2 bg-[#1F1F1F] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Last 24 Hours</option>
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>

            {/* Semester Filter */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-4 py-2 bg-[#1F1F1F] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchAllData}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Overview Cards */}
        {dashboard.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Search className="w-5 h-5" />}
              label="Total Searches"
              value={dashboard.data.overview.totalSearches}
              color="bg-blue-500/10 text-blue-400"
            />
            <StatCard
              icon={<Download className="w-5 h-5" />}
              label="Total Downloads"
              value={dashboard.data.overview.totalDownloads}
              color="bg-green-500/10 text-green-400"
            />
            <StatCard
              icon={<Target className="w-5 h-5" />}
              label="Conversion Rate"
              value={dashboard.data.overview.conversionRate}
              color="bg-purple-500/10 text-purple-400"
            />
            <StatCard
              icon={<AlertCircle className="w-5 h-5" />}
              label="Zero Results"
              value={`${dashboard.data.overview.zeroResults} (${dashboard.data.overview.zeroResultRate})`}
              color="bg-red-500/10 text-red-400"
            />
          </div>
        )}

        {/* Engagement Metrics */}
       {/* ========================================
    USER ENGAGEMENT - ENHANCED
    ======================================== */}
{dashboard.data && (
  <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        User Engagement
      </h2>
      <span className="text-xs text-gray-500 bg-[#0A0A0A] px-3 py-1 rounded-full">
        Last {dashboard.data.period}
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* ✅ ENHANCED: Avg Scroll Depth */}
      <EngagementMetricEnhanced
        label="Avg Scroll Depth"
        value={`${dashboard.data.engagement.avgScrollDepth}%`}
        numericValue={parseFloat(dashboard.data.engagement.avgScrollDepth)}
        icon={<BarChart3 className="w-4 h-4" />}
        color="blue"
        benchmark={70}
        benchmarkLabel="Target: 70%"
        description="How far users scroll on results page"
      />

      {/* ✅ ENHANCED: Avg Time on Page */}
      <EngagementMetricEnhanced
        label="Avg Time on Page"
        value={`${dashboard.data.engagement.avgTimeOnPage}s`}
        numericValue={parseFloat(dashboard.data.engagement.avgTimeOnPage)}
        icon={<Clock className="w-4 h-4" />}
        color="purple"
        benchmark={15}
        benchmarkLabel="Target: 15s+"
        description="Time spent reviewing results"
      />

      {/* ✅ ENHANCED: Avg Time to Download */}
      <EngagementMetricEnhanced
        label="Avg Time to Download"
        value={dashboard.data.engagement.avgTimeToDownload}
        numericValue={
          dashboard.data.engagement.avgTimeToDownload !== 'N/A' 
            ? parseFloat(dashboard.data.engagement.avgTimeToDownload) 
            : null
        }
        icon={<Download className="w-4 h-4" />}
        color="green"
        benchmark={20}
        benchmarkLabel="Target: <20s"
        isLowerBetter={true}
        description="Time from search to download"
      />
    </div>

    {/* ✅ NEW: Engagement Summary */}
    <div className="mt-4 pt-4 border-t border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Overall Engagement Score</p>
          <p className="text-sm text-gray-500 mt-0.5">Based on scroll depth and time metrics</p>
        </div>
        <div className="flex items-center gap-2">
          {(() => {
            const scrollDepth = parseFloat(dashboard.data.engagement.avgScrollDepth);
            const timeOnPage = parseFloat(dashboard.data.engagement.avgTimeOnPage);
            
            // Calculate engagement score (0-100)
            const scrollScore = Math.min((scrollDepth / 70) * 100, 100);
            const timeScore = Math.min((timeOnPage / 15) * 100, 100);
            const overallScore = ((scrollScore + timeScore) / 2).toFixed(0);
            
            const scoreColor = 
              overallScore >= 80 ? 'text-green-400' :
              overallScore >= 60 ? 'text-yellow-400' :
              'text-red-400';
            
            return (
              <>
                <span className={`text-3xl font-bold ${scoreColor}`}>
                  {overallScore}
                </span>
                <span className="text-gray-500">/100</span>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  </div>
)}

        {/* Conversion Funnel */}
        {conversionFunnel.data && (
          <ConversionFunnelCard data={conversionFunnel.data} />
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Subjects */}
          {dashboard.data && (
            <TopSubjectsCard subjects={dashboard.data.topSubjects} />
          )}

          {/* Device Breakdown */}
                  {/* ✅ Device Breakdown - Pass summary (not devices) */}
        {deviceAnalytics.data?.summary && deviceAnalytics.data.summary.length > 0 ? (
          <DeviceBreakdownCard summary={deviceAnalytics.data.summary} />
        ) : deviceAnalytics.loading ? (
          <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-400">Loading device data...</span>
            </div>
          </div>
        ) : (
          <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-400" />
              Device Breakdown
            </h2>
            <p className="text-gray-400 text-center py-8">No device data available</p>
          </div>
        )}
        </div>

        {/* Content Gaps - PRIORITY */}
        {contentGaps.data && contentGaps.data.length > 0 && (
          <ContentGapsCard gaps={contentGaps.data} />
        )}

        {/* Subject Performance Table */}
        {subjectPerformance.data && subjectPerformance.data.length > 0 && (
          <SubjectPerformanceTable data={subjectPerformance.data} />
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Viewed Notes */}
          {mostViewed.data && mostViewed.data.length > 0 && (
            <MostViewedNotesCard notes={mostViewed.data} />
          )}

          {/* Top Downloaded Notes */}
          {topDownloaded.data && topDownloaded.data.length > 0 && (
            <TopDownloadedCard notes={topDownloaded.data} />
          )}
        </div>
{/* Peak Usage Times */}
        {peakUsage.data && (
          <PeakUsageCard data={peakUsage.data} />
        )}
        {/* Peak Usage Times */}
        {peakUsage.data && (
          <PeakUsageCardHeatmap data={peakUsage.data} />
        )}

        {/* Popular Filter Combinations */}
        {popularCombinations.data && popularCombinations.data.length > 0 && (
          <PopularCombinationsCard combinations={popularCombinations.data} />
        )}

        {/* Device Analytics Details */}
        {deviceAnalytics.data && (
          <DeviceAnalyticsDetailCard data={deviceAnalytics.data} />
        )}
      </div>
    </div>
  );
};

// ========================================
// 📊 STAT CARD COMPONENT
// ========================================
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
      {icon}
    </div>
    <p className="text-gray-400 text-sm mb-1">{label}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

// ========================================
// 📊 ENGAGEMENT METRIC
// ========================================
const EngagementMetric = ({ label, value, icon }) => (
  <div className="flex items-center gap-3 p-4 bg-[#0A0A0A] rounded-lg border border-white/5">
    <div className="text-gray-400">{icon}</div>
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  </div>
);

// ========================================
// 🎯 CONVERSION FUNNEL CARD (UPDATED)
// ========================================
const ConversionFunnelCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-purple-400" />
        Conversion Funnel
      </h2>

      {/* Funnel Steps */}
      <div className="space-y-3">
        <FunnelStep
          label="Total Filter Searches"
          value={data.totalFilters}
          percentage={100}
          color="bg-blue-500"
        />
        <FunnelStep
          label="Searches with Results"
          value={data.withResults}
          percentage={(data.withResults / data.totalFilters * 100).toFixed(1)}
          color="bg-green-500"
          dropOff={data.totalFilters - data.withResults}
        />
        <FunnelStep
          label="Resulted in Downloads"
          value={data.withDownloads}
          percentage={(data.withDownloads / data.totalFilters * 100).toFixed(1)}
          color="bg-purple-500"
          dropOff={data.withResults - data.withDownloads}
        />
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
        {/* Conversion Rate */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Overall Conversion Rate</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Downloads per search
            </p>
          </div>
          <span className="text-2xl font-bold text-purple-400">
            {data.conversionRate}%
          </span>
        </div>

        {/* ✅ NEW: Avg Time to Download */}
        {data.avgTimeToDownload && (
          <div className="flex justify-between items-center p-3 bg-[#0A0A0A] rounded-lg border border-white/5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <div>
                <p className="text-gray-300 text-sm">Avg Time to Download</p>
                <p className="text-xs text-gray-500">From search to download</p>
              </div>
            </div>
            <span className="text-xl font-bold text-yellow-400">
              {data.avgTimeToDownload}
            </span>
          </div>
        )}

        {/* ✅ NEW: Drop-off Summary */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-xs text-gray-400 mb-1">Zero Results</p>
            <p className="text-lg font-bold text-red-400">
              {data.totalFilters - data.withResults}
            </p>
            <p className="text-xs text-gray-500">
              {((data.totalFilters - data.withResults) / data.totalFilters * 100).toFixed(1)}% drop
            </p>
          </div>
          <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <p className="text-xs text-gray-400 mb-1">No Download</p>
            <p className="text-lg font-bold text-orange-400">
              {data.withResults - data.withDownloads}
            </p>
            <p className="text-xs text-gray-500">
              {data.withResults > 0 
                ? ((data.withResults - data.withDownloads) / data.withResults * 100).toFixed(1) 
                : 0}% drop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// 📊 FUNNEL STEP (UPDATED)
// ========================================
const FunnelStep = ({ label, value, percentage, color, dropOff }) => (
  <div>
    <div className="flex justify-between text-sm mb-2">
      <div className="flex items-center gap-2">
        <span className="text-gray-300">{label}</span>
        {dropOff !== undefined && dropOff > 0 && (
          <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
            -{dropOff} lost
          </span>
        )}
      </div>
      <span className="text-white font-semibold">
        {value} ({percentage}%)
      </span>
    </div>
    <div className="w-full bg-[#0A0A0A] rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);


// const FunnelStep = ({ label, value, percentage, color }) => (
//   <div>
//     <div className="flex justify-between text-sm mb-2">
//       <span className="text-gray-300">{label}</span>
//       <span className="text-white font-semibold">{value} ({percentage}%)</span>
//     </div>
//     <div className="w-full bg-[#0A0A0A] rounded-full h-2">
//       <div
//         className={`${color} h-2 rounded-full transition-all duration-500`}
//         style={{ width: `${percentage}%` }}
//       />
//     </div>
//   </div>
// );

// ========================================
// 📈 TOP SUBJECTS CARD
// ========================================
const TopSubjectsCard = ({ subjects }) => (
  <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <TrendingUp className="w-5 h-5 text-orange-400" />
      Top Subjects
    </h2>
    <div className="space-y-3">
      {subjects.slice(0, 5).map((subject, idx) => (
        <div key={subject._id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center text-sm font-bold">
              #{idx + 1}
            </div>
            <span className="text-white capitalize">{subject._id || 'Unknown'}</span>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold">{subject.searches}</p>
            <p className="text-xs text-gray-400">{subject.downloads} downloads</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ========================================
// 📱 DEVICE BREAKDOWN CARD
// ========================================
// ========================================
// 📱 DEVICE BREAKDOWN CARD (FIXED)
// ========================================
const DeviceBreakdownCard = ({ summary }) => {
  if (!summary || summary.length === 0) {
    return (
      <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-blue-400" />
          Device Breakdown
        </h2>
        <p className="text-gray-400 text-center py-8">No device data available</p>
      </div>
    );
  }

  // ✅ Calculate total from uniqueSessions (not count!)
  const total = summary.reduce((sum, d) => sum + (d.uniqueSessions || 0), 0);
  const totalEvents = summary.reduce((sum, d) => sum + (d.totalEvents || 0), 0);
  
  return (
    <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Smartphone className="w-5 h-5 text-blue-400" />
        Device Breakdown
      </h2>

      {/* ✅ Total sessions + events display */}
      <div className="mb-4 p-3 bg-[#0A0A0A] rounded-lg border border-white/5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">Total Sessions</p>
            <p className="text-2xl font-bold text-white">{total}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Total Events</p>
            <p className="text-lg font-semibold text-gray-300">{totalEvents}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {summary.map((device) => {
          // ✅ Use correct property names from API
          const sessions = device.uniqueSessions || 0;
          const percentage = total > 0 ? ((sessions / total) * 100).toFixed(1) : 0;
          const Icon = device.platform === 'mobile' ? Smartphone : 
                      device.platform === 'tablet' ? Tablet : Monitor;
          
          return (
            <div key={device.platform}>
              {/* Device header */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="text-white capitalize">{device.platform}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-semibold">
                    {sessions}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    ({percentage}%)
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#0A0A0A] rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    device.platform === 'mobile' ? 'bg-purple-500' : 
                    device.platform === 'tablet' ? 'bg-green-500' : 
                    'bg-blue-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* ✅ Additional stats */}
              <div className="flex justify-between text-xs text-gray-400 pl-6">
                <span>{device.totalEvents || 0} events</span>
                <span>{device.downloads || 0} downloads</span>
                <span>{device.uniqueUsers || 0} users</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Show top browsers */}
      {summary.some(d => d.browsers && d.browsers.length > 0) && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-3">Top Browsers:</p>
          <div className="grid grid-cols-2 gap-2">
            {summary.flatMap(device => 
              (device.browsers || []).map(browser => ({
                ...browser,
                platform: device.platform
              }))
            )
            .sort((a, b) => (b.sessions || 0) - (a.sessions || 0))
            .slice(0, 4)
            .map((browser, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-[#0A0A0A] rounded-lg border border-white/5">
                <span className="text-xs text-gray-300 capitalize">
                  {browser.browser || 'Unknown'}
                </span>
                <span className="text-xs text-gray-400">
                  {browser.sessions || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};



// ========================================
// 🚨 CONTENT GAPS CARD (PRIORITY)
// ========================================
const ContentGapsCard = ({ gaps }) => (
  <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl border border-red-500/20 p-6">
    <div className="flex items-center gap-2 mb-4">
      <AlertCircle className="w-6 h-6 text-red-400" />
      <h2 className="text-xl font-semibold text-white">
        🚨 Content Gaps - Action Required
      </h2>
    </div>
    <p className="text-gray-300 mb-4">
      Users are searching for these materials but finding no results. Prioritize creating this content:
    </p>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Priority</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Subject</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Unit</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Searches</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Users</th>
          </tr>
        </thead>
        <tbody>
          {gaps.slice(0, 10).map((gap, idx) => (
            <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
                  {gap.priority ? gap.priority.toFixed(1) : 'N/A'}
                </span>
              </td>
              <td className="py-3 px-4 text-white capitalize">{gap.subject}</td>
              <td className="py-3 px-4 text-gray-300">{gap.category || 'Any'}</td>
              <td className="py-3 px-4 text-gray-300">{gap.unit || 'Any'}</td>
              <td className="py-3 px-4 text-right text-white font-semibold">{gap.searchCount}</td>
              <td className="py-3 px-4 text-right text-gray-400">{gap.uniqueUsersCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ========================================
// 📊 SUBJECT PERFORMANCE TABLE
// ========================================
const SubjectPerformanceTable = ({ data }) => (
  <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <BarChart3 className="w-5 h-5 text-green-400" />
      Subject Performance Metrics
    </h2>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Subject</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Searches</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Downloads</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Conv. Rate</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Engagement</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 10).map((subject, idx) => (
            <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-3 px-4 text-white capitalize">{subject.subject}</td>
              <td className="py-3 px-4 text-right text-gray-300">{subject.totalSearches}</td>
              <td className="py-3 px-4 text-right text-gray-300">{subject.downloads}</td>
              <td className="py-3 px-4 text-right">
                <span className={`font-semibold ${
                  subject.conversionRate > 5 ? 'text-green-400' : 
                  subject.conversionRate > 2 ? 'text-yellow-400' : 
                  'text-red-400'
                }`}>
                  {subject.conversionRate}%
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <span className="text-gray-300">{subject.engagementScore}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ========================================
// 👁️ MOST VIEWED NOTES CARD
// ========================================
const MostViewedNotesCard = ({ notes }) => (
  <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Eye className="w-5 h-5 text-purple-400" />
      Most Viewed Notes (No Downloads)
    </h2>
    <p className="text-sm text-gray-400 mb-4">
      High views but low downloads may indicate quality issues
    </p>
    <div className="space-y-3">
      {notes.slice(0, 5).map((note) => (
        <div key={note.noteId} className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg border border-white/5">
          <div className="flex-1">
            <p className="text-white font-medium">{note.title}</p>
            <p className="text-xs text-gray-400 capitalize">
              {note.subject} • {note.category}
            </p>
          </div>
          <div className="text-right">
            <p className="text-purple-400 font-semibold">{note.views} views</p>
            <p className="text-xs text-gray-400">{note.uniqueViewers} users</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ========================================
// 📥 TOP DOWNLOADED CARD
// ========================================
const TopDownloadedCard = ({ notes }) => (
  <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Download className="w-5 h-5 text-green-400" />
      Top Downloaded Notes
    </h2>
    <div className="space-y-3">
      {notes.slice(0, 5).map((item, idx) => (
        <div key={item._id} className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg border border-white/5">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center text-sm font-bold">
              #{idx + 1}
            </div>
            <div>
              <p className="text-white font-medium">{item.note?.title || 'Unknown'}</p>
              <p className="text-xs text-gray-400 capitalize">
                {item.note?.subject}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-green-400 font-semibold">{item.downloads} DLs</p>
            <p className="text-xs text-gray-400">
              {item.avgTimeToDownload ? `${(item.avgTimeToDownload / 1000).toFixed(1)}s` : 'N/A'}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ========================================
// ⏰ PEAK USAGE CARD
// ========================================
// ========================================
// ⏰ PEAK USAGE CARD (ENHANCED)
// ========================================
const PeakUsageCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-yellow-400" />
        Peak Usage Times
      </h2>

      {/* ✅ Summary Stats Grid */}
      {data.summary && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 bg-[#0A0A0A] rounded-lg border border-white/5">
            <p className="text-xs text-gray-400">Total Sessions</p>
            <p className="text-lg font-bold text-white">{data.summary.totalUniqueSessions}</p>
          </div>
          <div className="p-3 bg-[#0A0A0A] rounded-lg border border-white/5">
            <p className="text-xs text-gray-400">Total Events</p>
            <p className="text-lg font-bold text-white">{data.summary.totalEvents}</p>
          </div>
          <div className="p-3 bg-[#0A0A0A] rounded-lg border border-white/5">
            <p className="text-xs text-gray-400">Avg Events/Session</p>
            <p className="text-lg font-bold text-white">{data.summary.avgEventsPerSession}</p>
          </div>
        </div>
      )}

      {/* ✅ Peak Activity Highlight */}
      <div className="mb-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300 mb-1">🔥 Peak Activity</p>
            <p className="text-2xl font-bold text-yellow-400">
              {data.peakHour}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              on {data.peakDay}
            </p>
          </div>
          {data.hourlyBreakdown && data.hourlyBreakdown[0] && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Peak Sessions</p>
              <p className="text-3xl font-bold text-yellow-400">
                {data.hourlyBreakdown[0].sessions}
              </p>
              <p className="text-xs text-gray-500">
                {data.hourlyBreakdown[0].totalEvents} events
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Hourly Breakdown - Show All Hours */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-300">Activity Breakdown</h3>
          <span className="text-xs text-gray-500">
            {data.hourlyBreakdown?.length || 0} hour slots
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.hourlyBreakdown?.map((hour, index) => {
            const isPeak = index === 0; // First item is the peak
            const hasDownloads = hour.downloads > 0;
            
            return (
              <div 
                key={`${hour.hour}-${hour.dayOfWeek}`} 
                className={`p-3 rounded-lg border transition-all hover:scale-105 ${
                  isPeak 
                    ? 'bg-yellow-500/10 border-yellow-500/30 shadow-lg shadow-yellow-500/10' 
                    : 'bg-[#0A0A0A] border-white/5 hover:border-white/10'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">{hour.dayOfWeek}</p>
                  {isPeak && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full font-semibold">
                      Peak
                    </span>
                  )}
                  {hasDownloads && !isPeak && (
                    <Download className="w-3 h-3 text-green-400" />
                  )}
                </div>

                {/* Time */}
                <p className={`font-semibold mb-2 ${isPeak ? 'text-yellow-400' : 'text-white'}`}>
                  {hour.hour}:00
                </p>

                {/* Metrics */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Sessions:</span>
                    <span className="text-white font-semibold">{hour.sessions}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Events:</span>
                    <span className="text-gray-300">{hour.totalEvents}</span>
                  </div>
                  {hour.downloads > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Downloads:</span>
                      <span className="text-green-400 font-semibold">{hour.downloads}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Users:</span>
                    <span className="text-gray-300">{hour.uniqueUsersCount}</span>
                  </div>
                </div>

                {/* ✅ Activity Bar */}
                <div className="mt-2 pt-2 border-t border-white/5">
                  <div className="w-full bg-gray-800 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${
                        isPeak ? 'bg-yellow-400' : 'bg-blue-500'
                      }`}
                      style={{
                        width: `${Math.min((hour.sessions / (data.hourlyBreakdown[0]?.sessions || 1)) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Insights Section */}
      {data.hourlyBreakdown && data.hourlyBreakdown.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">💡 Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Most Active Hour */}
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-xs text-gray-400 mb-1">Most Active Hour</p>
              <p className="text-sm font-semibold text-blue-400">
                {data.hourlyBreakdown[0].hour}:00 ({data.hourlyBreakdown[0].sessions} sessions)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {data.hourlyBreakdown[0].totalEvents} events · {data.hourlyBreakdown[0].uniqueUsersCount} users
              </p>
            </div>

            {/* Best Conversion Hour */}
            {(() => {
              const hourWithMostDownloads = [...data.hourlyBreakdown]
                .filter(h => h.downloads > 0)
                .sort((a, b) => b.downloads - a.downloads)[0];
              
              return hourWithMostDownloads ? (
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-xs text-gray-400 mb-1">Best Conversion Hour</p>
                  <p className="text-sm font-semibold text-green-400">
                    {hourWithMostDownloads.hour}:00 ({hourWithMostDownloads.downloads} downloads)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((hourWithMostDownloads.downloads / hourWithMostDownloads.sessions) * 100).toFixed(0)}% conversion rate
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-gray-500/10 rounded-lg border border-gray-500/20">
                  <p className="text-xs text-gray-400 mb-1">Best Conversion Hour</p>
                  <p className="text-sm text-gray-500">No downloads yet</p>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ✅ Empty State */}
      {(!data.hourlyBreakdown || data.hourlyBreakdown.length === 0) && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No usage data available for this period</p>
        </div>
      )}
    </div>
  );
};
// ========================================
// ⏰ PEAK USAGE CARD - HEATMAP STYLE
// ========================================
const PeakUsageCardHeatmap = ({ data }) => {
  const [hoveredCell, setHoveredCell] = React.useState(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });

  if (!data) return null;

  // Group by day and hour for heatmap
  const heatmapData = {};
  data.hourlyBreakdown?.forEach(hour => {
    if (!heatmapData[hour.dayOfWeek]) {
      heatmapData[hour.dayOfWeek] = {};
    }
    heatmapData[hour.dayOfWeek][hour.hour] = hour;
  });

  const maxSessions = Math.max(...(data.hourlyBreakdown?.map(h => h.sessions) || [1]));

  // Days of week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // ✅ Handle mouse enter for tooltip (BELOW cell)
  const handleMouseEnter = (e, day, hour, hourData) => {
    if (!hourData) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom  // ✅ Changed from rect.top to rect.bottom
    });
    setHoveredCell({ day, hour, data: hourData });
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6 relative">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-yellow-400" />
        Peak Usage Heatmap
      </h2>

      {/* Summary */}
      {data.summary && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 bg-[#0A0A0A] rounded-lg">
            <p className="text-xs text-gray-400">Sessions</p>
            <p className="text-lg font-bold text-white">{data.summary.totalUniqueSessions}</p>
          </div>
          <div className="p-3 bg-[#0A0A0A] rounded-lg">
            <p className="text-xs text-gray-400">Events</p>
            <p className="text-lg font-bold text-white">{data.summary.totalEvents}</p>
          </div>
          <div className="p-3 bg-[#0A0A0A] rounded-lg">
            <p className="text-xs text-gray-400">Avg/Session</p>
            <p className="text-lg font-bold text-white">{data.summary.avgEventsPerSession}</p>
          </div>
        </div>
      )}

      {/* Peak Info */}
      <div className="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
        <p className="text-sm text-gray-300">
          🔥 Peak: <span className="text-yellow-400 font-bold">{data.peakHour}</span> on {data.peakDay}
        </p>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-max">
          {/* Hour Labels */}
          <div className="flex mb-2">
            <div className="w-24"></div>
            {hours.map(hour => (
              <div key={hour} className="w-12 text-center">
                <span className="text-xs text-gray-500">{hour}</span>
              </div>
            ))}
          </div>

          {/* Heatmap Rows */}
          {daysOfWeek.map(day => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-24 text-xs text-gray-400 pr-2">{day.slice(0, 3)}</div>
              {hours.map(hour => {
                const hourData = heatmapData[day]?.[hour];
                const intensity = hourData 
                  ? (hourData.sessions / maxSessions)
                  : 0;
                
                return (
                  <div
                    key={hour}
                    className="w-12 h-8 mx-0.5 rounded transition-all hover:scale-110 cursor-pointer"
                    style={{
                      backgroundColor: intensity > 0 
                        ? `rgba(250, 204, 21, ${0.1 + intensity * 0.9})`
                        : 'rgba(255, 255, 255, 0.02)'
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, day, hour, hourData)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          {[0.2, 0.4, 0.6, 0.8, 1].map(intensity => (
            <div
              key={intensity}
              className="w-4 h-4 rounded"
              style={{ backgroundColor: `rgba(250, 204, 21, ${intensity})` }}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* ✅ FIXED: Tooltip BELOW cell (fixed position, outside overflow) */}
      {hoveredCell && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y + 10}px`,  // ✅ Changed to + instead of -
            transform: 'translate(-50%, 0)'  // ✅ Changed from -100% to 0
          }}
        >
          <div className="bg-black text-white text-xs rounded-lg p-3 whitespace-nowrap shadow-2xl border border-white/20 backdrop-blur-sm">
            {/* Tooltip arrow pointing UP */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
            </div>
            
            <p className="font-semibold text-yellow-400 mb-2">
              {hoveredCell.day} {hoveredCell.hour}:00
            </p>
            <div className="space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Sessions:</span>
                <span className="text-white font-semibold">{hoveredCell.data.sessions}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Events:</span>
                <span className="text-white">{hoveredCell.data.totalEvents}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Users:</span>
                <span className="text-white">{hoveredCell.data.uniqueUsersCount}</span>
              </div>
              {hoveredCell.data.downloads > 0 && (
                <div className="flex justify-between gap-4 pt-1 border-t border-white/10">
                  <span className="text-green-400">Downloads:</span>
                  <span className="text-green-400 font-semibold">✓ {hoveredCell.data.downloads}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};





// ========================================
// 🎯 POPULAR COMBINATIONS CARD
// ========================================
const PopularCombinationsCard = ({ combinations }) => (
  <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Filter className="w-5 h-5 text-blue-400" />
      Popular Filter Combinations
    </h2>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Subject</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Unit</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Uses</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Downloads</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Conv. Rate</th>
          </tr>
        </thead>
        <tbody>
          {combinations.slice(0, 10).map((combo, idx) => (
            <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-3 px-4 text-white capitalize">{combo.subject}</td>
              <td className="py-3 px-4 text-gray-300">{combo.category || '-'}</td>
              <td className="py-3 px-4 text-gray-300">{combo.unit || '-'}</td>
              <td className="py-3 px-4 text-right text-gray-300">{combo.occurrences}</td>
              <td className="py-3 px-4 text-right text-gray-300">{combo.downloads}</td>
              <td className="py-3 px-4 text-right">
                <span className={`font-semibold ${
                  combo.conversionRate > 5 ? 'text-green-400' : 
                  combo.conversionRate > 0 ? 'text-yellow-400' : 
                  'text-gray-400'
                }`}>
                  {combo.conversionRate}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ========================================
// 📱 DEVICE ANALYTICS DETAIL CARD
// ========================================
// In FilterAnalyticsDashboard.jsx

// ========================================
// 📱 DEVICE ANALYTICS DETAIL CARD (UPDATED)
// ========================================
const DeviceAnalyticsDetailCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Monitor className="w-5 h-5 text-cyan-400" />
        Device & Browser Analytics
      </h2>

      {/* ✅ NEW: Overall Summary */}
      {data.overall && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-[#0A0A0A] rounded-lg border border-white/5">
            <p className="text-xs text-gray-400">Total Sessions</p>
            <p className="text-lg font-bold text-white">{data.overall.totalUniqueSessions}</p>
          </div>
          <div className="p-3 bg-[#0A0A0A] rounded-lg border border-white/5">
            <p className="text-xs text-gray-400">Total Events</p>
            <p className="text-lg font-bold text-white">{data.overall.totalEvents}</p>
          </div>
          <div className="p-3 bg-[#0A0A0A] rounded-lg border border-white/5">
            <p className="text-xs text-gray-400">Total Downloads</p>
            <p className="text-lg font-bold text-white">{data.overall.totalDownloads}</p>
          </div>
          <div className="p-3 bg-[#0A0A0A] rounded-lg border border-white/5">
            <p className="text-xs text-gray-400">Avg Events/Session</p>
            <p className="text-lg font-bold text-white">{data.overall.avgEventsPerSession}</p>
          </div>
        </div>
      )}

      {/* ✅ Platform Summary Cards */}
      {data.summary && data.summary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {data.summary.map((platform) => {
            const Icon = platform.platform === 'mobile' ? Smartphone : 
                        platform.platform === 'tablet' ? Tablet : Monitor;
            
            return (
              <div key={platform.platform} className="p-4 bg-[#0A0A0A] rounded-lg border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-white font-semibold capitalize">{platform.platform}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sessions:</span>
                    <span className="text-white font-semibold">{platform.uniqueSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Events:</span>
                    <span className="text-gray-300">{platform.totalEvents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Downloads:</span>
                    <span className="text-green-400">{platform.downloads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Users:</span>
                    <span className="text-gray-300">{platform.uniqueUsers}</span>
                  </div>
                </div>
                
                {/* Browser breakdown */}
                {platform.browsers && platform.browsers.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-xs text-gray-400 mb-2">Browsers:</p>
                    <div className="space-y-1">
                      {platform.browsers.slice(0, 3).map((browser, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-gray-300 capitalize">{browser.browser || 'Unknown'}</span>
                          <span className="text-gray-400">{browser.sessions}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Detailed Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Platform</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Browser</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Sessions</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Events</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Events/Session</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Downloads</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Conv. Rate</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Avg Time</th>
            </tr>
          </thead>
          <tbody>
            {data.detailed?.map((device, idx) => (
              <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-white capitalize">{device.platform}</td>
                <td className="py-3 px-4 text-gray-300 capitalize">{device.browser || 'Unknown'}</td>
                <td className="py-3 px-4 text-right text-white font-semibold">
                  {device.uniqueSessions}
                </td>
                <td className="py-3 px-4 text-right text-gray-400">
                  {device.totalEvents}
                </td>
                <td className="py-3 px-4 text-right text-gray-300">
                  {device.eventsPerSession}
                </td>
                <td className="py-3 px-4 text-right text-gray-300">{device.downloads}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-semibold ${
                    device.conversionRate > 5 ? 'text-green-400' : 
                    device.conversionRate > 2 ? 'text-yellow-400' : 
                    'text-gray-400'
                  }`}>
                    {device.conversionRate}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-gray-300">
                  {device.avgTimeOnPage}s
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ No data state */}
      {(!data.detailed || data.detailed.length === 0) && (
        <div className="text-center py-12">
          <Monitor className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No device analytics available for this period</p>
        </div>
      )}
    </div>
  );
};
// ========================================
// 📊 ENGAGEMENT METRIC ENHANCED
// ========================================
const EngagementMetricEnhanced = ({ 
  label, 
  value, 
  numericValue, 
  icon, 
  color = 'blue',
  benchmark,
  benchmarkLabel,
  isLowerBetter = false,
  description 
}) => {
  // Color schemes
  const colors = {
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
      progress: 'bg-blue-500'
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
      progress: 'bg-purple-500'
    },
    green: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/20',
      progress: 'bg-green-500'
    },
    yellow: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      border: 'border-yellow-500/20',
      progress: 'bg-yellow-500'
    }
  };

  const scheme = colors[color];

  // Calculate if metric is good
  const isGood = numericValue !== null && (
    isLowerBetter 
      ? numericValue < benchmark 
      : numericValue >= benchmark
  );

  // Calculate progress percentage
  const progressPercentage = numericValue !== null
    ? isLowerBetter
      ? Math.min((benchmark / numericValue) * 100, 100)
      : Math.min((numericValue / benchmark) * 100, 100)
    : 0;

  return (
    <div className={`p-4 ${scheme.bg} rounded-lg border ${scheme.border} relative overflow-hidden group hover:scale-105 transition-transform`}>
      {/* Icon */}
      <div className={`${scheme.text} mb-3`}>
        {icon}
      </div>

      {/* Label */}
      <p className="text-gray-400 text-xs mb-1">{label}</p>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <p className={`text-2xl font-bold ${scheme.text}`}>{value}</p>
        
        {/* Status Badge */}
        {numericValue !== null && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isGood 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-orange-500/20 text-orange-400'
          }`}>
            {isGood ? '✓ Good' : '⚠ Low'}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {numericValue !== null && (
        <div className="mb-2">
          <div className="w-full bg-[#0A0A0A] rounded-full h-1.5">
            <div
              className={`${scheme.progress} h-1.5 rounded-full transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Benchmark Label */}
      {benchmarkLabel && (
        <p className="text-xs text-gray-500">{benchmarkLabel}</p>
      )}

      {/* ✅ Tooltip on Hover */}
      {description && (
        <div className="absolute inset-0 bg-black/95 rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
          <div className="text-center">
            <p className="text-white font-semibold mb-1">{label}</p>
            <p className="text-xs text-gray-300">{description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterAnalyticsDashboard;
