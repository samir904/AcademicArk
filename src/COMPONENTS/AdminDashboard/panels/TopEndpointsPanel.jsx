// panels/TopEndpointsPanel.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTopEndpoints } from '../../../REDUX/Slices/logsSlice';
import {
  Layers, AlertTriangle, CheckCircle,
  Users, Zap, ChevronUp, ChevronDown, ArrowUpDown,
} from 'lucide-react';

// ─────────────────────────────────────────────
// 🔧 HELPERS
// ─────────────────────────────────────────────
const METHOD_STYLE = {
  GET:     'bg-blue-500/10 text-blue-400   border-blue-500/20',
  POST:    'bg-green-500/10 text-green-400  border-green-500/20',
  PUT:     'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  DELETE:  'bg-red-500/10 text-red-400    border-red-500/20',
  PATCH:   'bg-purple-500/10 text-purple-400 border-purple-500/20',
  HEAD:    'bg-gray-500/10 text-gray-400   border-gray-500/20',
};

const rtColor = (ms) => {
  if (ms >= 2000) return 'text-red-400';
  if (ms >= 1000) return 'text-orange-400';
  if (ms >= 500)  return 'text-yellow-400';
  return 'text-green-400';
};

const rtBg = (ms) => {
  if (ms >= 2000) return 'bg-red-500/10';
  if (ms >= 1000) return 'bg-orange-500/10';
  if (ms >= 500)  return 'bg-yellow-500/10';
  return 'bg-green-500/10';
};

const errColor = (r) => {
  if (r >= 50) return 'text-red-400';
  if (r >= 20) return 'text-orange-400';
  if (r >  0)  return 'text-yellow-400';
  return 'text-green-400';
};

const errBarColor = (r) => {
  if (r >= 50) return 'bg-red-500';
  if (r >= 20) return 'bg-orange-500';
  if (r >  0)  return 'bg-yellow-500';
  return 'bg-green-500';
};

const SORT_KEYS = ['count', 'avgResponseTime', 'errorRate', 'maxResponseTime', 'uniqueUsers'];

// ─────────────────────────────────────────────
// 🧩 MINI BAR — traffic share
// ─────────────────────────────────────────────
const TrafficBar = ({ value, max }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500/60 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

// ─────────────────────────────────────────────
// 🧩 SORT HEADER BUTTON
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
        {active ? (
          dir === 'desc'
            ? <ChevronDown className="w-3 h-3 text-blue-400" />
            : <ChevronUp   className="w-3 h-3 text-blue-400" />
        ) : (
          <ArrowUpDown className="w-3 h-3 text-[#2F2F2F] group-hover:text-[#4B5563]" />
        )}
      </div>
    </th>
  );
};

// ─────────────────────────────────────────────
// 🧩 EXPANDED ROW DETAIL
// ─────────────────────────────────────────────
const ExpandedDetail = ({ row, maxCount }) => {
  const trafficPct = maxCount > 0 ? ((row.count / maxCount) * 100).toFixed(1) : 0;
  return (
    <tr className="bg-[#080808] border-b border-[#1A1A1A]">
      <td colSpan={7} className="px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {/* Traffic share */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">Traffic Share</p>
            <p className="text-lg font-bold text-blue-400">{trafficPct}%</p>
            <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500/60 rounded-full"
                style={{ width: `${trafficPct}%` }}
              />
            </div>
          </div>

          {/* Success vs Error */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">Success vs Error</p>
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-bold text-sm">{row.successCount}</span>
              <span className="text-[#3F3F3F] text-xs">vs</span>
              <span className="text-red-400 font-bold text-sm">{row.errorCount}</span>
            </div>
            {/* Split bar */}
            <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden flex">
              <div
                className="h-full bg-green-500/60 rounded-l-full"
                style={{ width: `${(row.successCount / row.count) * 100}%` }}
              />
              <div
                className="h-full bg-red-500/60 rounded-r-full"
                style={{ width: `${(row.errorCount / row.count) * 100}%` }}
              />
            </div>
          </div>

          {/* RT breakdown */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">Response Time</p>
            <div className="space-y-0.5">
              {[
                { label: 'Avg', val: row.avgResponseTime },
                { label: 'Max', val: row.maxResponseTime },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[11px] text-[#4B5563]">{label}</span>
                  <span className={`text-[11px] font-semibold ${rtColor(val)}`}>{val}ms</span>
                </div>
              ))}
            </div>
          </div>

          {/* Unique users */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">Unique Users</p>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-lg font-bold text-purple-400">{row.uniqueUsers}</span>
            </div>
            <p className="text-[10px] text-[#3F3F3F]">
              {row.uniqueUsers === 1 ? 'Single user endpoint' : 'Multi-user endpoint'}
            </p>
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
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 bg-[#1A1A1A] rounded-xl" />
      ))}
    </div>
    <div className="h-72 bg-[#1A1A1A] rounded-xl" />
  </div>
);

// ─────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────
export default function TopEndpointsPanel() {
  const { data: endpoints = [], loading, error } = useSelector(selectTopEndpoints);

  const [sortKey, setSortKey] = useState('count');
  const [sortDir, setSortDir] = useState('desc');
  const [expandedRow, setExpandedRow] = useState(null);
  const [methodFilter, setMethodFilter] = useState('');
  const [errFilter, setErrFilter]       = useState('all'); // 'all' | 'errors' | 'clean'

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
      <Layers className="w-8 h-8 text-[#2F2F2F] mb-3" />
      <p className="text-[#4B5563] text-sm">No endpoint data yet</p>
    </div>
  );

  // ── Aggregate summary stats
  const totalHits    = endpoints.reduce((s, e) => s + e.count, 0);
  const totalErrors  = endpoints.reduce((s, e) => s + e.errorCount, 0);
  const maxCount     = Math.max(...endpoints.map(e => e.count));
  const avgRT        = (endpoints.reduce((s, e) => s + e.avgResponseTime, 0) / endpoints.length).toFixed(0);
  const noisyEndpoints = endpoints.filter(e => e.errorRate > 0).length;

  // ── Unique methods
  const methods = ['', ...new Set(endpoints.map(e => e.method))];

  // ── Filter
  const filtered = endpoints
    .filter(e => methodFilter ? e.method === methodFilter : true)
    .filter(e => {
      if (errFilter === 'errors') return e.errorRate > 0;
      if (errFilter === 'clean')  return e.errorRate === 0;
      return true;
    });

  // ── Sort
  const sorted = [...filtered].sort((a, b) => {
    const val = sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey];
    return val;
  });

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const toggleRow = (idx) => setExpandedRow(r => r === idx ? null : idx);

  return (
    <div className="space-y-4">

      {/* ══ SUMMARY CARDS ══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Total Endpoints',
            value: endpoints.length,
            sub:   `${filtered.length} visible`,
            icon:  Layers,
            color: 'text-blue-400',
            card:  'bg-blue-500/5 border-blue-500/15',
          },
          {
            label: 'Total Hits',
            value: totalHits.toLocaleString(),
            sub:   `Across ${endpoints.length} routes`,
            icon:  Zap,
            color: 'text-cyan-400',
            card:  'bg-cyan-500/5 border-cyan-500/15',
          },
          {
            label: 'Total Errors',
            value: totalErrors,
            sub:   `${noisyEndpoints} noisy endpoints`,
            icon:  AlertTriangle,
            color: totalErrors > 0 ? 'text-red-400' : 'text-green-400',
            card:  totalErrors > 0
              ? 'bg-red-500/5 border-red-500/15'
              : 'bg-green-500/5 border-green-500/15',
          },
          {
            label: 'Avg Response Time',
            value: `${avgRT}ms`,
            sub:   'Across all endpoints',
            icon:  Zap,
            color: rtColor(parseInt(avgRT)),
            card:  `${rtBg(parseInt(avgRT))} border-[#2F2F2F]`,
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
            <p className="text-[11px] text-[#4B5563]">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* ══ FILTER BAR ══ */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl px-4 py-3
        flex flex-wrap items-center gap-4">

        {/* Method filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#4B5563] uppercase tracking-wider">Method</span>
          <div className="flex items-center gap-1 bg-[#1A1A1A] rounded-lg p-1">
            {methods.map(m => (
              <button
                key={m || 'all'}
                onClick={() => setMethodFilter(m)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold
                  transition-all ${
                  methodFilter === m
                    ? 'bg-[#3F3F3F] text-white'
                    : 'text-[#6B7280] hover:text-white'
                }`}
              >
                {m || 'ALL'}
              </button>
            ))}
          </div>
        </div>

        {/* Error filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#4B5563] uppercase tracking-wider">Show</span>
          <div className="flex items-center gap-1 bg-[#1A1A1A] rounded-lg p-1">
            {[
              { val: 'all',    label: 'All'    },
              { val: 'errors', label: '⚠️ Errors only' },
              { val: 'clean',  label: '✅ Clean only'  },
            ].map(opt => (
              <button
                key={opt.val}
                onClick={() => setErrFilter(opt.val)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium
                  transition-all whitespace-nowrap ${
                  errFilter === opt.val
                    ? 'bg-[#3F3F3F] text-white'
                    : 'text-[#6B7280] hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <span className="ml-auto text-[11px] text-[#4B5563]">
          {sorted.length} of {endpoints.length} endpoints
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
                <th className="px-4 py-3 text-left text-[10px] text-[#4B5563]
                  uppercase tracking-wider font-semibold w-8">
                  #
                </th>
                <th className="px-4 py-3 text-left text-[10px] text-[#4B5563]
                  uppercase tracking-wider font-semibold">
                  Endpoint
                </th>
                <SortHeader label="Hits"     sortKey="count"           current={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Avg RT"   sortKey="avgResponseTime" current={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Max RT"   sortKey="maxResponseTime" current={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Err Rate" sortKey="errorRate"       current={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Users"    sortKey="uniqueUsers"     current={sortKey} dir={sortDir} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, idx) => {
                const isExpanded = expandedRow === idx;
                const mStyle = METHOD_STYLE[row.method] || METHOD_STYLE.GET;

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
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-[#3F3F3F] font-mono">
                          {idx + 1}
                        </span>
                      </td>

                      {/* Endpoint */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`inline-block px-2 py-0.5 rounded-md
                              border text-[10px] font-bold tracking-wide
                              flex-shrink-0 ${mStyle}`}>
                              {row.method}
                            </span>
                            <span className="font-mono text-xs text-[#D1D5DB] truncate
                              max-w-[200px]" title={row.path}>
                              {row.path}
                            </span>
                          </div>
                          {/* Traffic bar */}
                          <TrafficBar value={row.count} max={maxCount} />
                        </div>
                      </td>

                      {/* Hits */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white">
                            {row.count}
                          </span>
                          <span className="text-[10px] text-[#4B5563]">
                            ({((row.count / totalHits) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-green-400">
                            ✓{row.successCount}
                          </span>
                          {row.errorCount > 0 && (
                            <span className="text-[10px] text-red-400">
                              ✗{row.errorCount}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Avg RT */}
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold
                          ${rtColor(row.avgResponseTime)}`}>
                          {row.avgResponseTime}ms
                        </span>
                      </td>

                      {/* Max RT */}
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium
                          ${rtColor(row.maxResponseTime)}`}>
                          {row.maxResponseTime}ms
                        </span>
                      </td>

                      {/* Error Rate */}
                      <td className="px-4 py-3">
                        {row.errorRate > 0 ? (
                          <div className="space-y-1">
                            <span className={`text-sm font-bold ${errColor(row.errorRate)}`}>
                              {row.errorRate}%
                            </span>
                            {/* Error bar */}
                            <div className="w-16 h-1.5 bg-[#1A1A1A]
                              rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full
                                  ${errBarColor(row.errorRate)}`}
                                style={{ width: `${Math.min(row.errorRate, 100)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500/50" />
                            <span className="text-xs text-green-500/50">Clean</span>
                          </div>
                        )}
                      </td>

                      {/* Users */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#4B5563]" />
                          <span className="text-xs text-[#9CA3AF]">
                            {row.uniqueUsers}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* ── Expanded detail */}
                    {isExpanded && (
                      <ExpandedDetail
                        key={`expanded-${idx}`}
                        row={row}
                        maxCount={maxCount}
                      />
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-[#4B5563] text-sm">No endpoints match filters</p>
          </div>
        )}
      </div>

    </div>
  );
}
