// panels/DeviceIntelligencePanel.jsx
import { useSelector } from 'react-redux';
import { selectDeviceIntelligence } from '../../../REDUX/Slices/logsSlice';
import {
  Monitor, Smartphone, Tablet, Globe,
  Cpu, AlertTriangle, Info, TrendingUp,
} from 'lucide-react';

// ─────────────────────────────────────────────
// 🔧 CONFIG
// ─────────────────────────────────────────────
const BROWSER_COLORS = {
  Chrome:  { bar: 'bg-blue-500',   text: 'text-blue-400',   card: 'bg-blue-500/5 border-blue-500/15',     dot: 'bg-blue-500'   },
  Firefox: { bar: 'bg-orange-500', text: 'text-orange-400', card: 'bg-orange-500/5 border-orange-500/15', dot: 'bg-orange-500' },
  Safari:  { bar: 'bg-cyan-500',   text: 'text-cyan-400',   card: 'bg-cyan-500/5 border-cyan-500/15',     dot: 'bg-cyan-500'   },
  Edge:    { bar: 'bg-teal-500',   text: 'text-teal-400',   card: 'bg-teal-500/5 border-teal-500/15',     dot: 'bg-teal-500'   },
  Opera:   { bar: 'bg-red-500',    text: 'text-red-400',    card: 'bg-red-500/5 border-red-500/15',       dot: 'bg-red-500'    },
  IE:      { bar: 'bg-yellow-500', text: 'text-yellow-400', card: 'bg-yellow-500/5 border-yellow-500/15', dot: 'bg-yellow-500' },
};
const DEFAULT_BROWSER = { bar: 'bg-gray-500', text: 'text-gray-400', card: 'bg-[#1A1A1A] border-[#2F2F2F]', dot: 'bg-gray-500' };

const OS_COLORS = {
  Windows: { bar: 'bg-blue-400',   text: 'text-blue-400'   },
  macOS:   { bar: 'bg-gray-400',   text: 'text-gray-300'   },
  Android: { bar: 'bg-green-500',  text: 'text-green-400'  },
  iOS:     { bar: 'bg-cyan-400',   text: 'text-cyan-400'   },
  Linux:   { bar: 'bg-yellow-500', text: 'text-yellow-400' },
};
const DEFAULT_OS = { bar: 'bg-gray-500', text: 'text-gray-400' };

const DEVICE_CONFIG = {
  Desktop: { icon: Monitor,    color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   bar: 'bg-blue-500'   },
  Mobile:  { icon: Smartphone, color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  bar: 'bg-green-500'  },
  Tablet:  { icon: Tablet,     color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', bar: 'bg-purple-500' },
};
const DEFAULT_DEVICE = { icon: Monitor, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', bar: 'bg-gray-500' };

const rtColor = (ms) => {
  if (ms >= 2000) return 'text-red-400';
  if (ms >= 1000) return 'text-orange-400';
  if (ms >= 500)  return 'text-yellow-400';
  return 'text-green-400';
};

// ─────────────────────────────────────────────
// 🧩 DONUT CHART (SVG)
// ─────────────────────────────────────────────
const DonutChart = ({ segments, size = 100, thickness = 14 }) => {
  const R    = (size / 2) - thickness;
  const cx   = size / 2;
  const cy   = size / 2;
  const circ = 2 * Math.PI * R;

  let offset = 0;
  const slices = segments.map(seg => {
    const dash  = (seg.pct / 100) * circ;
    const gap   = circ - dash;
    const slice = { ...seg, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={R}
        fill="none" stroke="#111" strokeWidth={thickness} />
      {slices.map((s, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={R}
          fill="none"
          stroke={s.color}
          strokeWidth={thickness}
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={-s.offset + circ * 0.25}
          strokeLinecap="butt"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      ))}
    </svg>
  );
};

// ─────────────────────────────────────────────
// 🧩 HORIZONTAL STAT BAR
// ─────────────────────────────────────────────
const StatBar = ({ label, value, pct, barClass, textClass, sub }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${barClass}`} />
        <span className="text-xs text-[#9CA3AF]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {sub && <span className="text-[10px] text-[#4B5563]">{sub}</span>}
        <span className={`text-xs font-bold ${textClass}`}>{value}</span>
        <span className="text-[10px] text-[#4B5563] w-10 text-right">
          {pct?.toFixed(1)}%
        </span>
      </div>
    </div>
    <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${barClass} transition-all duration-700`}
        style={{ width: `${pct || 0}%`, opacity: 0.75 }}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────
// 🧩 SKELETON
// ─────────────────────────────────────────────
const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-[#1A1A1A] rounded-xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-64 bg-[#1A1A1A] rounded-xl" />
      ))}
    </div>
    <div className="h-32 bg-[#1A1A1A] rounded-xl" />
  </div>
);

// ─────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────
export default function DeviceIntelligencePanel() {
  const { data, loading, error, hours } =
    useSelector(selectDeviceIntelligence);

  const {
    deviceBreakdown  = [],
    browserBreakdown = [],
    osBreakdown      = [],
    mobileVsDesktop  = {},
    insight          = '',
  } = data || {};

  if (loading) return <Skeleton />;

  if (error) return (
    <div className="flex items-center gap-3 bg-red-500/10 border
      border-red-500/20 rounded-xl px-4 py-3">
      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  if (!deviceBreakdown.length && !browserBreakdown.length) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Monitor className="w-8 h-8 text-[#2F2F2F] mb-3" />
      <p className="text-[#4B5563] text-sm">No device data for last {hours}h</p>
    </div>
  );

  // ── Derived totals
  const { total = 0, mobile = 0, desktop = 0, mobilePct = 0, desktopPct = 0 } =
    mobileVsDesktop;

  const topBrowser = browserBreakdown[0] || null;
  const topOS      = osBreakdown[0]      || null;
  const topDevice  = deviceBreakdown[0]  || null;

  // ── Donut segments for device
  const deviceSegments = deviceBreakdown.map(d => {
    const cfg = DEVICE_CONFIG[d.device] || DEFAULT_DEVICE;
    return {
      pct:   d.percentage,
      color: cfg.bar.replace('bg-', '#').length > 4
        ? ({
            'bg-blue-500':   '#3B82F6',
            'bg-green-500':  '#22C55E',
            'bg-purple-500': '#A855F7',
            'bg-gray-500':   '#6B7280',
          }[cfg.bar] || '#3B82F6')
        : '#3B82F6',
      label: d.device,
    };
  });

  // ── Donut segments for browser
  const BROWSER_HEX = {
    Chrome:  '#3B82F6',
    Firefox: '#F97316',
    Safari:  '#06B6D4',
    Edge:    '#14B8A6',
    Opera:   '#EF4444',
    IE:      '#EAB308',
  };
  const browserSegments = browserBreakdown.map(b => ({
    pct:   b.percentage || ((b.count / (total || 1)) * 100),
    color: BROWSER_HEX[b.browser] || '#6B7280',
    label: b.browser,
  }));

  // ── Mobile vs Desktop for big visual
  const isMobileFirst = mobilePct > 50;

  return (
    <div className="space-y-4">

      {/* ══ KPI CARDS ══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Total Requests',
            value: total.toLocaleString(),
            sub:   `Last ${hours}h`,
            icon:  TrendingUp,
            color: 'text-blue-400',
            card:  'bg-blue-500/5 border-blue-500/15',
          },
          {
            label: 'Top Device',
            value: topDevice?.device || '—',
            sub:   `${topDevice?.percentage ?? 0}% of traffic`,
            icon:  Monitor,
            color: 'text-purple-400',
            card:  'bg-purple-500/5 border-purple-500/15',
          },
          {
            label: 'Top Browser',
            value: topBrowser?.browser || '—',
            sub:   `${(topBrowser?.percentage || ((topBrowser?.count / (total || 1)) * 100))?.toFixed(1)}% share`,
            icon:  Globe,
            color: 'text-cyan-400',
            card:  'bg-cyan-500/5 border-cyan-500/15',
          },
          {
            label: 'Top OS',
            value: topOS?.os || '—',
            sub:   `${osBreakdown.length} OS detected`,
            icon:  Cpu,
            color: 'text-green-400',
            card:  'bg-green-500/5 border-green-500/15',
          },
        ].map(item => (
          <div key={item.label}
            className={`border rounded-xl p-4 space-y-1.5 ${item.card}`}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-[#4B5563] uppercase tracking-wider
                font-semibold">{item.label}</p>
              <item.icon className={`w-3.5 h-3.5 ${item.color} opacity-60`} />
            </div>
            <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-[11px] text-[#4B5563]">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* ══ ROW 2 — Device / Browser / OS ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Device Breakdown */}
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-white">Device Types</h3>
            <p className="text-xs text-[#4B5563] mt-0.5">Desktop · Mobile · Tablet</p>
          </div>

          {/* Donut + legend */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative">
              <DonutChart segments={deviceSegments} size={96} thickness={12} />
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-lg font-bold text-white">
                  {deviceBreakdown.reduce((s, d) => s + d.count, 0)}
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2">
              {deviceBreakdown.map(d => {
                const cfg = DEVICE_CONFIG[d.device] || DEFAULT_DEVICE;
                const DevIcon = cfg.icon;
                return (
                  <div key={d.device} className={`flex items-center gap-2
                    px-3 py-2 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                    <DevIcon className={`w-3.5 h-3.5 ${cfg.color} flex-shrink-0`} />
                    <span className={`text-xs font-semibold ${cfg.color}`}>
                      {d.device}
                    </span>
                    <span className="ml-auto text-xs text-white font-bold">
                      {d.count}
                    </span>
                    <span className="text-[10px] text-[#4B5563]">
                      {d.percentage?.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bars */}
          <div className="space-y-2 pt-2 border-t border-[#1A1A1A]">
            {deviceBreakdown.map(d => {
              const cfg = DEVICE_CONFIG[d.device] || DEFAULT_DEVICE;
              return (
                <StatBar
                  key={d.device}
                  label={d.device}
                  value={d.count}
                  pct={d.percentage}
                  barClass={cfg.bar}
                  textClass={cfg.color}
                />
              );
            })}
          </div>
        </div>

        {/* ── Browser Breakdown */}
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-white">Browsers</h3>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Traffic + error rate per browser
            </p>
          </div>

          {/* Donut + total */}
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <DonutChart segments={browserSegments} size={96} thickness={12} />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs font-bold text-white">
                  {browserBreakdown.length}
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              {browserBreakdown.map(b => {
                const s   = BROWSER_COLORS[b.browser] || DEFAULT_BROWSER;
                const pct = b.percentage ||
                  ((b.count / (total || 1)) * 100);
                return (
                  <div key={b.browser} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.dot} flex-shrink-0`} />
                    <span className={`text-xs font-semibold ${s.text} flex-1`}>
                      {b.browser}
                    </span>
                    <span className="text-[10px] text-[#4B5563]">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed bars with RT */}
          <div className="space-y-3 pt-2 border-t border-[#1A1A1A]">
            {browserBreakdown.map(b => {
              const s   = BROWSER_COLORS[b.browser] || DEFAULT_BROWSER;
              const pct = b.percentage ||
                ((b.count / (total || 1)) * 100);
              const errRate = b.count > 0
                ? ((b.errors / b.count) * 100).toFixed(1) : 0;

              return (
                <div key={b.browser} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      <span className={`text-xs font-semibold ${s.text}`}>
                        {b.browser}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                      {b.avgResponseTime > 0 && (
                        <span className={rtColor(b.avgResponseTime)}>
                          {b.avgResponseTime}ms
                        </span>
                      )}
                      {b.errors > 0 && (
                        <span className="text-red-400">
                          {errRate}% err
                        </span>
                      )}
                      <span className="text-[#4B5563]">
                        {b.count} reqs
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.bar}
                        transition-all duration-700`}
                      style={{ width: `${pct}%`, opacity: 0.7 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── OS Breakdown */}
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-white">Operating Systems</h3>
            <p className="text-xs text-[#4B5563] mt-0.5">
              {osBreakdown.length} OS detected
            </p>
          </div>

          {/* OS Cards */}
          <div className="space-y-3">
            {osBreakdown.map((o, i) => {
              const s   = OS_COLORS[o.os] || DEFAULT_OS;
              const osTotal = osBreakdown.reduce((sum, x) => sum + x.count, 0);
              const pct = osTotal > 0
                ? ((o.count / osTotal) * 100).toFixed(1) : 0;
              const maxOsCount = Math.max(...osBreakdown.map(x => x.count), 1);

              return (
                <div key={o.os} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#3F3F3F] font-mono w-4">
                        {i + 1}
                      </span>
                      <Cpu className={`w-3.5 h-3.5 ${s.text}`} />
                      <span className={`text-sm font-semibold ${s.text}`}>
                        {o.os}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-white font-bold">{o.count}</span>
                      <span className="text-[#4B5563]">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.bar}
                        transition-all duration-700`}
                      style={{
                        width: `${(o.count / maxOsCount) * 100}%`,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* OS summary */}
          {osBreakdown.length > 0 && (
            <div className="pt-3 border-t border-[#1A1A1A] space-y-2">
              <p className="text-[10px] text-[#4B5563] uppercase tracking-wider">
                Platform Mix
              </p>
              {[
                {
                  label: 'Desktop OS',
                  keys:  ['Windows', 'macOS', 'Linux'],
                  color: 'text-blue-400',
                },
                {
                  label: 'Mobile OS',
                  keys:  ['Android', 'iOS'],
                  color: 'text-green-400',
                },
              ].map(group => {
                const cnt = osBreakdown
                  .filter(o => group.keys.includes(o.os))
                  .reduce((s, o) => s + o.count, 0);
                const osTotal = osBreakdown.reduce((s, o) => s + o.count, 0);
                const pct = osTotal > 0
                  ? ((cnt / osTotal) * 100).toFixed(1) : 0;
                return cnt > 0 ? (
                  <div key={group.label}
                    className="flex items-center justify-between text-xs">
                    <span className="text-[#6B7280]">{group.label}</span>
                    <span className={`font-semibold ${group.color}`}>
                      {cnt} ({pct}%)
                    </span>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>

      {/* ══ MOBILE vs DESKTOP VISUAL ══ */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Mobile vs Desktop
            </h3>
            <p className="text-xs text-[#4B5563] mt-0.5">
              {total} total requests · {hours}h window
            </p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            border text-xs font-semibold ${
            isMobileFirst
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}>
            {isMobileFirst
              ? <Smartphone className="w-3.5 h-3.5" />
              : <Monitor    className="w-3.5 h-3.5" />
            }
            {isMobileFirst ? 'Mobile-first' : 'Desktop-first'} traffic
          </div>
        </div>

        {/* Big split bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-400 font-semibold">
                Desktop — {desktopPct?.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-green-400 font-semibold">
                {mobilePct?.toFixed(1)}% — Mobile
              </span>
              <Smartphone className="w-3.5 h-3.5 text-green-400" />
            </div>
          </div>

          {/* Split bar */}
          <div className="h-8 bg-[#1A1A1A] rounded-xl overflow-hidden flex">
            {desktopPct > 0 && (
              <div
                className="h-full bg-blue-500/50 flex items-center justify-center
                  transition-all duration-700"
                style={{ width: `${desktopPct}%` }}
              >
                {desktopPct > 15 && (
                  <span className="text-[11px] font-bold text-blue-300">
                    {desktop}
                  </span>
                )}
              </div>
            )}
            {mobilePct > 0 && (
              <div
                className="h-full bg-green-500/50 flex items-center
                  justify-center transition-all duration-700"
                style={{ width: `${mobilePct}%` }}
              >
                {mobilePct > 15 && (
                  <span className="text-[11px] font-bold text-green-300">
                    {mobile}
                  </span>
                )}
              </div>
            )}
            {/* Remainder (untracked) */}
            {(desktopPct + mobilePct) < 100 && (
              <div
                className="h-full bg-[#1A1A1A] flex items-center
                  justify-center flex-1"
              >
                <span className="text-[10px] text-[#3F3F3F]">
                  {(100 - desktopPct - mobilePct).toFixed(1)}% untracked
                </span>
              </div>
            )}
          </div>

          {/* Stat pills */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              {
                label: 'Desktop',
                count: desktop,
                pct:   desktopPct,
                color: 'text-blue-400',
                bg:    'bg-blue-500/5 border-blue-500/15',
                icon:  Monitor,
              },
              {
                label: 'Mobile',
                count: mobile,
                pct:   mobilePct,
                color: 'text-green-400',
                bg:    'bg-green-500/5 border-green-500/15',
                icon:  Smartphone,
              },
              {
                label: 'Total',
                count: total,
                pct:   100,
                color: 'text-white',
                bg:    'bg-[#141414] border-[#2F2F2F]',
                icon:  TrendingUp,
              },
            ].map(item => (
              <div key={item.label}
                className={`border rounded-xl p-3 space-y-1 ${item.bg}`}>
                <div className="flex items-center gap-1.5">
                  <item.icon className={`w-3 h-3 ${item.color}`} />
                  <span className="text-[10px] text-[#4B5563]">{item.label}</span>
                </div>
                <p className={`text-xl font-bold ${item.color}`}>
                  {item.count.toLocaleString()}
                </p>
                <p className="text-[10px] text-[#4B5563]">
                  {item.pct?.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ AI INSIGHT STRIP ══ */}
      {insight && (
        <div className="flex items-start gap-3 bg-[#0F0F0F] border
          border-[#1F1F1F] rounded-xl px-4 py-3">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#9CA3AF] leading-relaxed">{insight}</p>
        </div>
      )}

    </div>
  );
}
