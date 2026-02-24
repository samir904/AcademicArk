// panels/AnalyticsOverviewPanel.jsx
import { useSelector } from 'react-redux';
import { selectAnalytics } from '../../../REDUX/Slices/logsSlice';
import {
  Activity, Clock, AlertTriangle, Users,
  Globe, Zap, CheckCircle, TrendingUp,
} from 'lucide-react';


// ─────────────────────────────────────────────
// 🔧 HELPERS
// ─────────────────────────────────────────────
const rtColor = (ms) => {
  if (ms >= 2000) return 'text-red-400';
  if (ms >= 1000) return 'text-orange-400';
  if (ms >= 500)  return 'text-yellow-400';
  return 'text-green-400';
};
const errColor   = (r) => r > 10 ? 'text-red-400'    : r > 5 ? 'text-yellow-400' : 'text-green-400';
const errBg      = (r) => r > 10 ? 'bg-red-500/5 border-red-500/15'
                        : r > 5  ? 'bg-yellow-500/5 border-yellow-500/15'
                        :          'bg-green-500/5 border-green-500/15';

const METHOD_COLORS = {
  GET:     { bar: 'bg-blue-500',   text: 'text-blue-400',   card: 'bg-blue-500/5 border-blue-500/15'     },
  POST:    { bar: 'bg-green-500',  text: 'text-green-400',  card: 'bg-green-500/5 border-green-500/15'   },
  PUT:     { bar: 'bg-yellow-500', text: 'text-yellow-400', card: 'bg-yellow-500/5 border-yellow-500/15' },
  DELETE:  { bar: 'bg-red-500',    text: 'text-red-400',    card: 'bg-red-500/5 border-red-500/15'       },
  PATCH:   { bar: 'bg-purple-500', text: 'text-purple-400', card: 'bg-purple-500/5 border-purple-500/15' },
  HEAD:    { bar: 'bg-gray-500',   text: 'text-gray-400',   card: 'bg-[#1A1A1A] border-[#2F2F2F]'       },
  OPTIONS: { bar: 'bg-gray-500',   text: 'text-gray-400',   card: 'bg-[#1A1A1A] border-[#2F2F2F]'       },
};

const STATUS_STYLE = (code) => {
  if (code >= 500) return { bar: 'bg-red-500',    text: 'text-red-400'    };
  if (code >= 400) return { bar: 'bg-yellow-500', text: 'text-yellow-400' };
  if (code >= 300) return { bar: 'bg-blue-400',   text: 'text-blue-400'   };
  return               { bar: 'bg-green-500',  text: 'text-green-400'  };
};

const fmtTime = (t) => {
  try {
    const d = new Date(t);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  } catch { return ''; }
};


// ─────────────────────────────────────────────
// 🧩 KPI CARD
// ─────────────────────────────────────────────
const KPICard = ({ label, value, sub, icon: Icon, valueClass, cardClass }) => (
  <div className={`border rounded-xl p-4 flex flex-col gap-2 ${cardClass}`}>
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-[#4B5563] uppercase tracking-wider font-semibold">
        {label}
      </span>
      <Icon className={`w-3.5 h-3.5 ${valueClass} opacity-60`} />
    </div>
    <p className={`text-2xl font-bold tracking-tight ${valueClass}`}>{value}</p>
    {sub && <p className="text-[11px] text-[#4B5563]">{sub}</p>}
  </div>
);


// ─────────────────────────────────────────────
// 📊 TIMELINE SVG CHART
// ─────────────────────────────────────────────
const TimelineChart = ({ data }) => {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-32 text-[#3F3F3F] text-xs">
      No timeline data
    </div>
  );

  const svgW = 900, svgH = 160;
  const pL = 32, pR = 16, pT = 16, pB = 28;
  const cW = svgW - pL - pR;
  const cH = svgH - pT - pB;
  const n  = data.length;

  const maxReq = Math.max(...data.map(d => d.requests), 1);
  const maxRT  = Math.max(...data.map(d => d.avgResponseTime), 1);
  const barW   = Math.max(3, (cW / n) * 0.75);

  // x position for index i (center of bar)
  const xAt = (i) => pL + (i / Math.max(n - 1, 1)) * cW;

  // RT polyline
  const rtPoints = data
    .map((d, i) => `${xAt(i)},${pT + cH - (d.avgResponseTime / maxRT) * cH}`)
    .join(' ');

  // Show at most 7 x-axis labels
  const labelEvery = Math.ceil(n / 7);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full min-w-[480px]"
        style={{ height: 160 }}
      >
        {/* Grid lines */}
        {[0, 0.5, 1].map(t => (
          <g key={t}>
            <line
              x1={pL} y1={pT + cH * (1 - t)}
              x2={pL + cW} y2={pT + cH * (1 - t)}
              stroke="#1A1A1A" strokeWidth="1"
            />
            <text
              x={pL - 5} y={pT + cH * (1 - t) + 3}
              fill="#3A3A3A" fontSize="8" textAnchor="end"
            >
              {Math.round(maxReq * t)}
            </text>
          </g>
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const x   = xAt(i) - barW / 2;
          const reqH = (d.requests / maxReq) * cH;
          const errH = d.errors > 0 ? (d.errors / maxReq) * cH : 0;

          return (
            <g key={i}>
              <rect
                x={x} y={pT + cH - reqH}
                width={barW} height={reqH}
                fill="#3B82F6" fillOpacity="0.35" rx="1"
              />
              {errH > 0 && (
                <rect
                  x={x} y={pT + cH - errH}
                  width={barW} height={errH}
                  fill="#EF4444" fillOpacity="0.7" rx="1"
                />
              )}
            </g>
          );
        })}

        {/* Avg RT line */}
        {n > 1 && (
          <polyline
            points={rtPoints}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeOpacity="0.75"
            strokeLinejoin="round"
          />
        )}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % labelEvery !== 0 && i !== n - 1) return null;
          return (
            <text
              key={i}
              x={xAt(i)} y={svgH - 4}
              fill="#3A3A3A" fontSize="8" textAnchor="middle"
            >
              {fmtTime(d.time)}
            </text>
          );
        })}

        {/* X-axis base line */}
        <line
          x1={pL} y1={pT + cH}
          x2={pL + cW} y2={pT + cH}
          stroke="#1F1F1F" strokeWidth="1"
        />
      </svg>
    </div>
  );
};


// ─────────────────────────────────────────────
// 🔵 METHOD CARD
// ─────────────────────────────────────────────
const MethodCard = ({ method, count, errors, avgResponseTime, total }) => {
  const pct    = total > 0   ? (count  / total) * 100 : 0;
  const errPct = count > 0   ? (errors / count) * 100 : 0;
  const s      = METHOD_COLORS[method] || METHOD_COLORS.HEAD;

  return (
    <div className={`border rounded-xl p-4 space-y-3 ${s.card}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold font-mono ${s.text}`}>{method}</span>
        <span className="text-[10px] text-[#4B5563]">{pct.toFixed(1)}% traffic</span>
      </div>

      {/* Count */}
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-white">{count}</span>
        <span className="text-xs text-[#4B5563]">requests</span>
      </div>

      {/* Fill bar */}
      <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${pct}%` }} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div>
          <p className="text-[10px] text-[#4B5563] uppercase">Avg RT</p>
          <p className={`font-semibold ${rtColor(avgResponseTime)}`}>
            {avgResponseTime}ms
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#4B5563] uppercase">Error rate</p>
          <p className={`font-semibold ${errColor(errPct)}`}>
            {errPct.toFixed(1)}%
            <span className="text-[#3F3F3F] font-normal ml-1">({errors})</span>
          </p>
        </div>
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────
// 📊 STATUS ROW
// ─────────────────────────────────────────────
const StatusRow = ({ statusCode, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  const s   = STATUS_STYLE(statusCode);

  return (
    <div className="flex items-center gap-3">
      <span className={`w-10 text-xs font-mono font-bold ${s.text} flex-shrink-0`}>
        {statusCode}
      </span>
      <div className="flex-1 h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${s.bar} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-white font-semibold w-8 text-right">{count}</span>
      <span className="text-xs text-[#4B5563] w-12 text-right">{pct.toFixed(1)}%</span>
    </div>
  );
};


// ─────────────────────────────────────────────
// ⏳ SKELETON LOADER
// ─────────────────────────────────────────────
const Skeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-24 bg-[#1A1A1A] rounded-xl" />
      ))}
    </div>
    <div className="h-44 bg-[#1A1A1A] rounded-xl" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="h-48 bg-[#1A1A1A] rounded-xl" />
      <div className="h-48 bg-[#1A1A1A] rounded-xl" />
    </div>
  </div>
);


// ─────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────
export default function AnalyticsOverviewPanel() {
  const { data: analytics, loading, error } = useSelector(selectAnalytics);
  const { overview, methodBreakdown = [], statusBreakdown = [], timeline = [] } = analytics || {};

  if (loading) return <Skeleton />;

  if (error) return (
    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20
      rounded-xl px-4 py-3">
      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  if (!overview) return (
    <div className="flex items-center justify-center py-20 text-[#4B5563] text-sm">
      No analytics data — select a time window and refresh
    </div>
  );

  const total       = overview.totalRequests || 1;
  const successCount = total - overview.totalErrors;
  const successRate = ((successCount / total) * 100).toFixed(1);

  // Aggregate 2xx count from statusBreakdown
  const total2xx = statusBreakdown
    .filter(s => s.statusCode >= 200 && s.statusCode < 300)
    .reduce((a, s) => a + s.count, 0);

  return (
    <div className="space-y-5">

      {/* ══ ROW 1 — KPI Cards ══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

        <KPICard
          label="Total Requests"
          value={overview.totalRequests?.toLocaleString()}
          icon={Activity}
          valueClass="text-blue-400"
          cardClass="bg-blue-500/5 border-blue-500/15"
        />
        <KPICard
          label="Avg Response Time"
          value={`${overview.avgResponseTime}ms`}
          sub={`Max ${overview.maxResponseTime}ms · Min ${overview.minResponseTime}ms`}
          icon={Clock}
          valueClass={rtColor(overview.avgResponseTime)}
          cardClass={overview.avgResponseTime > 1000
            ? 'bg-red-500/5 border-red-500/15'
            : overview.avgResponseTime > 500
              ? 'bg-yellow-500/5 border-yellow-500/15'
              : 'bg-green-500/5 border-green-500/15'}
        />
        <KPICard
          label="Error Rate"
          value={`${overview.errorRate}%`}
          sub={`${overview.totalErrors} total errors`}
          icon={AlertTriangle}
          valueClass={errColor(overview.errorRate)}
          cardClass={errBg(overview.errorRate)}
        />
        <KPICard
          label="Success Rate"
          value={`${successRate}%`}
          sub={`${successCount.toLocaleString()} successful`}
          icon={CheckCircle}
          valueClass="text-green-400"
          cardClass="bg-green-500/5 border-green-500/15"
        />
        <KPICard
          label="Unique Users"
          value={overview.uniqueUsers}
          sub="Authenticated"
          icon={Users}
          valueClass="text-purple-400"
          cardClass="bg-purple-500/5 border-purple-500/15"
        />
        <KPICard
          label="Unique IPs"
          value={overview.uniqueIPs}
          sub="Distinct clients"
          icon={Globe}
          valueClass="text-cyan-400"
          cardClass="bg-cyan-500/5 border-cyan-500/15"
        />
        <KPICard
          label="4xx Client Errors"
          value={overview.total4xx}
          sub="Bad requests"
          icon={AlertTriangle}
          valueClass={overview.total4xx > 0 ? 'text-yellow-400' : 'text-[#4B5563]'}
          cardClass={overview.total4xx > 0
            ? 'bg-yellow-500/5 border-yellow-500/15'
            : 'bg-[#0F0F0F] border-[#1F1F1F]'}
        />
        <KPICard
          label="5xx Server Errors"
          value={overview.total5xx}
          sub="Internal errors"
          icon={Zap}
          valueClass={overview.total5xx > 0 ? 'text-red-400' : 'text-[#4B5563]'}
          cardClass={overview.total5xx > 0
            ? 'bg-red-500/5 border-red-500/15'
            : 'bg-[#0F0F0F] border-[#1F1F1F]'}
        />
      </div>

      {/* ══ ROW 2 — Timeline ══ */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Request Timeline</h3>
            <p className="text-xs text-[#4B5563] mt-0.5">
              {timeline.length} data points · Requests, errors, avg response time
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-blue-500/50" />
              <span className="text-[11px] text-[#6B7280]">Requests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-red-500/60" />
              <span className="text-[11px] text-[#6B7280]">Errors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-[2px] bg-yellow-500/75 rounded" />
              <span className="text-[11px] text-[#6B7280]">Avg RT</span>
            </div>
          </div>
        </div>

        <TimelineChart data={timeline} />

        {/* Timeline quick stats */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#1A1A1A]">
          {[
            {
              label: 'Peak Requests',
              value: Math.max(...timeline.map(t => t.requests)),
              sub:   'in a single minute',
              color: 'text-blue-400',
            },
            {
              label: 'Peak Errors',
              value: Math.max(...timeline.map(t => t.errors)),
              sub:   'in a single minute',
              color: 'text-red-400',
            },
            {
              label: 'Peak Avg RT',
              value: `${Math.max(...timeline.map(t => t.avgResponseTime))}ms`,
              sub:   'slowest minute',
              color: 'text-yellow-400',
            },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-[10px] text-[#4B5563] mt-0.5">{item.label}</p>
              <p className="text-[10px] text-[#3F3F3F]">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ ROW 3 — Method + Status ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Method breakdown */}
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Method Breakdown</h3>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Traffic + error rate per HTTP method
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {methodBreakdown.map(m => (
              <MethodCard key={m.method} {...m} total={total} />
            ))}
          </div>
        </div>

        {/* Status distribution */}
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Status Code Distribution</h3>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Response code breakdown
            </p>
          </div>

          {/* Bars */}
          <div className="space-y-3">
            {statusBreakdown.map(s => (
              <StatusRow key={s.statusCode} {...s} total={total} />
            ))}
          </div>

          {/* Summary bottom strip */}
          <div className="pt-4 border-t border-[#1A1A1A] grid grid-cols-3 gap-2">
            {[
              { label: '2xx Success', count: total2xx,         color: 'text-green-400'  },
              { label: '4xx Client',  count: overview.total4xx, color: 'text-yellow-400' },
              { label: '5xx Server',  count: overview.total5xx, color: 'text-red-400'    },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className={`text-xl font-bold ${item.color}`}>
                  {((item.count / total) * 100).toFixed(1)}%
                </p>
                <p className="text-[10px] text-[#4B5563] mt-0.5">{item.label}</p>
                <p className="text-[10px] text-[#3F3F3F]">{item.count} reqs</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
