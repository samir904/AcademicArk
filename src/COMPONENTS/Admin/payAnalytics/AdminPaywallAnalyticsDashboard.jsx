// src/COMPONENTS/admin/AdminPaywallAnalyticsDashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  MousePointerClick,
  CreditCard,
  TrendingUp,
  Users,
  CheckCircle2,
  Flame,
  Zap,
  Snowflake,
  Filter,
  ArrowRight,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Award,
  Sparkles,
  Lock,
  MessageSquare,
  X,
  Calendar,
  Mail,
  GraduationCap,
  FileText,
  BookOpen,
  Layers
} from "lucide-react";

import {
  fetchFunnelOverview,
  fetchEventBreakdown,
  fetchUserSegments,
  fetchTopNotes,
  fetchMostPaywalledNotes
} from "../../../REDUX/Slices/adminPaywallSlice";

import {
  selectFunnelTotals,
  selectFunnelSeriesByDay,
  selectEventCountsMap,
  selectSegmentCounts,
  selectTopNotes,
  selectMostPaywalledNotes
} from "../../../REDUX/selectors/adminPaywallSelectors";

const AdminPaywallAnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const [animateCards, setAnimateCards] = useState(false);

  const funnelTotals = useSelector(selectFunnelTotals);
  const funnelSeries = useSelector(selectFunnelSeriesByDay);
  const eventMap = useSelector(selectEventCountsMap);
  const segmentCounts = useSelector(selectSegmentCounts);
  const topNotes = useSelector(selectTopNotes);
  const mostPaywalledNotes = useSelector(selectMostPaywalledNotes);

  const status = useSelector((s) => s.adminPaywall.status);
  const error = useSelector((s) => s.adminPaywall.error);
  const segments = useSelector((s) => s.adminPaywall.userSegments);

  useEffect(() => {
    dispatch(fetchFunnelOverview());
    dispatch(fetchEventBreakdown());
    dispatch(fetchUserSegments());
    dispatch(fetchTopNotes());
    dispatch(fetchMostPaywalledNotes());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => setAnimateCards(true), 100);
  }, []);

  const isLoading =
    status.funnelOverview === "loading" ||
    status.eventBreakdown === "loading" ||
    status.userSegments === "loading" ||
    status.topNotes === "loading";

  const anyError =
    error.funnelOverview || error.eventBreakdown || error.userSegments || error.topNotes;

  if (isLoading) {
    return (
      <div className="p-8 bg-black min-h-screen">
        <LoadingSkeleton />
      </div>
    );
  }

  if (anyError) {
    return (
      <div className="p-8 bg-black min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl blur opacity-25"></div>
            <div className="relative bg-zinc-950 border border-red-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <X className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-400">Error Loading Data</h3>
                  <p className="text-sm text-red-300/60">Failed to fetch analytics</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">{String(anyError)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Ambient Glow Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/3 rounded-full blur-[120px]"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none"></div>

      <div className="relative z-10 p-8 space-y-8 max-w-[1800px] mx-auto">
        {/* Sleek Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-600/20">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white tracking-tight">
                Paywall Analytics
              </h1>
              <p className="text-base text-gray-500 mt-1">
                Real-time conversion metrics, funnel insights & behavioral analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            <div className="h-1 w-8 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full"></div>
          </div>
        </div>

        {/* Premium KPI Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <PremiumKpiCard
            title="Paywall Impressions"
            value={funnelTotals.paywallShown}
            gradient="from-blue-600 to-cyan-600"
            Icon={Eye}
            trend="+12.5%"
          />
          <PremiumKpiCard
            title="Support Engagements"
            value={funnelTotals.supportClicks}
            gradient="from-amber-600 to-orange-600"
            Icon={MousePointerClick}
            trend="+8.3%"
          />
          <PremiumKpiCard
            title="Successful Payments"
            value={funnelTotals.paymentSuccess}
            gradient="from-emerald-600 to-green-600"
            Icon={CreditCard}
            trend="+15.7%"
          />
          <PremiumKpiCard
            title="Conversion Rate"
            value={`${funnelTotals.overallConversionRate}%`}
            gradient="from-purple-600 to-pink-600"
            Icon={TrendingUp}
            trend="+4.2%"
          />
        </div>

        {/* Conversion Funnel Panel */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-purple-600/10 rounded-xl">
                <Filter className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Conversion Funnel Flow</h3>
              <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
                <Activity className="w-4 h-4" />
                <span>Live</span>
              </div>
            </div>

            <div className="space-y-6">
              <FunnelStage
                label="Preview → Support Click"
                percentage={funnelTotals.previewToSupportRate}
                color="from-blue-600 to-cyan-600"
                Icon={ArrowRight}
              />
              <FunnelStage
                label="Support → Payment"
                percentage={funnelTotals.supportToPaymentRate}
                color="from-purple-600 to-pink-600"
                Icon={ArrowRight}
              />
              <FunnelStage
                label="Overall Conversion"
                percentage={funnelTotals.overallConversionRate}
                color="from-emerald-600 to-green-600"
                Icon={Target}
              />
            </div>
          </div>
        </div>

        {/* Event Analytics Grid */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-cyan-600/10 rounded-xl">
                <PieChart className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Event Analytics</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(eventMap).length > 0 ? (
                Object.entries(eventMap).map(([key, value], idx) => (
                  <EventCard key={key} label={key} value={value} index={idx} />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <PieChart className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-600 text-lg">No event data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Segments */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-600/10 rounded-xl">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">User Segments</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <SegmentCard
              title="Total Users"
              value={segmentCounts.totalUsers}
              gradient="from-blue-600 to-cyan-600"
              Icon={Users}
            />
            <SegmentCard
              title="Converted"
              value={segmentCounts.converted}
              gradient="from-emerald-600 to-green-600"
              Icon={CheckCircle2}
            />
            <SegmentCard
              title="Hot Leads"
              value={segmentCounts.hotLeads}
              gradient="from-rose-600 to-orange-600"
              Icon={Flame}
            />
            <SegmentCard
              title="Warm Leads"
              value={segmentCounts.warmLeads}
              gradient="from-amber-600 to-yellow-600"
              Icon={Zap}
            />
            <SegmentCard
              title="Cold Leads"
              value={segmentCounts.coldLeads}
              gradient="from-slate-600 to-gray-600"
              Icon={Snowflake}
            />
          </div>
        </div>

        {/* Detailed User Breakdown */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-pink-600/10 rounded-xl">
                <Layers className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Detailed User Breakdown</h3>
            </div>

            {["converted", "hotLeads", "warmLeads", "coldLeads"].map((segmentKey) => {
              const segment = segments?.segments?.[segmentKey];
              if (!segment || segment.users.length === 0) return null;

              const segmentConfig = {
                converted: { color: "from-emerald-600 to-green-600", icon: CheckCircle2 },
                hotLeads: { color: "from-rose-600 to-orange-600", icon: Flame },
                warmLeads: { color: "from-amber-600 to-yellow-600", icon: Zap },
                coldLeads: { color: "from-slate-600 to-gray-600", icon: Snowflake }
              };

              const config = segmentConfig[segmentKey];

              return (
                <div key={segmentKey} className="mb-10 last:mb-0">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-2 bg-gradient-to-r ${config.color} rounded-lg`}>
                      <config.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white capitalize">
                      {segmentKey.replace(/([A-Z])/g, " $1")}
                    </h4>
                    <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-300">{segment.users.length}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {segment.users.map((u) => (
                      <UserDetailCard key={u._id} user={u} segmentColor={config.color} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Paywalled Notes */}
        <DataTable
          title="Most Paywalled Notes"
          Icon={Flame}
          iconGradient="from-rose-600 to-orange-600"
          data={mostPaywalledNotes}
          columns={[
            { 
              key: "title", 
              label: "Note Title", 
              className: "font-semibold text-white",
              icon: FileText
            },
            { 
              key: "subject", 
              label: "Subject", 
              className: "capitalize text-gray-300",
              icon: BookOpen
            },
            { 
              key: "semester", 
              label: "Semester", 
              render: (val) => Array.isArray(val) ? val.join(", ") : val,
              className: "text-gray-300",
              icon: GraduationCap
            },
            { 
              key: "category", 
              label: "Category",
              className: "text-gray-300"
            },
            { 
              key: "count", 
              label: "Impressions", 
              className: "text-rose-400 font-bold text-lg",
              icon: Eye
            }
          ]}
        />

        {/* Top Converting Notes */}
        <DataTable
          title="Top Converting Notes"
          Icon={Award}
          iconGradient="from-emerald-600 to-green-600"
          data={topNotes}
          columns={[
            { 
              key: "title", 
              label: "Note Title", 
              className: "font-semibold text-white", 
              render: (val, item) => val || item._id,
              icon: FileText
            },
            { 
              key: "count", 
              label: "Conversions", 
              className: "text-emerald-400 font-bold text-lg", 
              render: (val, item) => val ?? item.conversions ?? 0,
              icon: Target
            }
          ]}
        />
      </div>
    </div>
  );
};

// ==================== COMPONENTS ====================

const PremiumKpiCard = ({ title, value, gradient, Icon, trend }) => {
  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500`}></div>
      
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {/* {trend && (
            <div className="flex items-center gap-1 px-3 py-1 bg-emerald-600/10 border border-emerald-600/20 rounded-full">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">{trend}</span>
            </div>
          )} */}
        </div>

        
        
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {title}
          </p>
          <h2 className={`text-4xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value ?? 0}
          </h2>
        </div>

        <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${gradient} rounded-full group-hover:w-full transition-all duration-700 ease-out`}></div>
      </div>
    </div>
  );
};

const FunnelStage = ({ label, percentage, color, Icon }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setTimeout(() => setWidth(percentage || 0), 400);
  }, [percentage]);

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-semibold text-gray-300">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-white">{percentage}</span>
          <span className="text-sm text-gray-500">%</span>
        </div>
      </div>
      
      <div className="relative h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1500 ease-out relative overflow-hidden`}
          style={{ width: `${width}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  );
};

const EventCard = ({ label, value, index }) => {
  return (
    <div
      className="group relative"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
      
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-xl p-5 hover:border-cyan-600/50 transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
            {label.replaceAll("_", " ")}
          </p>
        </div>
        <p className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          {value}
        </p>
      </div>
    </div>
  );
};

const SegmentCard = ({ title, value, gradient, Icon }) => {
  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500`}></div>
      
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-300">
        <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg mb-4 w-fit`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
          {title}
        </p>
        <h2 className={`text-4xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {value ?? 0}
        </h2>
      </div>
    </div>
  );
};

const UserDetailCard = ({ user, segmentColor }) => {
  const u = user;
  
  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${segmentColor} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-all duration-500`}></div>
      
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${segmentColor} flex items-center justify-center shadow-lg`}>
                <span className="text-white font-black text-lg">
                  {u.userId?.fullName?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg text-white mb-1">
                  {u.userId?.fullName}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{u.userId?.email}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-blue-600/10 border border-blue-600/20 text-blue-400 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {u.userId?.role}
              </span>
              {u.userId?.academicProfile?.semester && (
                <span className="px-3 py-1.5 bg-purple-600/10 border border-purple-600/20 text-purple-400 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Semester {u.userId.academicProfile.semester}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">First Exposure</p>
              <p className="text-sm font-bold text-gray-200">
                {new Date(u.firstExposureAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <MetricBadge label="Previews" value={u.previewsStarted} Icon={Eye} />
          <MetricBadge label="Paywall" value={u.paywallShownCount} Icon={Lock} />
          <MetricBadge label="Support" value={u.supportClickedCount} Icon={MessageSquare} />
          <MetricBadge label="Dismissed" value={u.paywallDismissedCount} Icon={X} />
        </div>

        <div>
          {u.hasConverted ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-600/30 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-emerald-400">Converted</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-600/30 rounded-xl">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-amber-400">In Progress</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MetricBadge = ({ label, value, Icon }) => (
  <div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-cyan-600/50 transition-all duration-300">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
      <p className="text-xs text-gray-500 font-semibold">{label}</p>
    </div>
    <p className="text-xl font-black text-white">
      {value ?? 0}
    </p>
  </div>
);

const DataTable = ({ title, Icon, iconGradient, data, columns }) => {
  return (
    <div className="relative group">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${iconGradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500`}></div>
      
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className={`p-3 bg-gradient-to-br ${iconGradient} rounded-xl shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <div className="ml-auto px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full">
            <span className="text-sm font-semibold text-gray-400">{data?.length || 0} items</span>
          </div>
        </div>

        {data?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  {columns.map((col, idx) => (
                    <th key={idx} className="py-4 px-6 text-left">
                      <div className="flex items-center gap-2">
                        {col.icon && <col.icon className="w-4 h-4 text-gray-600" />}
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {col.label}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {data.map((item, idx) => (
                  <tr
                    key={item?._id || idx}
                    className="hover:bg-zinc-900/50 transition-colors duration-200"
                  >
                    {columns.map((col, colIdx) => {
                      const value = item?.[col.key];
                      const displayValue = col.render ? col.render(value, item) : value;
                      
                      return (
                        <td key={colIdx} className={`py-4 px-6 text-sm ${col.className || 'text-gray-400'}`}>
                          {displayValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex p-4 bg-zinc-900 rounded-2xl mb-4">
              <Icon className="w-12 h-12 text-gray-700" />
            </div>
            <p className="text-gray-600 text-lg font-semibold">No data available</p>
            <p className="text-gray-700 text-sm mt-1">Data will appear here once available</p>
          </div>
        )}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-zinc-900 rounded-2xl"></div>
        <div className="flex-1">
          <div className="h-10 bg-zinc-900 rounded-lg w-64 mb-2"></div>
          <div className="h-4 bg-zinc-900 rounded w-96"></div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-zinc-900 rounded-2xl"></div>
        ))}
      </div>
      <div className="h-72 bg-zinc-900 rounded-3xl"></div>
      <div className="h-96 bg-zinc-900 rounded-3xl"></div>
    </div>
  );
};

export default AdminPaywallAnalyticsDashboard;
