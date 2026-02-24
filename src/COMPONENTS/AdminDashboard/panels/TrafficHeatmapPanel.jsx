// panels/TrafficHeatmapPanel.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTrafficHeatmap } from '../../../REDUX/Slices/logsSlice';
import { TrendingUp, AlertTriangle, Clock, Activity } from 'lucide-react';

// ─────────────────────────────────────────────
// 🔧 CONSTANTS
// ─────────────────────────────────────────────
// MongoDB $dayOfWeek: 1=Sunday … 7=Saturday
const WEEKDAY_LABELS = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS  = [1, 2, 3, 4, 5, 6, 7];

const HOUR_LABELS = HOURS.map(h => {
  if (h === 0)  return '12a';
  if (h === 12) return '12p';
  return h < 12 ? `${h}a` : `${h - 12}p`;
});

// ── View modes
const MODES = [
  { id: 'requests', label: 'Requests',    color: (intensity) => `rgba(59,130,246,${intensity})`   }, // blue
  { id: 'errors',   label: 'Errors',      color: (intensity) => `rgba(239,68,68,${intensity})`    }, // red
  { id: 'rt',       label: 'Avg RT (ms)', color: (intensity) => `rgba(245,158,11,${intensity})`   }, // amber
];

// ─────────────────────────────────────────────
// 🔧 HELPERS
// ─────────────────────────────────────────────
// Build full 7×24 grid — fill missing cells with null
const buildGrid = (data) => {
  const map = {};
  data.forEach(d => {
    map[`${d.weekday}-${d.hour}`] = d;
  });
  const grid = {};
  DAYS.forEach(day => {
    grid[day] = {};
    HOURS.forEach(hour => {
      grid[day][hour] = map[`${day}-${hour}`] || null;
    });
  });
  return grid;
};
// ✅ FIX 1 — Better hour formatter (readable labels)
const fmtHour = (h) => {
  if (h === 0)  return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
};

const getCellValue = (cell, mode) => {
  if (!cell) return 0;
  if (mode === 'requests') return cell.requests;
  if (mode === 'errors')   return cell.errors;
  if (mode === 'rt')       return cell.avgResponseTime;
  return 0;
};

const fmtCellValue = (val, mode) => {
  if (val === 0) return '—';
  if (mode === 'rt') return `${val}ms`;
  return String(val);
};

// ─────────────────────────────────────────────
// 🧩 TOOLTIP
// ─────────────────────────────────────────────
const Tooltip = ({ cell, day, hour, visible }) => {
  if (!visible || !cell) return null;
  return (
    <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2
      bg-[#1A1A1A] border border-[#3F3F3F] rounded-xl p-3 w-44
      shadow-xl pointer-events-none">
      <p className="text-xs font-semibold text-white mb-2">
  {WEEKDAY_LABELS[day]}, {fmtHour(hour)}
</p>
      <div className="space-y-1">
        {[
          { label: 'Requests', val: cell.requests,        color: 'text-blue-400'  },
          { label: 'Errors',   val: cell.errors,          color: 'text-red-400'   },
          { label: 'Avg RT',   val: `${cell.avgResponseTime}ms`, color: 'text-yellow-400' },
        ].map(item => (
          <div key={item.label} className="flex justify-between">
            <span className="text-[11px] text-[#6B7280]">{item.label}</span>
            <span className={`text-[11px] font-semibold ${item.color}`}>
              {item.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// 🧩 HEATMAP CELL
// ─────────────────────────────────────────────
const HeatCell = ({ cell, day, hour, intensity, modeColor, mode }) => {
  const [hovered, setHovered] = useState(false);
  const value = getCellValue(cell, mode);
  const hasData = cell && value > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`w-full aspect-square rounded-sm transition-all duration-300
          cursor-default ${hasData ? 'hover:ring-1 hover:ring-white/20' : ''}`}
        style={{
          backgroundColor: hasData
            ? modeColor(Math.max(0.08, intensity))
            : '#111111',
          minWidth: 14,
          minHeight: 14,
        }}
      />
      {hovered && (
        <Tooltip cell={cell} day={day} hour={hour} visible={hovered} />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// 🧩 LEGEND GRADIENT
// ─────────────────────────────────────────────
const Legend = ({ modeColor, max }) => (
  <div className="flex items-center gap-3">
    <span className="text-[10px] text-[#4B5563]">Low</span>
    <div className="flex items-center gap-0.5">
      {[0.08, 0.2, 0.35, 0.5, 0.65, 0.8, 1].map((op, i) => (
        <div
          key={i}
          className="w-5 h-3 rounded-sm"
          style={{ backgroundColor: modeColor(op) }}
        />
      ))}
    </div>
    <span className="text-[10px] text-[#4B5563]">High ({max})</span>
  </div>
);

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
    <div className="h-64 bg-[#1A1A1A] rounded-xl" />
    <div className="h-40 bg-[#1A1A1A] rounded-xl" />
  </div>
);

// ─────────────────────────────────────────────
// 🎯 MAIN COMPONENT
// ─────────────────────────────────────────────
export default function TrafficHeatmapPanel() {
  const { data: raw = [], loading, error, hours } =
    useSelector(selectTrafficHeatmap);

  const [mode, setMode] = useState('requests');

  if (loading) return <Skeleton />;

  if (error) return (
    <div className="flex items-center gap-3 bg-red-500/10 border
      border-red-500/20 rounded-xl px-4 py-3">
      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  if (!raw.length) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <TrendingUp className="w-8 h-8 text-[#2F2F2F] mb-3" />
      <p className="text-[#4B5563] text-sm">
        No heatmap data for last {hours}h
      </p>
    </div>
  );

  // ── Build grid + stats
  const grid         = buildGrid(raw);
  const currentMode  = MODES.find(m => m.id === mode);
  const modeColor    = currentMode.color;

  const allValues    = raw.map(d => getCellValue(d, mode));
  const maxValue     = Math.max(...allValues, 1);
  const totalReqs    = raw.reduce((s, d) => s + d.requests, 0);
  const totalErrors  = raw.reduce((s, d) => s + d.errors,   0);
  const avgRT        = raw.length
    ? (raw.reduce((s, d) => s + d.avgResponseTime, 0) / raw.length).toFixed(0)
    : 0;

  // ── Peak hour
  const peakEntry = raw.reduce((best, d) =>
    d.requests > (best?.requests || 0) ? d : best, null
  );
  
// ✅ FIX 2 — peakLabel without :00
const peakLabel = peakEntry
  ? `${WEEKDAY_LABELS[peakEntry.weekday]}, ${fmtHour(peakEntry.hour)}`
  : '—';


  // ── Per-day summary
  const daySummary = DAYS.map(day => ({
    day,
    label: WEEKDAY_LABELS[day],
    total: HOURS.reduce((s, h) => s + (grid[day][h]?.requests || 0), 0),
    errors: HOURS.reduce((s, h) => s + (grid[day][h]?.errors || 0), 0),
  }));

  // ── Per-hour summary (for bar chart below heatmap)
  const hourSummary = HOURS.map(h => ({
    hour: h,
    total: DAYS.reduce((s, d) => s + (grid[d][h]?.requests || 0), 0),
    errors: DAYS.reduce((s, d) => s + (grid[d][h]?.errors || 0), 0),
  }));
  const maxHourTotal = Math.max(...hourSummary.map(h => h.total), 1);

  return (
    <div className="space-y-4">

      {/* ══ KPI CARDS ══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Total Requests',
            value: totalReqs.toLocaleString(),
            icon:  Activity,
            color: 'text-blue-400',
            card:  'bg-blue-500/5 border-blue-500/15',
          },
          {
            label: 'Total Errors',
            value: totalErrors,
            icon:  AlertTriangle,
            color: totalErrors > 0 ? 'text-red-400' : 'text-green-400',
            card:  totalErrors > 0
              ? 'bg-red-500/5 border-red-500/15'
              : 'bg-green-500/5 border-green-500/15',
          },
          {
            label: 'Avg Response Time',
            value: `${avgRT}ms`,
            icon:  Clock,
            color: avgRT > 1000 ? 'text-red-400'
                 : avgRT > 500  ? 'text-yellow-400' : 'text-green-400',
            card:  avgRT > 1000 ? 'bg-red-500/5 border-red-500/15'
                 : avgRT > 500  ? 'bg-yellow-500/5 border-yellow-500/15'
                 : 'bg-green-500/5 border-green-500/15',
          },
          {
            label: 'Peak Traffic',
            value: peakLabel,
            sub:   peakEntry ? `${peakEntry.requests} requests` : '',
            icon:  TrendingUp,
            color: 'text-orange-400',
            card:  'bg-orange-500/5 border-orange-500/15',
          },
        ].map(item => (
          <div key={item.label}
            className={`border rounded-xl p-4 space-y-1.5 ${item.card}`}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-[#4B5563] uppercase tracking-wider
                font-semibold">{item.label}</p>
              <item.icon className={`w-3.5 h-3.5 ${item.color} opacity-60`} />
            </div>
            <p className={`text-xl font-bold leading-tight ${item.color}`}>
              {item.value}
            </p>
            {item.sub && (
              <p className="text-[11px] text-[#4B5563]">{item.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* ══ HEATMAP CARD ══ */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-5">

        {/* Header + mode toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Traffic Heatmap
            </h3>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Hour × Day of week · Hover cell for details
            </p>
          </div>

          {/* Mode pills */}
          <div className="flex items-center gap-1 bg-[#1A1A1A] rounded-lg p-1">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium
                  transition-all ${
                  mode === m.id
                    ? 'bg-[#3F3F3F] text-white'
                    : 'text-[#6B7280] hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── HEATMAP GRID ── */}
        <div className="overflow-x-auto">
          <div style={{ minWidth: 520 }}>

            {/* Hour labels row */}
            <div className="flex items-center mb-1">
              {/* Day label spacer */}
              <div className="w-10 flex-shrink-0" />
              {HOURS.map(h => (
                <div key={h} className="flex-1 text-center">
                  <span className="text-[9px] text-[#3F3F3F]">
                    {h % 3 === 0 ? fmtHour(h) : ''}
                  </span>
                </div>
              ))}
            </div>

            {/* Rows — one per weekday */}
            {DAYS.map(day => {
              const dayTotal = HOURS.reduce(
                (s, h) => s + (grid[day][h]?.requests || 0), 0
              );
              return (
                <div key={day} className="flex items-center gap-0 mb-1">
                  {/* Day label */}
                  <div className="w-10 flex-shrink-0 text-right pr-2">
                    <span className="text-[10px] text-[#4B5563]">
                      {WEEKDAY_LABELS[day]}
                    </span>
                  </div>

                  {/* Cells */}
                  {HOURS.map(h => {
                    const cell  = grid[day][h];
                    const val   = getCellValue(cell, mode);
                    const intensity = maxValue > 0 ? val / maxValue : 0;
                    return (
                      <div key={h} className="flex-1 px-px">
                        <HeatCell
                          cell={cell}
                          day={day}
                          hour={h}
                          intensity={intensity}
                          modeColor={modeColor}
                          mode={mode}
                        />
                      </div>
                    );
                  })}

                  {/* Row total */}
                  <div className="w-10 flex-shrink-0 text-right pl-2">
                    <span className="text-[10px] text-[#3F3F3F]">
                      {dayTotal > 0 ? dayTotal : ''}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Hour total bar below grid */}
            <div className="flex items-end mt-2">
              <div className="w-10 flex-shrink-0" />
              {hourSummary.map(hs => (
                <div key={hs.hour} className="flex-1 px-px flex flex-col
                  items-center gap-0.5">
                  <div
                    className="w-full rounded-sm bg-blue-500/25 transition-all"
                    style={{
                      height: Math.max(2, (hs.total / maxHourTotal) * 24),
                    }}
                  />
                </div>
              ))}
              <div className="w-10 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between flex-wrap gap-3
          pt-3 border-t border-[#1A1A1A]">
          <Legend modeColor={modeColor} max={maxValue} />
          <p className="text-[10px] text-[#3F3F3F]">
            Empty cells = no traffic in that hour
          </p>
        </div>
      </div>

      {/* ══ DAY SUMMARY BARS ══ */}
      <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Requests by Day</h3>
          <p className="text-xs text-[#4B5563] mt-0.5">
            Total traffic per day of week
          </p>
        </div>

        <div className="space-y-2.5">
          {(() => {
            const maxDay = Math.max(...daySummary.map(d => d.total), 1);
            return daySummary
              .filter(d => d.total > 0)
              .sort((a, b) => b.total - a.total)
              .map(d => {
                const pct      = ((d.total / maxDay) * 100).toFixed(0);
                const errPct   = d.total > 0
                  ? ((d.errors / d.total) * 100).toFixed(1) : 0;

                return (
                  <div key={d.day} className="flex items-center gap-3">
                    <span className="text-xs text-[#6B7280] w-8 text-right
                      flex-shrink-0">
                      {d.label}
                    </span>

                    {/* Bar */}
                    <div className="flex-1 h-6 bg-[#1A1A1A] rounded-lg
                      overflow-hidden relative">
                      {/* Total bar */}
                      <div
                        className="absolute top-0 left-0 h-full bg-blue-500/30
                          rounded-lg transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                      {/* Error overlay */}
                      {d.errors > 0 && (
                        <div
                          className="absolute top-0 left-0 h-full bg-red-500/40
                            rounded-lg transition-all duration-700"
                          style={{ width: `${(d.errors / maxDay) * 100}%` }}
                        />
                      )}
                      {/* Label inside bar */}
                      <div className="absolute inset-0 flex items-center
                        justify-between px-2.5">
                        <span className="text-[11px] font-semibold text-white/80">
                          {d.total.toLocaleString()} requests
                        </span>
                        {d.errors > 0 && (
                          <span className="text-[10px] text-red-400">
                            {errPct}% errors
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] text-[#4B5563] w-8
                      flex-shrink-0">
                      {pct}%
                    </span>
                  </div>
                );
              });
          })()}
        </div>
      </div>

      {/* ══ HOURLY PATTERN INSIGHT ══ */}
      {peakEntry && (
        <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-4">
          <h3 className="text-xs font-semibold text-white mb-3">
            Hourly Pattern
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: '🌙 Midnight (0–5)',
                hours: [0, 1, 2, 3, 4, 5],
                color: 'text-blue-400',
              },
              {
                label: '🌅 Morning (6–11)',
                hours: [6, 7, 8, 9, 10, 11],
                color: 'text-yellow-400',
              },
              {
                label: '☀️ Afternoon (12–17)',
                hours: [12, 13, 14, 15, 16, 17],
                color: 'text-orange-400',
              },
              {
                label: '🌆 Evening (18–23)',
                hours: [18, 19, 20, 21, 22, 23],
                color: 'text-purple-400',
              },
            ].map(segment => {
              const segTotal = DAYS.reduce((s, d) =>
                s + segment.hours.reduce(
                  (hs, h) => hs + (grid[d][h]?.requests || 0), 0
                ), 0
              );
              const segPct = totalReqs > 0
                ? ((segTotal / totalReqs) * 100).toFixed(1) : 0;
              return (
                <div key={segment.label}
                  className="bg-[#141414] rounded-xl p-3 space-y-1">
                  <p className="text-[11px] text-[#6B7280]">{segment.label}</p>
                  <p className={`text-xl font-bold ${segment.color}`}>
                    {segPct}%
                  </p>
                  <p className="text-[10px] text-[#3F3F3F]">
                    {segTotal.toLocaleString()} reqs
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
