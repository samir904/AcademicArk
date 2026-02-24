// panels/UserBehaviorPanel.jsx
import { useSelector } from 'react-redux';
import { selectUserBehavior } from '../../../REDUX/Slices/logsSlice';
import {
  Users, UserCheck, UserX, Activity,
  AlertTriangle, Clock, Layers, TrendingUp,
  ShieldCheck, Eye, BarChart2, Info,
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
// 🧩 HALF-DONUT SVG — Anon vs Auth
// ─────────────────────────────────────────────
const HalfDonut = ({ authPct, anonPct }) => {
  const R    = 45;
  const cx   = 60;
  const cy   = 60;
  const circ = Math.PI * R; // half-circle

  const authDash = (authPct / 100) * circ;
  const anonDash = (anonPct / 100) * circ;

  return (
    <svg width="120" height="70" viewBox="0 0 120 70">
      {/* BG arc */}
      <path d="M 15 60 A 45 45 0 0 1 105 60"
        fill="none" stroke="#111" strokeWidth="10" strokeLinecap="round" />
      {/* Anon arc (purple) */}
      <path d="M 15 60 A 45 45 0 0 1 105 60"
        fill="none" stroke="#A855F7" strokeOpacity="0.6"
        strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${anonDash} ${circ - anonDash}`}
        strokeDashoffset={0}
      />
      {/* Auth arc (blue) — starts after anon */}
      <path d="M 15 60 A 45 45 0 0 1 105 60"
        fill="none" stroke="#3B82F6" strokeOpacity="0.8"
        strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${authDash} ${circ - authDash}`}
        strokeDashoffset={-anonDash}
      />
    </svg>
  );
};

// ─────────────────────────────────────────────
// 🧩 ACTIVITY BADGE
// ─────────────────────────────────────────────
const ActivityBadge = ({ requests, max }) => {
  const pct = max > 0 ? (requests / max) * 100 : 0;
  const level =
    pct >= 80 ? { label: 'Power User', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' } :
    pct >= 50 ? { label: 'Active',     color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20'     } :
    pct >= 20 ? { label: 'Regular',    color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20'   } :
                { label: 'Low',        color: 'text-gray-400',   bg: 'bg-gray-500/10 border-gray-500/20'     };
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-semibold
      ${level.bg} ${level.color}`}>
      {level.label}
    </span>
  );
};

// ─────────────────────────────────────────────
// 🧩 ABUSE SIGNAL ROW
// ─────────────────────────────────────────────
const AbuseRow = ({ signal }) => (
  <div className="flex items-center gap-3 px-5 py-3 border-b border-[#141414]
    hover:bg-[#0A0A0A] transition-colors">
    <AlertTriangle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
    <div className="flex items-center gap-2 flex-1">
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center
        text-white font-bold text-[9px] flex-shrink-0
        ${avatarColor(signal.userEmail || '')}`}>
        {initials(signal.userEmail || 'AN')}
      </div>
      <span className="text-xs text-[#D1D5DB] truncate max-w-[180px]"
        title={signal.userEmail}>
        {signal.userEmail || 'Anonymous'}
      </span>
    </div>
    <span className="text-[10px] text-orange-400 font-semibold">
      {signal.signal || 'Unusual activity'}
    </span>
    <span className="text-xs font-bold text-white">{signal.count}×</span>
    <span className="text-[11px] text-[#4B5563]">
      {fmtTime(signal.lastSeen)}
    </span>
  </div>
);

// ─────────────────────────────────────────────
// 🧩 TOP USER CARD
// ─────────────────────────────────────────────
const UserCard = ({ user, rank, maxRequests }) => {
  const color = avatarColor(user.userEmail);

  return (
    <div className="bg-[#141414] border border-[#1F1F1F] rounded-xl p-4 space-y-4
      hover:border-[#3F3F3F] transition-all">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Rank */}
          <div className="relative flex-shrink-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center
              text-white font-bold text-sm ${color}`}>
              {initials(user.userEmail)}
            </div>
            {rank <= 3 && (
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full
                bg-[#0F0F0F] border border-[#2F2F2F] flex items-center
                justify-center">
                <span className="text-[9px]">
                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#D1D5DB] truncate"
              title={user.userEmail}>
              {user.userEmail}
            </p>
            <p className="text-[10px] text-[#3F3F3F] font-mono mt-0.5">
              {user.userId.slice(-10)}
            </p>
          </div>
        </div>

        <ActivityBadge requests={user.totalRequests} max={maxRequests} />
      </div>

      {/* Traffic bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#4B5563]">Traffic share</span>
          <span className="text-white font-semibold">
            {((user.totalRequests / maxRequests) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700
              ${color.replace('bg-', 'bg-').replace('500', '500/60')}`}
            style={{
              width: `${(user.totalRequests / maxRequests) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            label: 'Requests',
            value: user.totalRequests,
            icon:  Activity,
            color: 'text-blue-400',
          },
          {
            label: 'Paths',
            value: user.uniquePaths,
            icon:  Layers,
            color: 'text-purple-400',
          },
          {
            label: 'Avg RT',
            value: `${user.avgResponseTime}ms`,
            icon:  Clock,
            color: rtColor(user.avgResponseTime),
          },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0F0F0F] rounded-xl p-2.5
            space-y-1 text-center">
            <stat.icon className={`w-3 h-3 mx-auto ${stat.color}`} />
            <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[9px] text-[#4B5563]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Last active */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1A1A1A]">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-[#4B5563]" />
          <span className="text-[11px] text-[#6B7280]">
            {fmtTime(user.lastActive)}
          </span>
        </div>
        <span className="text-[10px] text-[#3F3F3F]">
          {fmtExact(user.lastActive)}
        </span>
      </div>
    </div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="h-56 bg-[#1A1A1A] rounded-xl" />
      <div className="h-56 bg-[#1A1A1A] rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="h-48 bg-[#1A1A1A] rounded-xl" />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────
export default function UserBehaviorPanel() {
  const { data, loading, error, hours } = useSelector(selectUserBehavior);

  const {
    anonVsAuth      = {},
    abuseSignals    = [],
    topActiveUsers  = [],
    distribution    = {},
  } = data || {};

  const {
    total         = 0,
    authenticated = 0,
    anonymous     = 0,
    authPct       = 0,
    anonPct       = 0,
  } = anonVsAuth;

  const {
    maxPerUser    = 0,
    minPerUser    = 0,
    totalUsers    = 0,
    highActivity  = 0,
    avgPerUser    = 0,
  } = distribution;

  if (loading) return <Skeleton />;

  if (error) return (
    <div className="flex items-center gap-3 bg-red-500/10 border
      border-red-500/20 rounded-xl px-4 py-3">
      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  const maxRequests = topActiveUsers.length
    ? Math.max(...topActiveUsers.map(u => u.totalRequests), 1) : 1;

  const isAnonHeavy = anonPct > 70;

  return (
    <div className="space-y-4">

      {/* ══ KPI CARDS ══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Total Requests',
            value: total.toLocaleString(),
            sub:   `Last ${hours}h`,
            icon:  Activity,
            color: 'text-blue-400',
            card:  'bg-blue-500/5 border-blue-500/15',
          },
          {
            label: 'Authenticated',
            value: authenticated,
            sub:   `${authPct?.toFixed(1)}% of traffic`,
            icon:  UserCheck,
            color: 'text-green-400',
            card:  'bg-green-500/5 border-green-500/15',
          },
          {
            label: 'Anonymous',
            value: anonymous,
            sub:   `${anonPct?.toFixed(1)}% of traffic`,
            icon:  UserX,
            color: isAnonHeavy ? 'text-yellow-400' : 'text-purple-400',
            card:  isAnonHeavy
              ? 'bg-yellow-500/5 border-yellow-500/15'
              : 'bg-purple-500/5 border-purple-500/15',
          },
          {
            label: 'Abuse Signals',
            value: abuseSignals.length,
            sub:   abuseSignals.length > 0
              ? 'Suspicious behavior detected'
              : 'No abuse detected',
            icon:  AlertTriangle,
            color: abuseSignals.length > 0 ? 'text-red-400' : 'text-green-400',
            card:  abuseSignals.length > 0
              ? 'bg-red-500/5 border-red-500/15'
              : 'bg-green-500/5 border-green-500/15',
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

      {/* ══ ROW 2 — Anon vs Auth + Distribution ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── Anon vs Auth */}
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Anonymous vs Authenticated
            </h3>
            <p className="text-xs text-[#4B5563] mt-0.5">
              {total} total requests · {hours}h window
            </p>
          </div>

          {/* Visual */}
          <div className="flex items-center gap-6">
            {/* Half donut */}
            <div className="flex-shrink-0">
              <HalfDonut authPct={authPct} anonPct={anonPct} />
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-3">
              {[
                {
                  label:  'Anonymous',
                  count:  anonymous,
                  pct:    anonPct,
                  color:  'text-purple-400',
                  bar:    'bg-purple-500',
                  dot:    'bg-purple-500',
                  icon:   UserX,
                },
                {
                  label:  'Authenticated',
                  count:  authenticated,
                  pct:    authPct,
                  color:  'text-blue-400',
                  bar:    'bg-blue-500',
                  dot:    'bg-blue-500',
                  icon:   UserCheck,
                },
              ].map(item => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                      <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                      <span className={`text-xs font-semibold ${item.color}`}>
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-white font-bold">{item.count}</span>
                      <span className="text-[#4B5563]">
                        {item.pct?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.bar}
                        transition-all duration-700`}
                      style={{ width: `${item.pct}%`, opacity: 0.65 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Split bar */}
          <div className="space-y-2">
            <div className="h-7 bg-[#1A1A1A] rounded-xl overflow-hidden flex">
              {anonPct > 0 && (
                <div
                  className="h-full bg-purple-500/40 flex items-center
                    justify-center transition-all duration-700"
                  style={{ width: `${anonPct}%` }}
                >
                  {anonPct > 15 && (
                    <span className="text-[11px] font-bold text-purple-300">
                      {anonymous} anon
                    </span>
                  )}
                </div>
              )}
              {authPct > 0 && (
                <div
                  className="h-full bg-blue-500/50 flex items-center
                    justify-center transition-all duration-700"
                  style={{ width: `${authPct}%` }}
                >
                  {authPct > 10 && (
                    <span className="text-[11px] font-bold text-blue-300">
                      {authenticated} auth
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Insight chip */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border
            ${isAnonHeavy
              ? 'bg-yellow-500/5 border-yellow-500/15'
              : 'bg-green-500/5 border-green-500/15'}`}>
            <Info className={`w-3.5 h-3.5 flex-shrink-0
              ${isAnonHeavy ? 'text-yellow-400' : 'text-green-400'}`} />
            <p className={`text-xs ${isAnonHeavy
              ? 'text-yellow-400/80' : 'text-green-400/80'}`}>
              {isAnonHeavy
                ? `${anonPct?.toFixed(0)}% anonymous — consider adding auth gates to key routes`
                : `Auth coverage healthy — ${authPct?.toFixed(0)}% requests authenticated`
              }
            </p>
          </div>
        </div>

        {/* ── Activity Distribution */}
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-white">
              User Activity Distribution
            </h3>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Spread of request counts per user
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'Total Users',
                value: totalUsers,
                color: 'text-blue-400',
                card:  'bg-blue-500/5 border-blue-500/15',
                icon:  Users,
              },
              {
                label: 'High Activity',
                value: highActivity,
                color: highActivity > 0 ? 'text-orange-400' : 'text-green-400',
                card:  highActivity > 0
                  ? 'bg-orange-500/5 border-orange-500/15'
                  : 'bg-green-500/5 border-green-500/15',
                icon:  TrendingUp,
              },
              {
                label: 'Max Requests',
                value: maxPerUser,
                color: 'text-purple-400',
                card:  'bg-purple-500/5 border-purple-500/15',
                icon:  BarChart2,
              },
              {
                label: 'Avg per User',
                value: avgPerUser?.toFixed(1),
                color: 'text-cyan-400',
                card:  'bg-cyan-500/5 border-cyan-500/15',
                icon:  Activity,
              },
            ].map(item => (
              <div key={item.label}
                className={`border rounded-xl p-3 space-y-1 ${item.card}`}>
                <div className="flex items-center gap-1.5">
                  <item.icon className={`w-3 h-3 ${item.color}`} />
                  <p className="text-[10px] text-[#4B5563]">{item.label}</p>
                </div>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Min / Avg / Max range bar */}
          {totalUsers > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#1A1A1A]">
              <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">
                Request Range per User
              </p>
              <div className="relative h-8 bg-[#1A1A1A] rounded-xl overflow-hidden">
                {/* Range fill */}
                <div
                  className="absolute top-0 h-full bg-blue-500/20 rounded-xl"
                  style={{
                    left:  `${(minPerUser / maxPerUser) * 100}%`,
                    width: `${((maxPerUser - minPerUser) / maxPerUser) * 100}%`,
                  }}
                />
                {/* Avg marker */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-cyan-400/80"
                  style={{ left: `${(avgPerUser / maxPerUser) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#4B5563]">
                <span>Min: <span className="text-white">{minPerUser}</span></span>
                <span className="text-cyan-400">
                  Avg: {avgPerUser?.toFixed(1)}
                </span>
                <span>Max: <span className="text-white">{maxPerUser}</span></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ TOP ACTIVE USERS ══ */}
      {topActiveUsers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Most Active Users
              </h3>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Top {topActiveUsers.length} users by request count
              </p>
            </div>
            <span className="text-[11px] text-[#4B5563]">
              Last {hours}h
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {topActiveUsers.map((user, i) => (
              <UserCard
                key={user.userId}
                user={user}
                rank={i + 1}
                maxRequests={maxRequests}
              />
            ))}
          </div>
        </div>
      )}

      {/* ══ ABUSE SIGNALS ══ */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5
          border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#1A1A1A] rounded-lg flex items-center
              justify-center">
              <Eye className={`w-3.5 h-3.5 ${
                abuseSignals.length > 0 ? 'text-red-400' : 'text-green-400'
              }`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Behavioral Abuse Signals
              </p>
              <p className="text-[11px] text-[#4B5563]">
                Unusual request patterns per user
              </p>
            </div>
          </div>
          {abuseSignals.length === 0 ? (
            <span className="text-[11px] px-2 py-0.5 rounded-md
              bg-green-500/10 border border-green-500/20 text-green-400">
              All clean
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md
              bg-red-500/10 border border-red-500/20 text-red-400">
              {abuseSignals.length} signals
            </span>
          )}
        </div>

        {/* Content */}
        {abuseSignals.length === 0 ? (
          <div className="flex items-center gap-3 px-5 py-5">
            <ShieldCheck className="w-4 h-4 text-green-500/50" />
            <p className="text-xs text-green-500/50">
              No behavioral abuse signals detected in last {hours}h
            </p>
          </div>
        ) : (
          <div>
            {abuseSignals.map((signal, i) => (
              <AbuseRow key={i} signal={signal} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
