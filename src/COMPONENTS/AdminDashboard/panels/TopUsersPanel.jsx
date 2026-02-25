// panels/TopUsersPanel.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTopUsers } from '../../../REDUX/Slices/logsSlice';
import {
  Users, User, Clock, Globe,
  Activity, AlertTriangle, ChevronUp,
  ChevronDown, ArrowUpDown, Layers,
  CheckCircle, ShieldCheck,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// ─────────────────────────────────────────────
// 🔧 HELPERS
// ─────────────────────────────────────────────
const rtColor = (ms) => {
  if (ms >= 2000) return 'text-red-400';
  if (ms >= 1000) return 'text-orange-400';
  if (ms >= 500)  return 'text-yellow-400';
  return 'text-green-400';
};

const rtBg = (ms) => {
  if (ms >= 2000) return 'bg-red-500/10 border-red-500/20';
  if (ms >= 1000) return 'bg-orange-500/10 border-orange-500/20';
  if (ms >= 500)  return 'bg-yellow-500/10 border-yellow-500/20';
  return 'bg-green-500/10 border-green-500/20';
};

const errColor = (rate) => {
  if (rate >= 30) return 'text-red-400';
  if (rate >= 10) return 'text-yellow-400';
  if (rate > 0)   return 'text-orange-400';
  return 'text-green-400';
};

const fmtTime = (ts) => {
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

// Generate consistent avatar color from email string
const avatarColor = (email = '') => {
  const colors = [
    'bg-blue-500',   'bg-purple-500', 'bg-green-500',
    'bg-orange-500', 'bg-pink-500',   'bg-cyan-500',
    'bg-yellow-500', 'bg-red-500',    'bg-teal-500',
  ];
  const idx = email.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  return colors[idx % colors.length];
};

const initials = (email = '') =>
  email.split('@')[0].slice(0, 2).toUpperCase();

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
          transition-colors ${active
            ? 'text-white'
            : 'text-[#4B5563] group-hover:text-[#6B7280]'}`}>
          {label}
        </span>
        {active
          ? dir === 'desc'
            ? <ChevronDown className="w-3 h-3 text-blue-400" />
            : <ChevronUp   className="w-3 h-3 text-blue-400" />
          : <ArrowUpDown className="w-3 h-3 text-[#2F2F2F] group-hover:text-[#4B5563]" />
        }
      </div>
    </th>
  );
};

// ─────────────────────────────────────────────
// 🧩 EXPANDED ROW
// ─────────────────────────────────────────────
const ExpandedDetail = ({ user, rank, maxRequests }) => {
  const errRate = user.totalRequests > 0
    ? ((user.errorCount / user.totalRequests) * 100).toFixed(1)
    : 0;
  const trafficShare = maxRequests > 0
    ? ((user.totalRequests / maxRequests) * 100).toFixed(1)
    : 0;

  return (
    <tr className="bg-[#080808] border-b border-[#1A1A1A]">
      <td colSpan={8} className="px-6 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          {/* Profile */}
          <div className="space-y-2">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">
              Profile
            </p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center
                justify-center text-white font-bold text-sm flex-shrink-0
                ${avatarColor(user.userEmail)}`}>
                {initials(user.userEmail)}
              </div>
              <div>
                <p className="text-xs font-semibold text-white truncate max-w-[160px]"
                  title={user.userEmail}>
                  {user.userEmail}
                </p>
                <p className="text-[10px] text-[#4B5563] font-mono mt-0.5">
                  {user.userId}
                </p>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="space-y-2">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">
              Activity
            </p>
            <div className="space-y-1">
              {[
                { label: 'Total Requests', val: user.totalRequests, color: 'text-blue-400' },
                { label: 'Unique Paths',   val: user.pathCount,     color: 'text-purple-400' },
                { label: 'Unique IPs',     val: user.uniqueIPs,     color: 'text-cyan-400' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[11px] text-[#4B5563]">{item.label}</span>
                  <span className={`text-[11px] font-bold ${item.color}`}>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div className="space-y-2">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">
              Performance
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#4B5563]">Avg RT</span>
                <span className={`text-[11px] font-bold ${rtColor(user.avgResponseTime)}`}>
                  {user.avgResponseTime}ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#4B5563]">Error rate</span>
                <span className={`text-[11px] font-bold ${errColor(parseFloat(errRate))}`}>
                  {errRate}%
                  <span className="text-[#3F3F3F] font-normal ml-1">
                    ({user.errorCount})
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#4B5563]">Traffic share</span>
                <span className="text-[11px] font-bold text-white">
                  {trafficShare}%
                </span>
              </div>
            </div>
          </div>

          {/* Last Active */}
          <div className="space-y-2">
            <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">
              Last Active
            </p>
            <p className="text-sm font-semibold text-white">
              {fmtTime(user.lastActive)}
            </p>
            <p className="text-[11px] text-[#4B5563]">
              {fmtExact(user.lastActive)}
            </p>
            <div className={`inline-flex items-center gap-1.5 px-2 py-1
              rounded-md border text-[10px] font-semibold ${
              user.errorCount === 0
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
            }`}>
              {user.errorCount === 0
                ? <><ShieldCheck className="w-3 h-3" /> Clean session</>
                : <><AlertTriangle className="w-3 h-3" /> Has errors</>
              }
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 bg-[#1A1A1A] rounded-xl" />
      ))}
    </div>
    <div className="h-64 bg-[#1A1A1A] rounded-xl" />
    <div className="h-40 bg-[#1A1A1A] rounded-xl" />
  </div>
);

// ─────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────
export default function TopUsersPanel() {
  const { data: users = [], loading, error, hours } =
    useSelector(selectTopUsers);

  const [sortKey,     setSortKey]     = useState('totalRequests');
  const [sortDir,     setSortDir]     = useState('desc');
  const [expandedRow, setExpandedRow] = useState(null);
  const [errFilter,   setErrFilter]   = useState('all');

  if (loading) return <Skeleton />;

  if (error) return (
    <div className="flex items-center gap-3 bg-red-500/10 border
      border-red-500/20 rounded-xl px-4 py-3">
      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  if (!users.length) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Users className="w-8 h-8 text-[#2F2F2F] mb-3" />
      <p className="text-[#4B5563] text-sm">
        No authenticated users in last {hours}h
      </p>
    </div>
  );

  // ── Aggregate stats
  const totalRequests = users.reduce((s, u) => s + u.totalRequests, 0);
  const totalErrors   = users.reduce((s, u) => s + u.errorCount,    0);
  const avgRT         = users.length
    ? (users.reduce((s, u) => s + u.avgResponseTime, 0) / users.length).toFixed(0)
    : 0;
  const maxRequests   = Math.max(...users.map(u => u.totalRequests), 1);
  const cleanUsers    = users.filter(u => u.errorCount === 0).length;

  // ── Filter
  const filtered = users.filter(u => {
    if (errFilter === 'errors') return u.errorCount > 0;
    if (errFilter === 'clean')  return u.errorCount === 0;
    return true;
  });

  // ── Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === 'lastActive') {
      return sortDir === 'desc'
        ? new Date(b.lastActive) - new Date(a.lastActive)
        : new Date(a.lastActive) - new Date(b.lastActive);
    }
    return sortDir === 'desc'
      ? b[sortKey] - a[sortKey]
      : a[sortKey] - b[sortKey];
  });

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const toggleRow = (idx) =>
    setExpandedRow(r => r === idx ? null : idx);

  return (
    <div className="space-y-4">

      {/* ══ KPI CARDS ══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Active Users',
            value: users.length,
            sub:   `Last ${hours}h`,
            icon:  Users,
            color: 'text-blue-400',
            card:  'bg-blue-500/5 border-blue-500/15',
          },
          {
            label: 'Total Requests',
            value: totalRequests.toLocaleString(),
            sub:   'Authenticated only',
            icon:  Activity,
            color: 'text-purple-400',
            card:  'bg-purple-500/5 border-purple-500/15',
          },
          {
            label: 'Avg Response Time',
            value: `${avgRT}ms`,
            sub:   'Across all users',
            icon:  Clock,
            color: rtColor(parseInt(avgRT)),
            card:  rtBg(parseInt(avgRT)),
          },
          {
            label: 'Clean Sessions',
            value: `${cleanUsers}/${users.length}`,
            sub:   `${totalErrors} total errors`,
            icon:  ShieldCheck,
            color: cleanUsers === users.length ? 'text-green-400' : 'text-yellow-400',
            card:  cleanUsers === users.length
              ? 'bg-green-500/5 border-green-500/15'
              : 'bg-yellow-500/5 border-yellow-500/15',
          },
        ].map(item => (
          <div key={item.label}
            className={`border rounded-xl p-4 space-y-1.5 ${item.card}`}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-[#4B5563] uppercase tracking-wider
                font-semibold">{item.label}</p>
              <item.icon className={`w-3.5 h-3.5 ${item.color} opacity-60`} />
            </div>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-[11px] text-[#4B5563]">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* ══ TABLE ══ */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl overflow-hidden">

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3
          px-4 py-3 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#4B5563] uppercase tracking-wider">
              Show
            </span>
            <div className="flex items-center gap-1 bg-[#141414] rounded-lg p-1">
              {[
                { val: 'all',    label: 'All Users'    },
                { val: 'errors', label: '⚠️ Has Errors' },
                { val: 'clean',  label: '✅ Clean'      },
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

          <div className="flex items-center gap-3">
            <p className="text-[10px] text-[#3F3F3F]">
              Click row to expand
            </p>
            <span className="text-[11px] text-[#4B5563]">
              {sorted.length} of {users.length} users
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F1F1F]">
                <th className="px-4 py-3 text-left text-[10px] text-[#4B5563]
                  uppercase tracking-wider font-semibold w-8">#</th>
                <th className="px-4 py-3 text-left text-[10px] text-[#4B5563]
                  uppercase tracking-wider font-semibold">User</th>
                <SortHeader label="Requests"   sortKey="totalRequests"   current={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Avg RT"     sortKey="avgResponseTime" current={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Errors"     sortKey="errorCount"      current={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Paths"      sortKey="pathCount"       current={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="IPs"        sortKey="uniqueIPs"       current={sortKey} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Last Active" sortKey="lastActive"     current={sortKey} dir={sortDir} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {sorted.map((user, idx) => {
                const isExpanded  = expandedRow === idx;
                const errRate     = user.totalRequests > 0
                  ? ((user.errorCount / user.totalRequests) * 100) : 0;
                const trafficPct  = ((user.totalRequests / maxRequests) * 100).toFixed(0);

                return (
                  <>
                    <tr
                      key={user.userId}
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

                      {/* User */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2.5">
                            {/* Avatar */}
                            <div className={`w-7 h-7 rounded-lg flex items-center
                              justify-center text-white font-bold text-[10px]
                              flex-shrink-0 ${avatarColor(user.userEmail)}`}>
                              {initials(user.userEmail)}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#D1D5DB]
                                truncate max-w-[180px]" title={user.userEmail}>
                                {user.userEmail}
                              </p>
                              <p className="text-[10px] text-[#3F3F3F] font-mono">
                                {user.userId
                ? user.userId.toString().slice(-10)   // ✅ ObjectId last 10 chars
                : user.userEmail?.split('@')[0]        // ✅ fallback: email prefix
              }
                              </p>
                            </div>
                          </div>
                          {/* Traffic share bar */}
                          <div className="w-full h-1 bg-[#1A1A1A] rounded-full
                            overflow-hidden">
                            <div
                              className="h-full bg-blue-500/50 rounded-full
                                transition-all duration-500"
                              style={{ width: `${trafficPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Requests */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white">
                            {user.totalRequests}
                          </span>
                          <span className="text-[10px] text-[#4B5563]">
                            ({trafficPct}%)
                          </span>
                        </div>
                      </td>

                      {/* Avg RT */}
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1 px-2
                          py-0.5 rounded-md border text-xs font-bold
                          ${rtBg(user.avgResponseTime)}
                          ${rtColor(user.avgResponseTime)}`}>
                          <Clock className="w-3 h-3" />
                          {user.avgResponseTime}ms
                        </div>
                      </td>

                      {/* Errors */}
                      <td className="px-4 py-3">
                        {user.errorCount === 0 ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500/50" />
                            <span className="text-xs text-green-500/50">Clean</span>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className={`text-sm font-bold
                              ${errColor(errRate)}`}>
                              {user.errorCount}
                            </span>
                            <p className="text-[10px] text-[#4B5563]">
                              {errRate.toFixed(1)}% rate
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Paths */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3 h-3 text-[#4B5563]" />
                          <span className="text-xs text-[#9CA3AF]">
                            {user.pathCount}
                          </span>
                        </div>
                      </td>

                      {/* IPs */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-[#4B5563]" />
                          <span className="text-xs text-[#9CA3AF]">
                            {user.uniqueIPs}
                          </span>
                          {user.uniqueIPs > 2 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded
                              bg-orange-500/10 text-orange-400
                              border border-orange-500/20">
                              multi-IP
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#4B5563]" />
                          <span className="text-xs text-[#6B7280]">
                            {fmtTime(user.lastActive)}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded */}
                    {isExpanded && (
                      <ExpandedDetail
                        key={`exp-${user.userId}`}
                        user={user}
                        rank={idx + 1}
                        maxRequests={maxRequests}
                      />
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[#4B5563] text-sm">No users match this filter</p>
          </div>
        )}
      </div>

      {/* ══ USER COMPARISON BARS ══ */}
      {users.length > 1 && (
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Request Distribution
            </h3>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Traffic share per user
            </p>
          </div>
          <div className="space-y-3">
            {[...users]
              .sort((a, b) => b.totalRequests - a.totalRequests)
              .map((user, i) => {
                const pct    = ((user.totalRequests / totalRequests) * 100).toFixed(1);
                const color  = avatarColor(user.userEmail);
                const barHex = {
                  'bg-blue-500':   'bg-blue-500/50',
                  'bg-purple-500': 'bg-purple-500/50',
                  'bg-green-500':  'bg-green-500/50',
                  'bg-orange-500': 'bg-orange-500/50',
                  'bg-pink-500':   'bg-pink-500/50',
                  'bg-cyan-500':   'bg-cyan-500/50',
                  'bg-yellow-500': 'bg-yellow-500/50',
                  'bg-red-500':    'bg-red-500/50',
                  'bg-teal-500':   'bg-teal-500/50',
                }[color] || 'bg-blue-500/50';

                return (
                  <div key={user.userId} className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className={`w-6 h-6 rounded-lg flex items-center
                      justify-center text-white font-bold text-[9px]
                      flex-shrink-0 ${color}`}>
                      {initials(user.userEmail)}
                    </div>

                    {/* Email */}
                    <span className="text-xs text-[#9CA3AF] truncate w-40
                      flex-shrink-0" title={user.userEmail}>
                      {user.userEmail.split('@')[0]}
                    </span>

                    {/* Bar */}
                    <div className="flex-1 h-6 bg-[#1A1A1A] rounded-lg
                      overflow-hidden relative">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-lg
                          ${barHex} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                      <div className="absolute inset-0 flex items-center
                        justify-between px-2.5">
                        <span className="text-[11px] font-semibold text-white/70">
                          {user.totalRequests} requests
                        </span>
                        <span className="text-[10px] text-white/40">{pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

    </div>
  );
}
