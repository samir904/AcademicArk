// ConsoleLogsDisplay.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getConsoleLogs, deleteConsoleLog,
  setConsoleFilters, setConsolePage,
} from '../../../REDUX/Slices/logsSlice';
import { formatDistanceToNow } from 'date-fns';
import {
  Terminal, Info, AlertTriangle, XCircle,
  Bug, FileText, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Trash2,
  RefreshCw, Search, X, Clock,
} from 'lucide-react';

// ─────────────────────────────────────────────
// 🔧 CONFIG
// ─────────────────────────────────────────────
const LEVEL_CONFIG = {
  log:   { color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   bar: 'bg-blue-500',   icon: FileText,      emoji: '📝' },
  info:  { color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   bar: 'bg-cyan-500',   icon: Info,          emoji: 'ℹ️'  },
  warn:  { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', bar: 'bg-yellow-500', icon: AlertTriangle,  emoji: '⚠️'  },
  error: { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    bar: 'bg-red-500',    icon: XCircle,       emoji: '❌'  },
  debug: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', bar: 'bg-purple-500', icon: Bug,           emoji: '🐛'  },
};
const DEFAULT_LEVEL = { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', bar: 'bg-gray-500', icon: Terminal, emoji: '📋' };
const getLevel = (l) => LEVEL_CONFIG[l] || DEFAULT_LEVEL;

const LEVELS = ['log', 'info', 'warn', 'error', 'debug'];

const fmtRelative = (ts) => {
  try { return formatDistanceToNow(new Date(ts), { addSuffix: true }); }
  catch { return '—'; }
};

const fmtExact = (ts) => {
  try {
    return new Date(ts).toLocaleString('en-IN', {
      timeZone:  'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch { return '—'; }
};

// ─────────────────────────────────────────────
// 🧩 SKELETON
// ─────────────────────────────────────────────
const Skeleton = () => (
  <div className="animate-pulse space-y-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="h-20 bg-[#1A1A1A] rounded-xl" />
    ))}
  </div>
);

// ─────────────────────────────────────────────
// 🧩 SINGLE LOG ROW
// ─────────────────────────────────────────────
const LogRow = ({ log, onDelete }) => {
  const [expanded,   setExpanded]   = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const cfg   = getLevel(log.level);
  const LIcon = cfg.icon;

  const jsonStr = log.data && typeof log.data === 'object'
    ? JSON.stringify(log.data, null, 2) : null;
  const truncated = jsonStr && jsonStr.length > 400;

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    await onDelete(log._id);
    setDeleting(false);
  };

  return (
    <div
      onClick={() => setExpanded(o => !o)}
      className={`border rounded-xl overflow-hidden cursor-pointer
        transition-all hover:border-[#3F3F3F] ${
        expanded ? `${cfg.bg} ${cfg.border}` : 'bg-[#0F0F0F] border-[#1F1F1F]'
      }`}
    >
      {/* ── Main row */}
      <div className="flex items-start gap-3 px-4 py-3">

        {/* Level icon */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center
          flex-shrink-0 mt-0.5 ${cfg.bg} border ${cfg.border}`}>
          <LIcon className={`w-3.5 h-3.5 ${cfg.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Top meta row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md
              border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
              {log.level?.toUpperCase()}
            </span>
            {log.context && (
              <span className="text-[10px] text-[#4B5563] font-mono
                bg-[#1A1A1A] px-2 py-0.5 rounded-md border border-[#2F2F2F]">
                {log.context}
              </span>
            )}
            <span className="text-[11px] text-[#4B5563] ml-auto flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {fmtRelative(log.timestamp)}
            </span>
          </div>

          {/* Message */}
          <p className={`font-mono text-sm leading-relaxed break-words
            ${expanded ? 'text-white' : 'text-[#D1D5DB] line-clamp-2'}`}>
            {log.message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg bg-[#1A1A1A] border border-[#2F2F2F]
              hover:bg-red-500/10 hover:border-red-500/20 transition-all
              disabled:opacity-40"
            title="Delete log"
          >
            {deleting
              ? <RefreshCw className="w-3.5 h-3.5 text-[#4B5563] animate-spin" />
              : <Trash2     className="w-3.5 h-3.5 text-[#4B5563] hover:text-red-400" />
            }
          </button>
          {expanded
            ? <ChevronUp   className={`w-4 h-4 ${cfg.color}`} />
            : <ChevronDown className="w-4 h-4 text-[#4B5563]" />
          }
        </div>
      </div>

      {/* ── Expanded detail */}
      {expanded && (
        <div className={`border-t ${cfg.border} px-4 py-4 space-y-3`}
          onClick={e => e.stopPropagation()}>

          {/* Exact timestamp */}
          <div className="flex items-center gap-2 text-[11px] text-[#4B5563]">
            <Clock className="w-3 h-3" />
            <span>{fmtExact(log.timestamp)}</span>
            {log._id && (
              <span className="ml-auto font-mono text-[#2F2F2F]">
                {log._id}
              </span>
            )}
          </div>

          {/* Full message (if truncated in main) */}
          <div className={`p-3 rounded-lg border ${cfg.bg} ${cfg.border}`}>
            <p className="font-mono text-xs text-white leading-relaxed
              break-words whitespace-pre-wrap">
              {log.message}
            </p>
          </div>

          {/* Data / stack */}
          {jsonStr && (
            <div className="space-y-1.5">
              <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">
                Attached Data
              </p>
              <pre className="bg-[#080808] border border-[#1A1A1A] rounded-xl
                p-3 text-xs text-[#9CA3AF] overflow-x-auto leading-relaxed">
                {truncated ? jsonStr.slice(0, 400) + '\n... (truncated)' : jsonStr}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────
export default function ConsoleLogsDisplay() {
  const dispatch = useDispatch();

  const {
    consoleLogs,
    consoleLogsPagination,
    consoleLoading,
    consoleError,
    consoleFilters,
  } = useSelector(state => state.logs);

  const [search, setSearch] = useState('');

  // ── Fetch on filter change
  useEffect(() => {
    dispatch(getConsoleLogs(consoleFilters));
  }, [dispatch, consoleFilters]);

  // ── Handlers
  const handleLevel  = (level) =>
    dispatch(setConsoleFilters({ level: consoleFilters.level === level ? '' : level }));

  const handlePage   = (page)  =>
    dispatch(setConsolePage(page));

  const handleDelete = (id) =>
    dispatch(deleteConsoleLog(id));

  const handleRefresh = () =>
    dispatch(getConsoleLogs(consoleFilters));

  // ── Client-side search filter
  const filtered = search.trim()
    ? consoleLogs.filter(l =>
        l.message?.toLowerCase().includes(search.toLowerCase()) ||
        l.context?.toLowerCase().includes(search.toLowerCase())
      )
    : consoleLogs;

  // ── Level counts from current page
  const levelCounts = LEVELS.reduce((acc, lvl) => {
    acc[lvl] = consoleLogs.filter(l => l.level === lvl).length;
    return acc;
  }, {});

  return (
    <div className="space-y-4">

      {/* ══ LEVEL FILTER PILLS ══ */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Console Logs</h3>
            <p className="text-xs text-[#4B5563] mt-0.5">
              {consoleLogsPagination?.total ?? consoleLogs.length} total entries
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={consoleLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                bg-[#1A1A1A] border border-[#2F2F2F] text-xs text-[#6B7280]
                hover:text-white hover:border-[#4B5563] transition-all
                disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${
                consoleLoading ? 'animate-spin' : ''
              }`} />
              Refresh
            </button>

            {/* Limit selector */}
            <select
              value={consoleFilters.limit}
              onChange={e => dispatch(setConsoleFilters({ limit: parseInt(e.target.value) }))}
              className="px-3 py-1.5 bg-[#1A1A1A] border border-[#2F2F2F]
                rounded-lg text-xs text-[#9CA3AF] focus:outline-none
                focus:border-[#4B5563] cursor-pointer"
            >
              {[10, 25, 50, 100].map(n => (
                <option key={n} value={n}>{n} / page</option>
              ))}
            </select>
          </div>
        </div>

        {/* Level pills */}
        <div className="flex flex-wrap gap-2">
          {/* All pill */}
          <button
            onClick={() => dispatch(setConsoleFilters({ level: '' }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              border text-xs font-semibold transition-all ${
              !consoleFilters.level
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-[#141414] border-[#2F2F2F] text-[#4B5563] hover:text-white'
            }`}
          >
            <Terminal className="w-3 h-3" />
            All
            <span className="text-[10px] opacity-60">
              ({consoleLogs.length})
            </span>
          </button>

          {LEVELS.map(level => {
            const cfg    = getLevel(level);
            const LIcon  = cfg.icon;
            const active = consoleFilters.level === level;
            return (
              <button
                key={level}
                onClick={() => handleLevel(level)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                  border text-xs font-semibold capitalize transition-all ${
                  active
                    ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                    : 'bg-[#141414] border-[#2F2F2F] text-[#4B5563] hover:text-white'
                }`}
              >
                <LIcon className="w-3 h-3" />
                {level}
                {levelCounts[level] > 0 && (
                  <span className={`text-[10px] ${active ? 'opacity-70' : 'opacity-40'}`}>
                    ({levelCounts[level]})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2
            w-3.5 h-3.5 text-[#4B5563] pointer-events-none" />
          <input
            type="text"
            placeholder="Search messages or context..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-[#141414] border border-[#2F2F2F]
              rounded-lg text-xs text-[#D1D5DB] placeholder-[#3F3F3F]
              focus:outline-none focus:border-[#4B5563] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5 text-[#4B5563] hover:text-white" />
            </button>
          )}
        </div>
      </div>

      {/* ══ ERROR ══ */}
      {consoleError && (
        <div className="flex items-center gap-3 bg-red-500/10 border
          border-red-500/20 rounded-xl px-4 py-3">
          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{consoleError}</p>
          <button
            onClick={handleRefresh}
            className="ml-auto text-xs text-red-400/70 hover:text-red-400
              underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* ══ LOADING ══ */}
      {consoleLoading && <Skeleton />}

      {/* ══ LOG LIST ══ */}
      {!consoleLoading && filtered.length > 0 && (
        <div className="space-y-2">
          {/* Search result count */}
          {search && (
            <p className="text-xs text-[#4B5563] px-1">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "
              <span className="text-white">{search}</span>"
            </p>
          )}
          {filtered.map((log, i) => (
            <LogRow
              key={log._id || i}
              log={log}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ══ EMPTY STATE ══ */}
      {!consoleLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20
          bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl gap-3">
          <Terminal className="w-8 h-8 text-[#2F2F2F]" />
          <p className="text-[#4B5563] text-sm font-medium">
            {search
              ? `No logs matching "${search}"`
              : consoleFilters.level
                ? `No ${consoleFilters.level} logs found`
                : 'No console logs found'
            }
          </p>
          {(search || consoleFilters.level) && (
            <button
              onClick={() => { setSearch(''); dispatch(setConsoleFilters({ level: '' })); }}
              className="text-xs text-blue-400 hover:text-blue-300
                underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ══ PAGINATION ══ */}
      {consoleLogsPagination && consoleLogsPagination.pages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-3
          bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl px-4 py-3">

          {/* Info */}
          <p className="text-xs text-[#4B5563]">
            Page{' '}
            <span className="text-white font-semibold">
              {consoleLogsPagination.currentPage}
            </span>
            {' '}of{' '}
            <span className="text-white font-semibold">
              {consoleLogsPagination.pages}
            </span>
            <span className="ml-2 text-[#3F3F3F]">
              ({consoleLogsPagination.total} total)
            </span>
          </p>

          {/* Page number pills */}
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => handlePage(consoleLogsPagination.currentPage - 1)}
              disabled={consoleLogsPagination.currentPage === 1}
              className="p-1.5 rounded-lg bg-[#141414] border border-[#2F2F2F]
                text-[#6B7280] hover:text-white hover:border-[#4B5563]
                transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers — show max 5 */}
            {Array.from({ length: consoleLogsPagination.pages }, (_, i) => i + 1)
              .filter(p => {
                const cur = consoleLogsPagination.currentPage;
                return p === 1 || p === consoleLogsPagination.pages ||
                  Math.abs(p - cur) <= 1;
              })
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`}
                    className="px-2 text-xs text-[#3F3F3F]">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePage(p)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-xs
                      font-semibold transition-all border ${
                      p === consoleLogsPagination.currentPage
                        ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                        : 'bg-[#141414] border-[#2F2F2F] text-[#6B7280] hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                )
              )
            }

            {/* Next */}
            <button
              onClick={() => handlePage(consoleLogsPagination.currentPage + 1)}
              disabled={consoleLogsPagination.currentPage === consoleLogsPagination.pages}
              className="p-1.5 rounded-lg bg-[#141414] border border-[#2F2F2F]
                text-[#6B7280] hover:text-white hover:border-[#4B5563]
                transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
