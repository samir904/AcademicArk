// panels/SlowEndpointsPanel.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSlowEndpoints } from '../../../REDUX/Slices/logsSlice';
import {
  Gauge, AlertTriangle, TrendingUp,
  ChevronUp, ChevronDown, ArrowUpDown, Clock,
} from 'lucide-react';

// ─────────────────────────────────────────────
// 🔧 HELPERS
// ─────────────────────────────────────────────
const METHOD_STYLE = {
  GET:    'bg-blue-500/10   text-blue-400   border-blue-500/20',
  POST:   'bg-green-500/10  text-green-400  border-green-500/20',
  PUT:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  DELETE: 'bg-red-500/10    text-red-400    border-red-500/20',
  PATCH:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  HEAD:   'bg-gray-500/10   text-gray-400   border-gray-500/20',
};

// RT severity — above threshold everything is already slow
const rtSeverity = (ms) => {
  if (ms >= 3000) return { color: 'text-red-400',    bg: 'bg-red-500',    label: 'Critical', card: 'bg-red-500/5 border-red-500/20'       };
  if (ms >= 2000) return { color: 'text-orange-400', bg: 'bg-orange-500', label: 'High',     card: 'bg-orange-500/5 border-orange-500/20'  };
  if (ms >= 1500) return { color: 'text-yellow-400', bg: 'bg-yellow-500', label: 'Medium',   card: 'bg-yellow-500/5 border-yellow-500/20'  };
  return               { color: 'text-blue-400',   bg: 'bg-blue-500',   label: 'Low',      card: 'bg-blue-500/5 border-blue-500/20'       };
};

const fmtMs = (ms) => ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms}ms`;

// Jitter = max - min (spread of response times)
const jitter = (row) => row.maxResponseTime - row.minResponseTime;

const SORT_KEYS = ['avgResponseTime', 'maxResponseTime', 'minResponseTime', 'count'];

// ─────────────────────────────────────────────
// 🧩 SPEEDOMETER BAR
// ─────────────────────────────────────────────
const SpeedBar = ({ value, max, severity }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${severity.bg}`}
        style={{ width: `${pct}%`, opacity: 0.7 }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────
// 🧩 SORT HEADER
// ─────────────────────────────────────────────
const SortHeader = ({ label, sortKey, current, dir, onSort }) => {
  const active = current === sortKey;
  return (
    <th
      className="px-4 py-3 text-left cursor-pointer select-none group"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1.5">
        <span className={`text-[10px] uppercase tracking-wider font-semibold
          transition-colors ${active ? 'text-white' : 'text-[#4B5563] group-hover:text-[#6B7280]'}`}>
          {label}
        </span>
        {active
          ? dir === 'desc'
            ? <ChevronDown className="w-3 h-3 text-orange-400" />
            : <ChevronUp   className="w-3 h-3 text-orange-400" />
          : <ArrowUpDown className="w-3 h-3 text-[#2F2F2F] group-hover:text-[#4B5563]" />
        }
      </div>
    </th>
  );
};

// ─────────────────────────────────────────────
// 🧩 EXPANDED ROW DETAIL
// ─────────────────────────────────────────────
const ExpandedDetail = ({ row }) => {
  const sev     = rtSeverity(row.avgResponseTime);
  const jitterMs = jitter(row);
  const jitterPct = row.maxResponseTime > 0
    ? ((jitterMs / row.maxResponseTime) * 100).toFixed(0)
    : 0;

  return (
    <tr className="bg-[#080808] border-b border-[#1A1A1A]">
      <td colSpan={6} className="px-6 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          {/* Severity */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">Severity</p>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1
              rounded-lg border text-xs font-bold ${sev.card} ${sev.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sev.bg}`} />
              {sev.label}
            </div>
            <p className="text-[10px] text-[#3F3F3F]">
              {sev.label === 'Critical' && 'Immediate action needed'}
              {sev.label === 'High'     && 'Needs optimization'}
              {sev.label === 'Medium'   && 'Monitor closely'}
              {sev.label === 'Low'      && 'Acceptable — watch trend'}
            </p>
          </div>

          {/* RT Range */}
          <div className="space-y-2">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">RT Range</p>
            <div className="space-y-1">
              {[
                { label: 'Min', val: row.minResponseTime, color: 'text-yellow-400' },
                { label: 'Avg', val: row.avgResponseTime, color: sev.color         },
                { label: 'Max', val: row.maxResponseTime, color: 'text-red-400'    },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[11px] text-[#4B5563] w-6">{label}</span>
                  <div className="flex-1 mx-2 h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${sev.bg}`}
                      style={{ width: `${(val / row.maxResponseTime) * 100}%`, opacity: 0.6 }}
                    />
                  </div>
                  <span className={`text-[11px] font-semibold ${color} w-14 text-right`}>
                    {fmtMs(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Jitter */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">Jitter (Max − Min)</p>
            <p className={`text-xl font-bold ${jitterMs > 500 ? 'text-orange-400' : 'text-[#9CA3AF]'}`}>
              {fmtMs(jitterMs)}
            </p>
            <p className="text-[10px] text-[#3F3F3F]">
              {jitterPct}% spread from max
            </p>
            <p className="text-[10px] text-[#4B5563]">
              {jitterMs === 0
                ? 'Consistent — no variation'
                : jitterMs > 500
                  ? '⚠️ High variance — unstable'
                  : 'Moderate variance'}
            </p>
          </div>

          {/* Hit count + tip */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">Hit Count</p>
            <p className="text-xl font-bold text-white">{row.count}×</p>
            <p className="text-[10px] text-[#3F3F3F]">
              {row.count === 1
                ? 'Single occurrence — could be a spike'
                : `Consistently slow across ${row.count} requests`}
            </p>
            <div className={`mt-1 px-2 py-1 rounded-md text-[10px]
              ${row.count > 3
                ? 'bg-red-500/10 text-red-400'
                : 'bg-[#1A1A1A] text-[#6B7280]'}`}>
              {row.count > 3
                ? '🚨 Recurring issue — investigate now'
                : '💡 Isolated — monitor for recurrence'}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

// ─────────────────────────────────────────────
// 🧩 SKELETON
// ─────────────────────────────────────────────
const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="grid grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 bg-[#1A1A1A] rounded-xl" />
      ))}
    </div>
    <div className="h-64 bg-[#1A1A1A] rounded-xl" />
  </div>
);

// ─────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────
export default function SlowEndpointsPanel() {
  const { data: endpoints = [], loading, error, threshold, hours } =
    useSelector(selectSlowEndpoints);

  const [sortKey,     setSortKey]     = useState('avgResponseTime');
  const [sortDir,     setSortDir]     = useState('desc');
  const [expandedRow, setExpandedRow] = useState(null);
  const [sevFilter,   setSevFilter]   = useState('all');

  if (loading) return <Skeleton />;
  if (error)   return (
    <div className="flex items-center gap-3 bg-red-500/10 border
      border-red-500/20 rounded-xl px-4 py-3">
      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  if (!endpoints.length) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center
        justify-center mb-4">
        <Gauge className="w-6 h-6 text-green-400" />
      </div>
      <p className="text-green-400 font-semibold text-sm">
        No slow endpoints detected 🎉
      </p>
      <p className="text-[#4B5563] text-xs mt-1">
        All routes under {threshold}ms threshold in last {hours}h
      </p>
    </div>
  );

  // ── Aggregate stats
  const maxRT   = Math.max(...endpoints.map(e => e.avgResponseTime));
  const avgOfAvg = (endpoints.reduce((s, e) => s + e.avgResponseTime, 0)
    / endpoints.length).toFixed(0);
  const totalHits = endpoints.reduce((s, e) => s + e.count, 0);

  // Severity distribution
  const sevCounts = endpoints.reduce((acc, e) => {
    const sev = rtSeverity(e.avgResponseTime).label;
    acc[sev] = (acc[sev] || 0) + 1;
    return acc;
  }, {});

  // ── Filter by severity
  const SEV_OPTIONS = ['all', 'Critical', 'High', 'Medium', 'Low'];
  const filtered = endpoints.filter(e =>
    sevFilter === 'all' ? true : rtSeverity(e.avgResponseTime).label === sevFilter
  );

  // ── Sort
  const sorted = [...filtered].sort((a, b) =>
    sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]
  );

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const toggleRow = (idx) => setExpandedRow(r => r === idx ? null : idx);

  return (
    <div className="space-y-4">

      {/* ══ HEADER STRIP ══ */}
      <div className="flex flex-wrap items-center justify-between gap-3
        bg-orange-500/5 border border-orange-500/15 rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center
            justify-center">
            <Gauge className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Slow Endpoint Analysis</p>
            <p className="text-[11px] text-[#6B7280]">
              Routes exceeding <span className="text-orange-400 font-semibold">
                {threshold}ms
              </span> threshold · Last {hours}h
            </p>
          </div>
        </div>

        {/* Severity distribution pills */}
        <div className="flex items-center gap-2">
          {Object.entries(sevCounts).map(([sev, count]) => {
            const s = rtSeverity(
              sev === 'Critical' ? 3001 :
              sev === 'High'     ? 2001 :
              sev === 'Medium'   ? 1501 : 1001
            );
            return (
              <div key={sev}
                className={`flex items-center gap-1 px-2 py-1 rounded-md
                  border text-[10px] font-semibold ${s.card} ${s.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.bg}`} />
                {count} {sev}
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ KPI CARDS ══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Slow Endpoints',
            value: endpoints.length,
            sub:   `Above ${threshold}ms`,
            icon:  Gauge,
            color: 'text-orange-400',
            card:  'bg-orange-500/5 border-orange-500/15',
          },
          {
            label: 'Slowest (Avg RT)',
            value: fmtMs(maxRT),
            sub:   sorted[0]?.path || '—',
            icon:  TrendingUp,
            color: rtSeverity(maxRT).color,
            card:  rtSeverity(maxRT).card,
          },
          {
            label: 'Avg of Avgs',
            value: fmtMs(parseInt(avgOfAvg)),
            sub:   'Mean across slow routes',
            icon:  Clock,
            color: rtSeverity(parseInt(avgOfAvg)).color,
            card:  rtSeverity(parseInt(avgOfAvg)).card,
          },
          {
            label: 'Total Slow Hits',
            value: totalHits,
            sub:   'Requests affected',
            icon:  AlertTriangle,
            color: totalHits > 5 ? 'text-red-400' : 'text-yellow-400',
            card:  totalHits > 5
              ? 'bg-red-500/5 border-red-500/15'
              : 'bg-yellow-500/5 border-yellow-500/15',
          },
        ].map(item => (
          <div key={item.label} className={`border rounded-xl p-4 space-y-1.5 ${item.card}`}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-[#4B5563] uppercase tracking-wider font-semibold">
                {item.label}
              </p>
              <item.icon className={`w-3.5 h-3.5 ${item.color} opacity-60`} />
            </div>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-[11px] text-[#4B5563] truncate" title={item.sub}>
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ══ FILTER BAR ══ */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl
        px-4 py-3 flex flex-wrap items-center gap-4">
        <span className="text-[10px] text-[#4B5563] uppercase tracking-wider">
          Severity
        </span>
        <div className="flex items-center gap-1 bg-[#1A1A1A] rounded-lg p-1">
          {SEV_OPTIONS.map(opt => {
            const s = opt !== 'all' ? rtSeverity(
              opt === 'Critical' ? 3001 : opt === 'High' ? 2001 : opt === 'Medium' ? 1501 : 1001
            ) : null;
            return (
              <button
                key={opt}
                onClick={() => setSevFilter(opt)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold
                  transition-all capitalize ${
                  sevFilter === opt
                    ? s
                      ? `bg-[#2F2F2F] ${s.color}`
                      : 'bg-[#3F3F3F] text-white'
                    : 'text-[#6B7280] hover:text-white'
                }`}
              >
                {opt === 'all' ? 'All' : opt}
                {opt !== 'all' && sevCounts[opt]
                  ? ` (${sevCounts[opt]})`
                  : ''}
              </button>
            );
          })}
        </div>
        <span className="ml-auto text-[11px] text-[#4B5563]">
          {sorted.length} of {endpoints.length} shown
        </span>
      </div>

      {/* ══ TABLE ══ */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[#1A1A1A]">
          <p className="text-[10px] text-[#3F3F3F]">
            Click any row to expand · Sorted by {sortKey}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F1F1F]">
                <th className="px-4 py-3 text-left w-8 text-[10px] text-[#4B5563]
                  uppercase tracking-wider font-semibold">#</th>
                <th className="px-4 py-3 text-left text-[10px] text-[#4B5563]
                  uppercase tracking-wider font-semibold">Endpoint</th>
                <SortHeader label="Avg RT"   sortKey="avgResponseTime" current={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Max RT"   sortKey="maxResponseTime" current={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Min RT"   sortKey="minResponseTime" current={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Hits"     sortKey="count"           current={sortKey} dir={sortDir} onSort={handleSort} />
              </tr>
            </thead>

            <tbody>
              {sorted.map((row, idx) => {
                const isExpanded = expandedRow === idx;
                const sev       = rtSeverity(row.avgResponseTime);
                const mStyle    = METHOD_STYLE[row.method] || METHOD_STYLE.GET;
                const j         = jitter(row);

                return (
                  <>
                    <tr
                      key={`${row.method}-${row.path}-${idx}`}
                      onClick={() => toggleRow(idx)}
                      className={`border-b border-[#141414] cursor-pointer
                        transition-colors ${
                        isExpanded ? 'bg-[#141414]' : 'hover:bg-[#0A0A0A]'
                      }`}
                    >
                      {/* Rank */}
                      <td className="px-4 py-3 w-8">
                        <span className="text-[11px] text-[#3F3F3F] font-mono">
                          {idx + 1}
                        </span>
                      </td>

                      {/* Endpoint */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            {/* Severity dot */}
                            <span className={`w-2 h-2 rounded-full flex-shrink-0
                              ${sev.bg}`} />
                            <span className={`inline-block px-2 py-0.5 rounded-md
                              border text-[10px] font-bold tracking-wide
                              flex-shrink-0 ${mStyle}`}>
                              {row.method}
                            </span>
                            <span className="font-mono text-xs text-[#D1D5DB]
                              truncate max-w-[200px]" title={row.path}>
                              {row.path}
                            </span>
                            {/* Jitter badge */}
                            {j > 500 && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded
                                bg-orange-500/10 text-orange-400 border
                                border-orange-500/20 flex-shrink-0">
                                unstable
                              </span>
                            )}
                          </div>
                          {/* Speed bar — relative to max in list */}
                          <SpeedBar value={row.avgResponseTime} max={maxRT} severity={sev} />
                        </div>
                      </td>

                      {/* Avg RT */}
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1.5 px-2.5
                          py-1 rounded-lg border text-xs font-bold
                          ${sev.card} ${sev.color}`}>
                          <Clock className="w-3 h-3" />
                          {fmtMs(row.avgResponseTime)}
                        </div>
                      </td>

                      {/* Max RT */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-red-400">
                          {fmtMs(row.maxResponseTime)}
                        </span>
                      </td>

                      {/* Min RT */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-yellow-400">
                          {fmtMs(row.minResponseTime)}
                        </span>
                      </td>

                      {/* Hits */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white">
                            {row.count}
                          </span>
                          <span className="text-[10px] text-[#4B5563]">hits</span>
                          {row.count > 3 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded
                              bg-red-500/10 text-red-400 border border-red-500/20">
                              recurring
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {isExpanded && (
                      <ExpandedDetail key={`exp-${idx}`} row={row} />
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[#4B5563] text-sm">No endpoints match this filter</p>
          </div>
        )}
      </div>

      {/* ══ OPTIMIZATION TIPS ══ */}
      {endpoints.some(e => rtSeverity(e.avgResponseTime).label === 'Critical') && (
        <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Critical Endpoints Detected — Optimization Checklist
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Add MongoDB indexes on queried fields',
              'Use .lean() on read-only Mongoose queries',
              'Add Redis caching for repeated read queries',
              'Check N+1 queries — use $lookup or populate carefully',
              'Paginate large result sets',
              'Profile with Mongoose debug mode: mongoose.set("debug", true)',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-[#6B7280]">
                <span className="text-red-400/60 font-bold flex-shrink-0">{i + 1}.</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
