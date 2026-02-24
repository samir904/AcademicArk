// panels/ErrorBreakdownPanel.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectErrorBreakdown } from '../../../REDUX/Slices/logsSlice';
import {
  AlertTriangle, AlertCircle, Clock,
  User, ChevronUp, ChevronDown, ArrowUpDown,
  XCircle, Info,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

const STATUS_META = {
  // 4xx
  400: { label: 'Bad Request',       color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', bar: 'bg-yellow-500', tip: 'Invalid request payload or params'    },
  401: { label: 'Unauthorized',      color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', bar: 'bg-orange-500', tip: 'Auth token missing or expired'         },
  403: { label: 'Forbidden',         color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', bar: 'bg-orange-500', tip: 'Valid token but insufficient role'      },
  404: { label: 'Not Found',         color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', bar: 'bg-yellow-500', tip: 'Route or resource does not exist'      },
  409: { label: 'Conflict',          color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', bar: 'bg-yellow-500', tip: 'Duplicate resource or state conflict'  },
  422: { label: 'Unprocessable',     color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', bar: 'bg-yellow-500', tip: 'Validation failed on server side'      },
  429: { label: 'Rate Limited',      color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    bar: 'bg-red-500',    tip: 'Too many requests from this client'   },
  // 5xx
  500: { label: 'Server Error',      color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    bar: 'bg-red-500',    tip: 'Unhandled exception — check logs'     },
  502: { label: 'Bad Gateway',       color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    bar: 'bg-red-500',    tip: 'Upstream server unreachable'          },
  503: { label: 'Service Unavail.',  color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    bar: 'bg-red-500',    tip: 'Server overloaded or down'            },
};

const getStatusMeta = (code) =>
  STATUS_META[code] || {
    label:  code >= 500 ? 'Server Error' : 'Client Error',
    color:  code >= 500 ? 'text-red-400' : 'text-yellow-400',
    bg:     code >= 500 ? 'bg-red-500/10' : 'bg-yellow-500/10',
    border: code >= 500 ? 'border-red-500/20' : 'border-yellow-500/20',
    bar:    code >= 500 ? 'bg-red-500' : 'bg-yellow-500',
    tip:    '—',
  };

const getTypeStyle = (type) => ({
  '4xx': { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', bar: 'bg-yellow-500' },
  '5xx': { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    bar: 'bg-red-500'    },
}[type] || { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', bar: 'bg-gray-500' });

const fmtTime = (ts) => {
  try { return formatDistanceToNow(new Date(ts), { addSuffix: true }); }
  catch { return '—'; }
};

const fmtExact = (ts) => {
  try {
    return new Date(ts).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch { return '—'; }
};

// ─────────────────────────────────────────────
// 🧩 SORT HEADER
// ─────────────────────────────────────────────
const SortHeader = ({ label, sortKey, current, dir, onSort }) => {
  const active = current === sortKey;
  return (
    <th className="px-4 py-3 text-left cursor-pointer select-none group"
      onClick={() => onSort(sortKey)}>
      <div className="flex items-center gap-1.5">
        <span className={`text-[10px] uppercase tracking-wider font-semibold
          transition-colors ${active ? 'text-white' : 'text-[#4B5563] group-hover:text-[#6B7280]'}`}>
          {label}
        </span>
        {active
          ? dir === 'desc'
            ? <ChevronDown className="w-3 h-3 text-red-400" />
            : <ChevronUp   className="w-3 h-3 text-red-400" />
          : <ArrowUpDown className="w-3 h-3 text-[#2F2F2F] group-hover:text-[#4B5563]" />
        }
      </div>
    </th>
  );
};

// ─────────────────────────────────────────────
// 🧩 ENDPOINT EXPANDED DETAIL
// ─────────────────────────────────────────────
const EndpointExpanded = ({ row }) => {
  const meta = getStatusMeta(row.statusCode);
  return (
    <tr className="bg-[#080808] border-b border-[#1A1A1A]">
      <td colSpan={6} className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Status meaning */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">
              What it means
            </p>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg
              border ${meta.bg} ${meta.border}`}>
              <Info className={`w-3.5 h-3.5 flex-shrink-0 ${meta.color}`} />
              <span className={`text-xs ${meta.color}`}>{meta.tip}</span>
            </div>
          </div>

          {/* Last occurred */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">
              Last Occurred
            </p>
            <p className="text-sm font-semibold text-white">
              {fmtTime(row.lastOccurred)}
            </p>
            <p className="text-[11px] text-[#4B5563]">
              {fmtExact(row.lastOccurred)}
            </p>
          </div>

          {/* Error message */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">
              Error Message
            </p>
            {row.errorMessage ? (
              <p className="font-mono text-xs text-red-400 bg-red-500/5
                border border-red-500/10 rounded-lg px-3 py-2 break-all">
                {row.errorMessage}
              </p>
            ) : (
              <p className="text-xs text-[#3F3F3F] italic">
                No error message captured — check console logs
              </p>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

// ─────────────────────────────────────────────
// 🧩 RECENT ERROR ROW
// ─────────────────────────────────────────────
const RecentErrorRow = ({ err, idx }) => {
  const meta    = getStatusMeta(err.statusCode);
  const mStyle  = METHOD_STYLE[err.method] || METHOD_STYLE.GET;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border
      transition-all hover:border-[#3F3F3F] ${meta.bg} ${meta.border}`}>

      {/* Index */}
      <span className="text-[10px] text-[#3F3F3F] font-mono w-4 flex-shrink-0">
        {idx + 1}
      </span>

      {/* Method */}
      <span className={`inline-block px-2 py-0.5 rounded-md border
        text-[10px] font-bold tracking-wide flex-shrink-0 ${mStyle}`}>
        {err.method}
      </span>

      {/* Path */}
      <span className="font-mono text-xs text-[#D1D5DB] flex-1 truncate"
        title={err.path}>
        {err.path}
      </span>

      {/* Status */}
      <span className={`text-xs font-bold px-2 py-0.5 rounded-md border
        ${meta.bg} ${meta.border} ${meta.color} flex-shrink-0`}>
        {err.statusCode}
      </span>

      {/* RT */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Clock className="w-3 h-3 text-[#4B5563]" />
        <span className="text-xs text-[#6B7280]">{err.responseTime}ms</span>
      </div>

      {/* User */}
      <div className="flex items-center gap-1 flex-shrink-0 min-w-[80px]">
        <User className="w-3 h-3 text-[#4B5563]" />
        <span className="text-xs text-[#6B7280] truncate max-w-[80px]"
          title={err.userEmail || 'Anonymous'}>
          {err.userEmail || <span className="italic text-[#3F3F3F]">Anon</span>}
        </span>
      </div>

      {/* Time */}
      <span className="text-[11px] text-[#4B5563] flex-shrink-0 text-right
        min-w-[80px]">
        {fmtTime(err.timestamp)}
      </span>
    </div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="h-48 bg-[#1A1A1A] rounded-xl" />
      <div className="h-48 bg-[#1A1A1A] rounded-xl" />
    </div>
    <div className="h-64 bg-[#1A1A1A] rounded-xl" />
  </div>
);

// ─────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────
export default function ErrorBreakdownPanel() {
  const { data, loading, error: fetchError, hours } =
    useSelector(selectErrorBreakdown);

  const {
    errorsByEndpoint = [],
    errorsByType     = [],
    recentErrors     = [],
  } = data || {};

  const [sortKey,        setSortKey]        = useState('count');
  const [sortDir,        setSortDir]        = useState('desc');
  const [expandedRow,    setExpandedRow]    = useState(null);
  const [statusFilter,   setStatusFilter]   = useState('all');
  const [activeSection,  setActiveSection]  = useState('endpoints');

  if (loading) return <Skeleton />;

  if (fetchError) return (
    <div className="flex items-center gap-3 bg-red-500/10 border
      border-red-500/20 rounded-xl px-4 py-3">
      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
      <p className="text-red-400 text-sm">{fetchError}</p>
    </div>
  );

  if (!errorsByEndpoint.length && !recentErrors.length) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center
        justify-center mb-4">
        <XCircle className="w-6 h-6 text-green-400" />
      </div>
      <p className="text-green-400 font-semibold text-sm">No errors detected 🎉</p>
      <p className="text-[#4B5563] text-xs mt-1">
        All clean in the last {hours}h
      </p>
    </div>
  );

  // ── Derived stats
  const totalErrors  = errorsByType.reduce((s, t) => s + t.count, 0);
  const total4xx     = errorsByType.find(t => t.type === '4xx')?.count || 0;
  const total5xx     = errorsByType.find(t => t.type === '5xx')?.count || 0;
  const maxCount     = Math.max(...errorsByEndpoint.map(e => e.count), 1);

  // Unique status codes for filter pills
  const uniqueStatuses = [...new Set(errorsByEndpoint.map(e => e.statusCode))].sort();

  // ── Filter
  const filtered = errorsByEndpoint.filter(e =>
    statusFilter === 'all' ? true : e.statusCode === parseInt(statusFilter)
  );

  // ── Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === 'lastOccurred') {
      return sortDir === 'desc'
        ? new Date(b.lastOccurred) - new Date(a.lastOccurred)
        : new Date(a.lastOccurred) - new Date(b.lastOccurred);
    }
    return sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey];
  });

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const toggleRow = (idx) => setExpandedRow(r => r === idx ? null : idx);

  return (
    <div className="space-y-4">

      {/* ══ KPI CARDS ══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Total Errors',
            value: totalErrors,
            sub:   `Last ${hours}h`,
            icon:  AlertTriangle,
            color: totalErrors > 0 ? 'text-red-400' : 'text-green-400',
            card:  totalErrors > 0
              ? 'bg-red-500/5 border-red-500/15'
              : 'bg-green-500/5 border-green-500/15',
          },
          {
            label: '4xx Client Errors',
            value: total4xx,
            sub:   'Bad requests / Not found',
            icon:  AlertCircle,
            color: total4xx > 0 ? 'text-yellow-400' : 'text-[#4B5563]',
            card:  total4xx > 0
              ? 'bg-yellow-500/5 border-yellow-500/15'
              : 'bg-[#0F0F0F] border-[#1F1F1F]',
          },
          {
            label: '5xx Server Errors',
            value: total5xx,
            sub:   'Internal / uncaught',
            icon:  XCircle,
            color: total5xx > 0 ? 'text-red-400' : 'text-green-400',
            card:  total5xx > 0
              ? 'bg-red-500/5 border-red-500/15'
              : 'bg-green-500/5 border-green-500/15',
          },
          {
            label: 'Unique Error Paths',
            value: errorsByEndpoint.length,
            sub:   `${uniqueStatuses.length} distinct status codes`,
            icon:  AlertTriangle,
            color: 'text-orange-400',
            card:  'bg-orange-500/5 border-orange-500/15',
          },
        ].map(item => (
          <div key={item.label}
            className={`border rounded-xl p-4 space-y-1.5 ${item.card}`}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-[#4B5563] uppercase tracking-wider
                font-semibold">
                {item.label}
              </p>
              <item.icon className={`w-3.5 h-3.5 ${item.color} opacity-60`} />
            </div>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-[11px] text-[#4B5563]">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* ══ ROW 2 — Type Distribution + Status Breakdown ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* 4xx vs 5xx */}
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Error Type Distribution</h3>
            <p className="text-xs text-[#4B5563] mt-0.5">4xx client vs 5xx server errors</p>
          </div>
          <div className="space-y-3">
            {errorsByType.map(t => {
              const s   = getTypeStyle(t.type);
              const pct = totalErrors > 0 ? ((t.count / totalErrors) * 100).toFixed(1) : 0;
              return (
                <div key={t.type} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 px-2.5 py-1
                      rounded-lg border text-xs font-bold
                      ${s.bg} ${s.border} ${s.color}`}>
                      {t.type}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${s.color}`}>
                        {t.count}
                      </span>
                      <span className="text-[11px] text-[#4B5563]">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.bar} transition-all
                        duration-700`}
                      style={{ width: `${pct}%`, opacity: 0.7 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 5xx = 0 is good */}
          {total5xx === 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg
              bg-green-500/5 border border-green-500/15">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-green-400">
                No server errors — backend is healthy ✓
              </span>
            </div>
          )}
        </div>

        {/* Status code distribution */}
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">By Status Code</h3>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Error count per HTTP status code
            </p>
          </div>
          <div className="space-y-3">
            {[...errorsByEndpoint]
              .reduce((acc, e) => {
                const found = acc.find(x => x.statusCode === e.statusCode);
                if (found) found.count += e.count;
                else acc.push({ statusCode: e.statusCode, count: e.count });
                return acc;
              }, [])
              .sort((a, b) => b.count - a.count)
              .map(({ statusCode, count }) => {
                const meta = getStatusMeta(statusCode);
                const pct  = totalErrors > 0
                  ? ((count / totalErrors) * 100).toFixed(1) : 0;
                return (
                  <div key={statusCode} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className={`text-xs font-bold font-mono w-8
                          ${meta.color}`}>
                          {statusCode}
                        </span>
                        <span className="text-[11px] text-[#4B5563]">
                          {meta.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${meta.color}`}>
                          {count}
                        </span>
                        <span className="text-[10px] text-[#3F3F3F] w-9 text-right">
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${meta.bar}
                          transition-all duration-500`}
                        style={{ width: `${pct}%`, opacity: 0.7 }}
                      />
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>

      {/* ══ SECTION TOGGLE ══ */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl
        overflow-hidden">

        {/* Toggle header */}
        <div className="flex border-b border-[#1F1F1F]">
          {[
            { id: 'endpoints', label: `Errors by Endpoint (${errorsByEndpoint.length})` },
            { id: 'recent',    label: `Recent Errors (${recentErrors.length})`           },
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex-1 px-4 py-3 text-xs font-semibold transition-all
                ${activeSection === sec.id
                  ? 'text-white bg-[#1A1A1A] border-b-2 border-red-500'
                  : 'text-[#4B5563] hover:text-white'}`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* ── ENDPOINTS TABLE ── */}
        {activeSection === 'endpoints' && (
          <>
            {/* Filter bar */}
            <div className="px-4 py-3 border-b border-[#1A1A1A] flex flex-wrap
              items-center gap-3">
              <span className="text-[10px] text-[#4B5563] uppercase tracking-wider">
                Status
              </span>
              <div className="flex items-center gap-1 bg-[#141414] rounded-lg p-1">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold
                    transition-all ${
                    statusFilter === 'all'
                      ? 'bg-[#3F3F3F] text-white'
                      : 'text-[#6B7280] hover:text-white'
                  }`}
                >
                  All
                </button>
                {uniqueStatuses.map(code => {
                  const meta = getStatusMeta(code);
                  return (
                    <button
                      key={code}
                      onClick={() => setStatusFilter(String(code))}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold
                        font-mono transition-all ${
                        statusFilter === String(code)
                          ? `${meta.bg} ${meta.color} border ${meta.border}`
                          : 'text-[#6B7280] hover:text-white'
                      }`}
                    >
                      {code}
                    </button>
                  );
                })}
              </div>
              <span className="ml-auto text-[11px] text-[#4B5563]">
                {sorted.length} of {errorsByEndpoint.length} routes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1F1F1F]">
                    <th className="px-4 py-3 text-left text-[10px] text-[#4B5563]
                      uppercase tracking-wider font-semibold w-8">#</th>
                    <th className="px-4 py-3 text-left text-[10px] text-[#4B5563]
                      uppercase tracking-wider font-semibold">Endpoint</th>
                    <th className="px-4 py-3 text-left text-[10px] text-[#4B5563]
                      uppercase tracking-wider font-semibold">Status</th>
                    <SortHeader label="Count"       sortKey="count"        current={sortKey} dir={sortDir} onSort={handleSort} />
                    <SortHeader label="Last Seen"   sortKey="lastOccurred" current={sortKey} dir={sortDir} onSort={handleSort} />
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, idx) => {
                    const isExpanded = expandedRow === idx;
                    const meta   = getStatusMeta(row.statusCode);
                    const mStyle = METHOD_STYLE[row.method] || METHOD_STYLE.GET;
                    const pct    = ((row.count / maxCount) * 100).toFixed(0);

                    return (
                      <>
                        <tr
                          key={`${row.method}-${row.path}-${row.statusCode}`}
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
                                <span className={`inline-block px-2 py-0.5
                                  rounded-md border text-[10px] font-bold
                                  tracking-wide flex-shrink-0 ${mStyle}`}>
                                  {row.method}
                                </span>
                                <span className="font-mono text-xs text-[#D1D5DB]
                                  truncate max-w-[200px]" title={row.path}>
                                  {row.path}
                                </span>
                              </div>
                              {/* Count bar */}
                              <div className="w-full h-1 bg-[#1A1A1A] rounded-full
                                overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${meta.bar}
                                    transition-all duration-500`}
                                  style={{ width: `${pct}%`, opacity: 0.5 }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <div className={`inline-flex items-center gap-1.5
                              px-2 py-0.5 rounded-md border text-xs font-bold
                              ${meta.bg} ${meta.border} ${meta.color}`}>
                              {row.statusCode}
                              <span className="font-normal text-[10px] opacity-70">
                                {meta.label}
                              </span>
                            </div>
                          </td>

                          {/* Count */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-sm font-bold ${
                                row.count > 5 ? 'text-red-400' : 'text-yellow-400'
                              }`}>
                                {row.count}
                              </span>
                              {row.count > 5 && (
                                <span className="text-[9px] px-1.5 py-0.5
                                  rounded bg-red-500/10 text-red-400
                                  border border-red-500/20">
                                  high
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Last seen */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#4B5563]" />
                              <span className="text-xs text-[#6B7280]">
                                {fmtTime(row.lastOccurred)}
                              </span>
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <EndpointExpanded
                            key={`exp-${idx}`}
                            row={row}
                          />
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {sorted.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-[#4B5563] text-sm">No errors for this filter</p>
              </div>
            )}
          </>
        )}

        {/* ── RECENT ERRORS LIST ── */}
        {activeSection === 'recent' && (
          <div className="p-4 space-y-2">
            {recentErrors.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-[#4B5563] text-sm">No recent errors</p>
              </div>
            ) : (
              recentErrors.map((err, idx) => (
                <RecentErrorRow key={err._id} err={err} idx={idx} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
