// LogsTab.jsx — Complete Updated Version
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRequestAnalytics,
  fetchSlowEndpoints,
  fetchErrorBreakdown,
  fetchTrafficHeatmap,
  fetchTopEndpoints,
  fetchTopUsers,
  fetchSuspiciousActivity,
  fetchDeviceIntelligence,
  fetchUserBehaviorSignals,
  setSelectedHours,
  selectRiskLevel,
  selectSelectedHours,
} from '../../../REDUX/Slices/logsSlice';
import {
  FileText, Terminal, BarChart2, Activity,
  Gauge, AlertTriangle, Smartphone, Users,
  RefreshCw, Shield, TrendingUp, Layers,
} from 'lucide-react';

// ── Existing displays
import RequestLogsDisplay   from './RequestLogsDisplay';
import ConsoleLogsDisplay   from './ConsoleLogsDisplay';
import LogsStatsDisplay     from './LogsStatsDisplay';

// ── New analytics panels (create these next)
import AnalyticsOverviewPanel from '../panels/AnalyticsOverviewPanel';
import SlowEndpointsPanel        from '../panels/SlowEndpointsPanel';
import ErrorBreakdownPanel       from '../panels/ErrorBreakdownPanel';
import TrafficHeatmapPanel       from '../panels/TrafficHeatmapPanel';
import TopEndpointsPanel         from '../panels/TopEndpointsPanel';
import TopUsersPanel             from '../panels/TopUsersPanel';
import SuspiciousActivityPanel   from '../panels/SuspiciousActivityPanel';
import DeviceIntelligencePanel   from '../panels/DeviceIntelligencePanel';
import UserBehaviorPanel         from '../panels/UserBehaviorPanel';

// ─────────────────────────────────────────────
// 📋 TAB CONFIG
// ─────────────────────────────────────────────
const TABS = [
  // ── Raw logs group
  { id: 'requests', label: 'Request Logs',  icon: FileText,      group: 'logs'      },
  { id: 'console',  label: 'Console Logs',  icon: Terminal,      group: 'logs'      },
  { id: 'stats',    label: 'Statistics',    icon: BarChart2,     group: 'logs'      },

  // ── Analytics group
  { id: 'analytics',  label: 'Overview',      icon: Activity,      group: 'analytics' },
  { id: 'endpoints',  label: 'Top Endpoints', icon: Layers,        group: 'analytics' },
  { id: 'slow',       label: 'Slow APIs',     icon: Gauge,         group: 'analytics' },
  { id: 'errors',     label: 'Errors',        icon: AlertTriangle, group: 'analytics' },
  { id: 'heatmap',    label: 'Heatmap',       icon: TrendingUp,    group: 'analytics' },

  // ── Security group
  { id: 'suspicious', label: 'Suspicious',    icon: Shield,        group: 'security'  },
  { id: 'devices',    label: 'Devices',       icon: Smartphone,    group: 'security'  },
  { id: 'users',      label: 'Top Users',     icon: Users,         group: 'security'  },
  { id: 'behavior',   label: 'Behavior',      icon: Users,         group: 'security'  },
];

const GROUP_LABELS = {
  logs:      'Raw Logs',
  analytics: 'Analytics',
  security:  'Security & Intelligence',
};

const HOURS_OPTIONS = [1, 3, 6, 12, 24];

// ─────────────────────────────────────────────
// 🔧 HELPERS
// ─────────────────────────────────────────────
const RISK_STYLE = {
  LOW:    { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  MEDIUM: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  HIGH:   { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

// ─────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────
export default function LogsTab() {
  const dispatch      = useDispatch();
  const hours         = useSelector(selectSelectedHours);
  const risk          = useSelector(selectRiskLevel);

  const [activeTab,   setActiveTab]   = useState('requests');
  const [refreshing,  setRefreshing]  = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  // ── Analytics tabs only — raw log tabs don't need this
  const isAnalyticsTab = TABS.find(t => t.id === activeTab)?.group !== 'logs';

  // ── Fetch all analytics panels
  const fetchAll = (h = hours) => {
    dispatch(fetchRequestAnalytics(h));
    dispatch(fetchSlowEndpoints({ hours: h }));
    dispatch(fetchErrorBreakdown(h));
    dispatch(fetchTrafficHeatmap(h));
    dispatch(fetchTopEndpoints({ hours: h }));
    dispatch(fetchTopUsers({ hours: h }));
    dispatch(fetchSuspiciousActivity(h));
    dispatch(fetchDeviceIntelligence(h));
    dispatch(fetchUserBehaviorSignals({ hours: h }));
    setLastRefresh(new Date());
  };

  // ── Initial fetch on mount
  useEffect(() => {
    fetchAll(hours);
  }, []);

  // ── Refetch when hours changes
  useEffect(() => {
    fetchAll(hours);
  }, [hours]);

  const handleRefresh = async () => {
    setRefreshing(true);
    fetchAll(hours);
    await new Promise(r => setTimeout(r, 800));
    setRefreshing(false);
  };

  const handleHoursChange = (h) => {
    dispatch(setSelectedHours(h));
  };

  const riskStyle = RISK_STYLE[risk.level] || RISK_STYLE.LOW;

  // ── Group tabs for rendering
  const groups = ['logs', 'analytics', 'security'];

  return (
    <div className="space-y-4">

      {/* ══ TOP BAR — Hours filter + Refresh + Risk badge ══ */}
      <div className="flex flex-wrap items-center justify-between gap-3
        bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl px-4 py-3">

        {/* Left — Hours selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#4B5563] font-medium">Window:</span>
          <div className="flex items-center gap-1 bg-[#1A1A1A] rounded-lg p-1">
            {HOURS_OPTIONS.map(h => (
              <button
                key={h}
                onClick={() => handleHoursChange(h)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  hours === h
                    ? 'bg-[#3F3F3F] text-white'
                    : 'text-[#6B7280] hover:text-white'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Right — Risk badge + Refresh */}
        <div className="flex items-center gap-3">

          {/* Risk badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            border text-xs font-semibold
            ${riskStyle.bg} ${riskStyle.border} ${riskStyle.text}`}>
            <Shield className="w-3.5 h-3.5" />
            <span>Risk: {risk.level}</span>
            <span className="opacity-60">({risk.score}/100)</span>
          </div>

          {/* Last refresh time */}
          {lastRefresh && (
            <span className="text-[10px] text-[#4B5563] hidden md:block">
              Updated {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              bg-[#1A1A1A] border border-[#2F2F2F] text-xs font-medium
              text-[#9CA3AF] hover:text-white hover:border-[#4F4F4F]
              transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* ══ TAB BAR — grouped ══ */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-3 space-y-3">
        {groups.map(group => (
          <div key={group}>

            {/* Group label */}
            <p className="text-[10px] text-[#3F3F3F] uppercase tracking-widest
              font-semibold mb-2 px-1">
              {GROUP_LABELS[group]}
            </p>

            {/* Tab buttons */}
            <div className="flex flex-wrap gap-1">
              {TABS.filter(t => t.group === group).map(tab => {
                const Icon    = tab.icon;
                const isActive = activeTab === tab.id;

                // ✅ Show red dot on suspicious tab when risk is HIGH/MEDIUM
                const showAlert = tab.id === 'suspicious' &&
                  (risk.level === 'HIGH' || risk.level === 'MEDIUM');

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5
                      rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#2F2F2F] text-white border border-[#3F3F3F]'
                        : 'text-[#6B7280] hover:text-white hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{tab.label}</span>

                    {/* ✅ Alert dot for suspicious tab */}
                    {showAlert && (
                      <span className={`absolute -top-0.5 -right-0.5 w-2 h-2
                        rounded-full ${
                          risk.level === 'HIGH' ? 'bg-red-500' : 'bg-yellow-500'
                        } animate-pulse`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ══ PANEL CONTENT ══ */}
      <div>
        {/* ── Raw Logs */}
        {activeTab === 'requests'  && <RequestLogsDisplay />}
        {activeTab === 'console'   && <ConsoleLogsDisplay />}
        {activeTab === 'stats'     && <LogsStatsDisplay />}

        {/* ── Analytics */}
        {activeTab === 'analytics' && <AnalyticsOverviewPanel />}
        {activeTab === 'endpoints' && <TopEndpointsPanel />}
        {activeTab === 'slow'      && <SlowEndpointsPanel />}
        {activeTab === 'errors'    && <ErrorBreakdownPanel />}
        {activeTab === 'heatmap'   && <TrafficHeatmapPanel />}

        {/* ── Security & Intelligence */}
        {activeTab === 'suspicious'&& <SuspiciousActivityPanel />}
        {activeTab === 'devices'   && <DeviceIntelligencePanel />}
        {activeTab === 'users'     && <TopUsersPanel />}
        {activeTab === 'behavior'  && <UserBehaviorPanel />}
      </div>

    </div>
  );
}
