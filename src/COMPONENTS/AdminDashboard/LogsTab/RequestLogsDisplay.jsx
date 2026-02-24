// RequestLogsDisplay.jsx — Complete Updated Version
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector }     from 'react-redux';
import {
  getRequestLogs,
  setRequestFilters,
  setRequestPage,
  deleteRequestLog,
  deleteOldRequestLogs,
  deleteRequestLogsByStatus,
} from '../../../REDUX/Slices/logsSlice';
import { formatDistanceToNow } from 'date-fns';
import {
  Trash2, ChevronLeft, ChevronRight,
  RefreshCw, Filter, AlertCircle, Clock,
  User, Globe, Zap, Search, X,
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
  OPTIONS: 'bg-gray-500/10 text-gray-400   border-gray-500/20',
};

const getStatusStyle = (code) => {
  if (code >= 500) return { text: 'text-red-400',    bg: 'bg-red-500/10',    dot: 'bg-red-500'    };
  if (code >= 400) return { text: 'text-yellow-400', bg: 'bg-yellow-500/10', dot: 'bg-yellow-500' };
  if (code >= 300) return { text: 'text-blue-400',   bg: 'bg-blue-500/10',   dot: 'bg-blue-500'   };
  return               { text: 'text-green-400',  bg: 'bg-green-500/10',  dot: 'bg-green-500'  };
};

const getRTColor = (ms) => {
  if (ms >= 2000) return 'text-red-400';
  if (ms >= 1000) return 'text-yellow-400';
  if (ms >= 500)  return 'text-orange-400';
  return 'text-green-400';
};

const STATUS_OPTIONS = [
  { value: '',    label: 'All Status'          },
  { value: '200', label: '200 — OK'            },
  { value: '201', label: '201 — Created'       },
  { value: '204', label: '204 — No Content'    },
  { value: '301', label: '301 — Redirect'      },
  { value: '400', label: '400 — Bad Request'   },
  { value: '401', label: '401 — Unauthorized'  },
  { value: '403', label: '403 — Forbidden'     },
  { value: '404', label: '404 — Not Found'     },
  { value: '500', label: '500 — Server Error'  },
];

const METHOD_OPTIONS = ['', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'];


// ─────────────────────────────────────────────
// 🧩 SUB-COMPONENTS
// ─────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-12 h-12 bg-[#1F1F1F] rounded-full flex items-center
      justify-center mb-4">
      <Filter className="w-5 h-5 text-[#4B5563]" />
    </div>
    <p className="text-[#6B7280] text-sm">No request logs found</p>
    <p className="text-[#3F3F3F] text-xs mt-1">Try changing the filters</p>
  </div>
);

const LoadingRows = ({ rows = 8 }) => (
  <div className="space-y-2 animate-pulse p-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-10 bg-[#1A1A1A] rounded-lg" />
    ))}
  </div>
);

// ─────────────────────────────────────────────
// 📋 EXPANDED LOG ROW (click to expand)
// ─────────────────────────────────────────────
const LogRow = ({ log, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const statusStyle = getStatusStyle(log.statusCode);
  const methodStyle = METHOD_STYLE[log.method] || METHOD_STYLE.GET;

  return (
    <>
      {/* ── Main row */}
      <tr
        onClick={() => setExpanded(e => !e)}
        className={`border-b border-[#1A1A1A] cursor-pointer transition-colors
          ${expanded ? 'bg-[#141414]' : 'hover:bg-[#0F0F0F]'}`}
      >
        {/* Method */}
        <td className="px-4 py-3">
          <span className={`inline-block px-2 py-0.5 rounded-md border
            text-[11px] font-bold tracking-wide ${methodStyle}`}>
            {log.method}
          </span>
        </td>

        {/* Path */}
        <td className="px-4 py-3 max-w-[220px]">
          <p className="font-mono text-xs text-[#D1D5DB] truncate" title={log.path}>
            {log.path}
          </p>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5
            rounded-md ${statusStyle.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
            <span className={`text-xs font-semibold ${statusStyle.text}`}>
              {log.statusCode}
            </span>
          </div>
        </td>

        {/* Response Time */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#4B5563]" />
            <span className={`text-xs font-medium ${getRTColor(log.responseTime)}`}>
              {log.responseTime}ms
            </span>
          </div>
        </td>

        {/* User */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-[#4B5563] flex-shrink-0" />
            <span className="text-xs text-[#9CA3AF] truncate max-w-[120px]"
              title={log.userEmail || 'Anonymous'}>
              {log.userEmail || (
                <span className="text-[#4B5563] italic">Anonymous</span>
              )}
            </span>
          </div>
        </td>

        {/* IP */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-[#4B5563] flex-shrink-0" />
            <span className="font-mono text-xs text-[#6B7280]">
              {log.ipAddress || '—'}
            </span>
          </div>
        </td>

        {/* Timestamp */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#4B5563]" />
            <span className="text-xs text-[#6B7280]">
              {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
            </span>
          </div>
        </td>

        {/* Delete */}
        <td className="px-4 py-3">
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ don't expand row when deleting
              onDelete(log._id);
            }}
            className="p-1.5 rounded-lg bg-[#1F1F1F] hover:bg-red-500/20
              text-[#4B5563] hover:text-red-400 transition-all"
            title="Delete log"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </td>
      </tr>

      {/* ── Expanded detail row */}
      {expanded && (
        <tr className="bg-[#0A0A0A] border-b border-[#1A1A1A]">
          <td colSpan={8} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">

              {/* Full path */}
              <div>
                <p className="text-[#4B5563] uppercase tracking-wider text-[10px]
                  font-semibold mb-1">Full Path</p>
                <p className="font-mono text-[#9CA3AF] break-all">{log.path}</p>
              </div>

              {/* Error message if any */}
              {log.error?.message && (
                <div>
                  <p className="text-red-400/60 uppercase tracking-wider text-[10px]
                    font-semibold mb-1">Error</p>
                  <p className="text-red-400 font-mono break-all">
                    {log.error.message}
                  </p>
                </div>
              )}

              {/* Sizes */}
              {(log.requestSize || log.responseSize) && (
                <div>
                  <p className="text-[#4B5563] uppercase tracking-wider text-[10px]
                    font-semibold mb-1">Size</p>
                  <p className="text-[#9CA3AF]">
                    Req: {log.requestSize ? `${(log.requestSize / 1024).toFixed(1)}KB` : '—'} · 
                    Res: {log.responseSize ? `${(log.responseSize / 1024).toFixed(1)}KB` : '—'}
                  </p>
                </div>
              )}

              {/* User Agent */}
              {log.userAgent && (
                <div className="md:col-span-3">
                  <p className="text-[#4B5563] uppercase tracking-wider text-[10px]
                    font-semibold mb-1">User Agent</p>
                  <p className="font-mono text-[#6B7280] break-all">{log.userAgent}</p>
                </div>
              )}

              {/* Exact timestamp */}
              <div>
                <p className="text-[#4B5563] uppercase tracking-wider text-[10px]
                  font-semibold mb-1">Exact Time (IST)</p>
                <p className="text-[#9CA3AF]">
                  {new Date(log.timestamp).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'medium',
                    timeStyle: 'medium',
                  })}
                </p>
              </div>

              {/* Log ID */}
              <div>
                <p className="text-[#4B5563] uppercase tracking-wider text-[10px]
                  font-semibold mb-1">Log ID</p>
                <p className="font-mono text-[#4B5563]">{log._id}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};


// ─────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────
export default function RequestLogsDisplay() {
  const dispatch = useDispatch();
  const {
    requestLogs,
    requestLogsPagination,
    requestLoading,
    requestError,
    requestFilters,
  } = useSelector(state => state.logs);

  const [showDeleteMenu, setShowDeleteMenu]   = useState(false);
  const [deleteAge,      setDeleteAge]        = useState(7);
  const [deleteStatus,   setDeleteStatus]     = useState('');
  const [deleteMode,     setDeleteMode]       = useState('age'); // 'age' | 'status'
  const deleteMenuRef = useRef(null);

  // ── Close delete menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (deleteMenuRef.current && !deleteMenuRef.current.contains(e.target)) {
        setShowDeleteMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Fetch on filter change
  useEffect(() => {
    dispatch(getRequestLogs(requestFilters));
  }, [dispatch, requestFilters]);

  const handleFilterChange = (key, value) => {
    dispatch(setRequestFilters({ [key]: value }));
  };

  const handleDeleteLog = (logId) => {
    if (window.confirm('Delete this log? This cannot be undone.')) {
      dispatch(deleteRequestLog(logId));
    }
  };

  const handleBulkDelete = () => {
    if (deleteMode === 'age') {
      if (window.confirm(`Delete all request logs older than ${deleteAge} days?`)) {
        dispatch(deleteOldRequestLogs(deleteAge)).then(() => {
          dispatch(getRequestLogs(requestFilters));
          setShowDeleteMenu(false);
        });
      }
    } else {
      if (!deleteStatus) return;
      if (window.confirm(`Delete ALL ${deleteStatus} logs permanently?`)) {
        dispatch(deleteRequestLogsByStatus(deleteStatus)).then(() => {
          dispatch(getRequestLogs(requestFilters));
          setShowDeleteMenu(false);
        });
      }
    }
  };

  const handleRefresh = () => dispatch(getRequestLogs(requestFilters));
  const handleClearFilters = () => {
    dispatch(setRequestFilters({ method: '', statusCode: '', page: 1 }));
  };

  const hasActiveFilters = requestFilters.method || requestFilters.statusCode;

  return (
    <div className="space-y-4">

      {/* ══ FILTER BAR ══ */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">

          {/* Left — filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Method */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#4B5563] font-medium whitespace-nowrap">
                Method
              </label>
              <div className="flex items-center gap-1 bg-[#1A1A1A] rounded-lg p-1">
                {METHOD_OPTIONS.map(m => (
                  <button
                    key={m || 'all'}
                    onClick={() => handleFilterChange('method', m)}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold
                      transition-all ${
                      requestFilters.method === m
                        ? 'bg-[#3F3F3F] text-white'
                        : 'text-[#6B7280] hover:text-white'
                    }`}
                  >
                    {m || 'ALL'}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#4B5563] font-medium">Status</label>
              <select
                value={requestFilters.statusCode || ''}
                onChange={e => handleFilterChange('statusCode', e.target.value)}
                className="bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-3 py-1.5
                  text-xs text-white focus:outline-none focus:border-[#4F4F4F]"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-xs text-[#6B7280]
                  hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-2">

            {/* Pagination summary */}
            {requestLogsPagination && (
              <span className="text-xs text-[#4B5563] hidden md:block">
                {requestLogsPagination.total} logs
              </span>
            )}

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={requestLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                bg-[#1A1A1A] border border-[#2F2F2F] text-xs text-[#9CA3AF]
                hover:text-white hover:border-[#4F4F4F] transition-all
                disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${requestLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {/* Delete menu */}
            <div className="relative" ref={deleteMenuRef}>
              <button
                onClick={() => setShowDeleteMenu(s => !s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                  bg-red-500/10 border border-red-500/20 text-xs text-red-400
                  hover:bg-red-500/20 transition-all font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              {showDeleteMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#111111] border
                  border-[#2F2F2F] rounded-xl shadow-xl z-20 p-4 space-y-4">

                  <p className="text-xs font-semibold text-white">Bulk Delete Logs</p>

                  {/* ── Mode toggle */}
                  <div className="flex gap-1 bg-[#1A1A1A] rounded-lg p-1">
                    {['age', 'status'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => setDeleteMode(mode)}
                        className={`flex-1 py-1 rounded-md text-xs font-medium
                          transition-all capitalize ${
                          deleteMode === mode
                            ? 'bg-[#3F3F3F] text-white'
                            : 'text-[#6B7280] hover:text-white'
                        }`}
                      >
                        By {mode}
                      </button>
                    ))}
                  </div>

                  {deleteMode === 'age' ? (
                    <div className="space-y-2">
                      <label className="text-xs text-[#6B7280]">Older than (days)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={deleteAge}
                          onChange={e => setDeleteAge(parseInt(e.target.value))}
                          className="flex-1 px-3 py-1.5 bg-[#1A1A1A] border
                            border-[#2F2F2F] rounded-lg text-white text-sm
                            focus:outline-none focus:border-[#4F4F4F]"
                        />
                        <span className="text-xs text-[#4B5563]">days</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs text-[#6B7280]">Status code to delete</label>
                      <select
                        value={deleteStatus}
                        onChange={e => setDeleteStatus(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#1A1A1A] border
                          border-[#2F2F2F] rounded-lg text-white text-sm
                          focus:outline-none focus:border-[#4F4F4F]"
                      >
                        <option value="">Select status...</option>
                        {['200', '201', '400', '401', '403', '404', '500'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={handleBulkDelete}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white
                      rounded-lg text-xs font-semibold transition-all"
                  >
                    ⚠️ Confirm Delete
                  </button>

                  <button
                    onClick={() => setShowDeleteMenu(false)}
                    className="w-full py-1.5 bg-[#1F1F1F] hover:bg-[#2F2F2F]
                      text-[#9CA3AF] rounded-lg text-xs transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══ ERROR STATE ══ */}
      {requestError && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20
          rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{requestError}</p>
        </div>
      )}

      {/* ══ TABLE ══ */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl overflow-hidden">

        {/* ✅ Hint — click row to expand */}
        <div className="px-4 py-2 border-b border-[#1A1A1A] flex items-center
          justify-between">
          <p className="text-[10px] text-[#3F3F3F]">
            Click any row to expand details
          </p>
          {requestLogsPagination && (
            <p className="text-[10px] text-[#3F3F3F]">
              Showing {requestLogs.length} of {requestLogsPagination.total}
            </p>
          )}
        </div>

        {requestLoading ? (
          <LoadingRows />
        ) : requestLogs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1F1F1F]">
                  {['Method','Path','Status','Time','User','IP','When',''].map((h, i) => (
                    <th key={i}
                      className="px-4 py-3 text-left text-[10px] text-[#4B5563]
                        uppercase tracking-wider font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requestLogs.map((log) => (
                  <LogRow
                    key={log._id}
                    log={log}
                    onDelete={handleDeleteLog}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══ PAGINATION ══ */}
      {requestLogsPagination && requestLogsPagination.pages > 1 && (
        <div className="flex items-center justify-between">

          {/* Page info */}
          <p className="text-xs text-[#4B5563]">
            Page {requestLogsPagination.currentPage} of {requestLogsPagination.pages}
            <span className="ml-2 text-[#3F3F3F]">
              ({requestLogsPagination.total} total)
            </span>
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(setRequestPage(requestLogsPagination.currentPage - 1))}
              disabled={requestLogsPagination.currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg
                bg-[#1A1A1A] border border-[#2F2F2F] text-xs text-[#9CA3AF]
                hover:text-white hover:border-[#4F4F4F] transition-all
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>

            {/* Page numbers — show 5 around current */}
            <div className="flex items-center gap-1">
              {Array.from({ length: requestLogsPagination.pages }, (_, i) => i + 1)
                .filter(p =>
                  p === 1 ||
                  p === requestLogsPagination.pages ||
                  Math.abs(p - requestLogsPagination.currentPage) <= 1
                )
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '…' ? (
                    <span key={`ellipsis-${i}`}
                      className="text-[#3F3F3F] text-xs px-1">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => dispatch(setRequestPage(p))}
                      className={`w-7 h-7 rounded-lg text-xs font-medium
                        transition-all ${
                        p === requestLogsPagination.currentPage
                          ? 'bg-[#3F3F3F] text-white'
                          : 'text-[#6B7280] hover:text-white hover:bg-[#1A1A1A]'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )
              }
            </div>

            <button
              onClick={() => dispatch(setRequestPage(requestLogsPagination.currentPage + 1))}
              disabled={requestLogsPagination.currentPage === requestLogsPagination.pages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg
                bg-[#1A1A1A] border border-[#2F2F2F] text-xs text-[#9CA3AF]
                hover:text-white hover:border-[#4F4F4F] transition-all
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
