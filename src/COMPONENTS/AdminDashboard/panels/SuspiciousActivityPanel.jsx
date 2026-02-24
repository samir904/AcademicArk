// panels/SuspiciousActivityPanel.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSuspiciousActivity } from '../../../REDUX/Slices/logsSlice';
import {
  Shield, ShieldAlert, ShieldCheck, ShieldX,
  AlertTriangle, Eye, Zap, Globe,
  Clock, Activity, ChevronDown, ChevronUp,
  Lock, Search, TrendingUp, Wifi,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// ─────────────────────────────────────────────
// 🔧 RISK CONFIG
// ─────────────────────────────────────────────
const RISK_CONFIG = {
  LOW: {
    label:   'LOW',
    color:   'text-green-400',
    bg:      'bg-green-500/5',
    border:  'border-green-500/20',
    bar:     'bg-green-500',
    icon:    ShieldCheck,
    badge:   'bg-green-500/10 border-green-500/20 text-green-400',
    message: 'No significant threats detected',
  },
  MEDIUM: {
    label:   'MEDIUM',
    color:   'text-yellow-400',
    bg:      'bg-yellow-500/5',
    border:  'border-yellow-500/20',
    bar:     'bg-yellow-500',
    icon:    ShieldAlert,
    badge:   'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    message: 'Some suspicious activity detected — monitor closely',
  },
  HIGH: {
    label:   'HIGH',
    color:   'text-orange-400',
    bg:      'bg-orange-500/5',
    border:  'border-orange-500/20',
    bar:     'bg-orange-500',
    icon:    Shield,
    badge:   'bg-orange-500/10 border-orange-500/20 text-orange-400',
    message: 'High risk activity — investigate immediately',
  },
  CRITICAL: {
    label:   'CRITICAL',
    color:   'text-red-400',
    bg:      'bg-red-500/5',
    border:  'border-red-500/20',
    bar:     'bg-red-500',
    icon:    ShieldX,
    badge:   'bg-red-500/10 border-red-500/20 text-red-400',
    message: '🚨 Active attack in progress — take action now',
  },
};

const getRisk = (level) => RISK_CONFIG[level] || RISK_CONFIG.LOW;

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
// 🧩 SECTION WRAPPER — collapsible
// ─────────────────────────────────────────────
const Section = ({ title, subtitle, icon: Icon, count, color, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5
          hover:bg-[#141414] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center
            bg-[#1A1A1A]`}>
            <Icon className={`w-3.5 h-3.5 ${color}`} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="text-[11px] text-[#4B5563]">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md
              border ${color === 'text-red-400'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : color === 'text-yellow-400'
                  ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                  : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
              }`}>
              {count}
            </span>
          )}
          {count === 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-md
              bg-green-500/10 border border-green-500/20 text-green-400">
              Clean
            </span>
          )}
          {open
            ? <ChevronUp   className="w-4 h-4 text-[#4B5563]" />
            : <ChevronDown className="w-4 h-4 text-[#4B5563]" />
          }
        </div>
      </button>
      {open && (
        <div className="border-t border-[#1A1A1A]">
          {children}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// 🧩 EMPTY SECTION STATE
// ─────────────────────────────────────────────
const CleanState = ({ label }) => (
  <div className="flex items-center gap-2 px-5 py-4">
    <ShieldCheck className="w-4 h-4 text-green-500/50" />
    <span className="text-xs text-green-500/50">
      No {label} detected in this window
    </span>
  </div>
);

// ─────────────────────────────────────────────
// 🧩 IP ROW
// ─────────────────────────────────────────────
const IPRow = ({ ip, count, uniquePaths, lastSeen, label, badge }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(e => !e)}
      className="flex flex-col cursor-pointer hover:bg-[#0A0A0A] transition-colors"
    >
      <div className="flex items-center gap-3 px-5 py-3">
        <Globe className="w-3.5 h-3.5 text-[#4B5563] flex-shrink-0" />
        <span className="font-mono text-xs text-[#D1D5DB] flex-1">{ip}</span>
        {badge && (
          <span className={`text-[9px] px-2 py-0.5 rounded-md border font-semibold
            ${badge}`}>
            {label}
          </span>
        )}
        <div className="flex items-center gap-3 text-xs text-[#6B7280]">
          {uniquePaths !== undefined && (
            <span>{uniquePaths} paths</span>
          )}
          <span className="font-bold text-white">{count}×</span>
          {lastSeen && (
            <span className="text-[#3F3F3F]">{fmtTime(lastSeen)}</span>
          )}
        </div>
        {expanded
          ? <ChevronUp   className="w-3 h-3 text-[#3F3F3F]" />
          : <ChevronDown className="w-3 h-3 text-[#3F3F3F]" />
        }
      </div>

      {expanded && lastSeen && (
        <div className="px-5 pb-3 pl-12 flex items-center gap-2">
          <Clock className="w-3 h-3 text-[#4B5563]" />
          <span className="text-[11px] text-[#4B5563]">
            Last seen: {fmtExact(lastSeen)}
          </span>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// 🧩 RPM SPIKE ROW
// ─────────────────────────────────────────────
const RPMRow = ({ spike, maxRPM }) => {
  const pct = maxRPM > 0 ? Math.min((spike.rpm / maxRPM) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <Zap className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#9CA3AF]">
            {fmtExact(spike.time)}
          </span>
          <span className="text-xs font-bold text-orange-400">
            {spike.rpm} rpm
          </span>
        </div>
        <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500/60 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className="text-[11px] text-[#4B5563]">
        {spike.count} reqs
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────
// 🧩 SUSPICIOUS PATH ROW
// ─────────────────────────────────────────────
const SuspiciousPathRow = ({ item }) => (
  <div className="flex items-center gap-3 px-5 py-3">
    <Search className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
    <span className="font-mono text-xs text-[#D1D5DB] flex-1 truncate"
      title={item.path}>
      {item.path}
    </span>
    <div className="flex items-center gap-3 text-xs text-[#6B7280]">
      {item.ips?.length > 0 && (
        <span>{item.ips.length} IPs</span>
      )}
      <span className="font-bold text-purple-400">{item.count}×</span>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 🧩 RISK SCORE GAUGE (SVG)
// ─────────────────────────────────────────────
const RiskGauge = ({ score, riskConfig }) => {
  const clamped = Math.min(Math.max(score, 0), 100);
  const radius  = 40;
  const circ    = Math.PI * radius; // half circle circumference
  const offset  = circ - (clamped / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="100" height="60" viewBox="0 0 100 60">
        {/* Background arc */}
        <path
          d="M 10 55 A 40 40 0 0 1 90 55"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Score arc */}
        <path
          d="M 10 55 A 40 40 0 0 1 90 55"
          fill="none"
          stroke={
            clamped >= 75 ? '#EF4444' :
            clamped >= 50 ? '#F97316' :
            clamped >= 25 ? '#EAB308' : '#22C55E'
          }
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={`${offset}`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        {/* Score text */}
        <text x="50" y="52" textAnchor="middle"
          fill="white" fontSize="16" fontWeight="bold">
          {clamped}
        </text>
      </svg>
      <span className={`text-[11px] font-bold ${riskConfig.color}`}>
        {riskConfig.label} RISK
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────
// 🧩 SKELETON
// ─────────────────────────────────────────────
const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-32 bg-[#1A1A1A] rounded-xl" />
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 bg-[#1A1A1A] rounded-xl" />
      ))}
    </div>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-16 bg-[#1A1A1A] rounded-xl" />
    ))}
  </div>
);

// ─────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────
export default function SuspiciousActivityPanel() {
  const {
    data,
    loading,
    error,
    hours,
    riskScore  = 0,
    riskLevel  = 'LOW',
  } = useSelector(selectSuspiciousActivity);

  const {
    highFreqIPs      = [],
    abuse401IPs      = [],
    abuse404IPs      = [],
    rpmSpikes        = [],
    suspiciousPaths  = [],
    summary          = {},
  } = data || {};

  const risk = getRisk(riskLevel);
  const RiskIcon = risk.icon;

  if (loading) return <Skeleton />;

  if (error) return (
    <div className="flex items-center gap-3 bg-red-500/10 border
      border-red-500/20 rounded-xl px-4 py-3">
      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  const allClear = riskScore === 0 &&
    !highFreqIPs.length && !abuse401IPs.length &&
    !abuse404IPs.length && !rpmSpikes.length &&
    !suspiciousPaths.length;

  const maxRPM = rpmSpikes.length
    ? Math.max(...rpmSpikes.map(s => s.rpm), 1) : 1;

  return (
    <div className="space-y-4">

      {/* ══ RISK HEADER BANNER ══ */}
      <div className={`border rounded-xl p-5 ${risk.bg} ${risk.border}`}>
        <div className="flex flex-wrap items-center gap-6">

          {/* Gauge */}
          <RiskGauge score={riskScore} riskConfig={risk} />

          {/* Text */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <RiskIcon className={`w-5 h-5 ${risk.color}`} />
              <h2 className="text-base font-bold text-white">
                Security Risk Assessment
              </h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md
                border ${risk.badge}`}>
                {risk.label}
              </span>
            </div>
            <p className={`text-sm ${risk.color}`}>{risk.message}</p>
            <p className="text-xs text-[#4B5563]">
              Analysis window: last {hours} hours
            </p>
          </div>

          {/* Score bar */}
          <div className="w-full md:w-48 space-y-1.5">
            <div className="flex justify-between text-[10px] text-[#4B5563]">
              <span>Risk Score</span>
              <span className={risk.color}>{riskScore}/100</span>
            </div>
            <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000
                  ${risk.bar}`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-[#2F2F2F]">
              <span>Safe</span>
              <span>Critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ SUMMARY KPI CARDS ══ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {
            label: 'Suspicious IPs',
            value: summary.totalSuspiciousIPs ?? 0,
            icon:  Globe,
            color: summary.totalSuspiciousIPs > 0 ? 'text-red-400' : 'text-green-400',
            card:  summary.totalSuspiciousIPs > 0
              ? 'bg-red-500/5 border-red-500/15'
              : 'bg-[#0F0F0F] border-[#1F1F1F]',
          },
          {
            label: 'Brute Force',
            value: summary.bruteForceAttempts ?? 0,
            icon:  Lock,
            color: summary.bruteForceAttempts > 0 ? 'text-orange-400' : 'text-green-400',
            card:  summary.bruteForceAttempts > 0
              ? 'bg-orange-500/5 border-orange-500/15'
              : 'bg-[#0F0F0F] border-[#1F1F1F]',
          },
          {
            label: 'Path Scans',
            value: summary.pathScanAttempts ?? 0,
            icon:  Search,
            color: summary.pathScanAttempts > 0 ? 'text-yellow-400' : 'text-green-400',
            card:  summary.pathScanAttempts > 0
              ? 'bg-yellow-500/5 border-yellow-500/15'
              : 'bg-[#0F0F0F] border-[#1F1F1F]',
          },
          {
            label: 'Peak RPM',
            value: summary.peakRPM ?? 0,
            icon:  Zap,
            color: summary.peakRPM > 100 ? 'text-orange-400'
                 : summary.peakRPM > 50  ? 'text-yellow-400' : 'text-green-400',
            card:  summary.peakRPM > 100
              ? 'bg-orange-500/5 border-orange-500/15'
              : 'bg-[#0F0F0F] border-[#1F1F1F]',
          },
          {
            label: 'Attack Probes',
            value: summary.attackProbes ?? 0,
            icon:  Eye,
            color: summary.attackProbes > 0 ? 'text-red-400' : 'text-green-400',
            card:  summary.attackProbes > 0
              ? 'bg-red-500/5 border-red-500/15'
              : 'bg-[#0F0F0F] border-[#1F1F1F]',
          },
        ].map(item => (
          <div key={item.label}
            className={`border rounded-xl p-4 space-y-1.5 ${item.card}`}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-[#4B5563] uppercase tracking-wider
                font-semibold leading-tight">{item.label}</p>
              <item.icon className={`w-3.5 h-3.5 ${item.color} opacity-60`} />
            </div>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* ══ ALL CLEAR STATE ══ */}
      {allClear && (
        <div className="flex flex-col items-center justify-center py-10
          bg-green-500/5 border border-green-500/15 rounded-xl gap-3">
          <ShieldCheck className="w-10 h-10 text-green-400" />
          <p className="text-green-400 font-semibold text-sm">
            All systems secure 🎉
          </p>
          <p className="text-[#4B5563] text-xs text-center max-w-xs">
            No suspicious IPs, brute force attempts, path scans,
            RPM spikes, or attack probes detected in the last {hours}h.
          </p>
        </div>
      )}

      {/* ══ HIGH FREQUENCY IPs ══ */}
      {!allClear && (
        <>
          <Section
            title="High Frequency IPs"
            subtitle="IPs making unusually high request volume"
            icon={Activity}
            count={highFreqIPs.length}
            color="text-orange-400"
          >
            {highFreqIPs.length === 0 ? (
              <CleanState label="high frequency IPs" />
            ) : (
              <div className="divide-y divide-[#141414]">
                {highFreqIPs.map((ip, i) => (
                  <IPRow
                    key={i}
                    ip={ip.ip}
                    count={ip.count}
                    uniquePaths={ip.uniquePaths}
                    lastSeen={ip.lastSeen}
                    label="HIGH FREQ"
                    badge="bg-orange-500/10 border-orange-500/20 text-orange-400"
                  />
                ))}
              </div>
            )}
          </Section>

          {/* ── 401 Abuse IPs (Brute Force) */}
          <Section
            title="401 Abuse IPs"
            subtitle="Repeated unauthorized requests — possible brute force"
            icon={Lock}
            count={abuse401IPs.length}
            color="text-red-400"
          >
            {abuse401IPs.length === 0 ? (
              <CleanState label="401 abuse IPs" />
            ) : (
              <div className="divide-y divide-[#141414]">
                {abuse401IPs.map((ip, i) => (
                  <IPRow
                    key={i}
                    ip={ip.ip}
                    count={ip.count}
                    lastSeen={ip.lastSeen}
                    label="BRUTE FORCE"
                    badge="bg-red-500/10 border-red-500/20 text-red-400"
                  />
                ))}
              </div>
            )}
          </Section>

          {/* ── 404 Abuse IPs (Path Scanning) */}
          <Section
            title="404 Abuse IPs"
            subtitle="Mass 404s from same IP — possible path/directory scanning"
            icon={Search}
            count={abuse404IPs.length}
            color="text-yellow-400"
          >
            {abuse404IPs.length === 0 ? (
              <CleanState label="404 abuse IPs" />
            ) : (
              <div className="divide-y divide-[#141414]">
                {abuse404IPs.map((ip, i) => (
                  <IPRow
                    key={i}
                    ip={ip.ip}
                    count={ip.count}
                    uniquePaths={ip.paths?.length}
                    lastSeen={ip.lastSeen}
                    label="SCANNING"
                    badge="bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                  />
                ))}
              </div>
            )}
          </Section>

          {/* ── RPM Spikes */}
          <Section
            title="RPM Spikes"
            subtitle="Sudden bursts in requests-per-minute"
            icon={TrendingUp}
            count={rpmSpikes.length}
            color="text-orange-400"
          >
            {rpmSpikes.length === 0 ? (
              <CleanState label="RPM spikes" />
            ) : (
              <div className="divide-y divide-[#141414]">
                {rpmSpikes.map((spike, i) => (
                  <RPMRow key={i} spike={spike} maxRPM={maxRPM} />
                ))}
              </div>
            )}
          </Section>

          {/* ── Suspicious Paths */}
          <Section
            title="Suspicious Paths"
            subtitle="Attack probe patterns — /admin, /.env, /wp-login, etc."
            icon={Eye}
            count={suspiciousPaths.length}
            color="text-purple-400"
          >
            {suspiciousPaths.length === 0 ? (
              <CleanState label="suspicious path probes" />
            ) : (
              <div className="divide-y divide-[#141414]">
                {suspiciousPaths.map((item, i) => (
                  <SuspiciousPathRow key={i} item={item} />
                ))}
              </div>
            )}
          </Section>

          {/* ══ RECOMMENDATIONS ══ */}
          {(riskLevel === 'HIGH' || riskLevel === 'CRITICAL') && (
            <div className="bg-red-500/5 border border-red-500/15 rounded-xl
              p-5 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldX className="w-4 h-4 text-red-400" />
                <p className="text-sm font-semibold text-red-400">
                  Recommended Actions
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'Add IP rate limiting via express-rate-limit',
                  'Block top offending IPs via nginx or firewall rules',
                  'Enable helmet.js for security headers',
                  'Add CAPTCHA on auth endpoints',
                  'Set up fail2ban on your server',
                  'Review and remove exposed sensitive paths',
                  'Enable MongoDB Atlas IP allowlist',
                  'Alert on >50 RPM per IP threshold',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2
                    text-[11px] text-[#6B7280]">
                    <span className="text-red-400/60 font-bold flex-shrink-0">
                      {i + 1}.
                    </span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
