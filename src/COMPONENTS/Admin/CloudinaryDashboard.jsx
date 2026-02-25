// COMPONENTS/Admin/CloudinaryDashboard.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Cloud, CloudOff, HardDrive, Wifi, Zap, FolderOpen,
  Image, Video, FileText, Package, RefreshCw, Camera,
  CalendarDays, Clock, AlertTriangle, CheckCircle2,
  Database, Layers, BarChart3, Activity,
} from 'lucide-react';
import {
  fetchCloudinaryHealth,
  fetchCloudinaryResources,
  fetchCloudinarySnapshots,
  fetchLatestSnapshot,
  triggerCloudinarySnapshot,
  setSelectedDays,
  selectCloudinaryHealth,
  selectCloudinaryResources,
  selectCloudinarySnapshots,
  selectLatestSnapshot,
  selectCloudinarySelectedDays,
  selectSnapshotTrigger,
} from '../../REDUX/Slices/cloudinarySlice';

// ─────────────────────────────────────
// 🎨 Design tokens — all #0F0F0F based
// ─────────────────────────────────────
// bg-[#0F0F0F]  → page base
// bg-[#141414]  → card surface
// bg-[#1a1a1a]  → elevated / hover
// bg-[#1f1f1f]  → inner tiles
// border-[#2a2a2a] → default border
// border-[#333]    → hover border

// ─────────────────────────────────────
// StatCard
// ─────────────────────────────────────
const StatCard = ({ label, value, sub, pct, icon: Icon, glow, iconBg, iconColor }) => {
  const barColor  = pct > 80 ? '#ef4444' : pct > 50 ? '#eab308' : '#10b981';
  const badgeBg   = pct > 80 ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : pct > 50 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

  return (
    <div
      className="relative rounded-2xl p-5 flex flex-col gap-4 border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all duration-300 overflow-hidden group"
      style={{ background: '#141414' }}
    >
      {/* Glow accent top-left */}
      <div
        className="absolute -top-8 -left-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
        style={{ background: glow }}
      />

      {/* Top row */}
      <div className="flex items-center justify-between relative z-10">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon size={16} className={iconColor} />
        </div>
        {pct !== undefined && (
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
            {pct}%
          </span>
        )}
      </div>

      {/* Value block */}
      <div className="relative z-10">
        <p className="text-[24px] font-bold text-white tracking-tight leading-none">{value}</p>
        <p className="text-[#555] text-xs mt-1.5 font-medium uppercase tracking-wide">{label}</p>
        {sub && <p className="text-[#444] text-xs mt-0.5">{sub}</p>}
      </div>

      {/* Progress bar */}
      {pct !== undefined && (
        <div className="relative z-10">
          <div className="w-full rounded-full h-[3px]" style={{ background: '#252525' }}>
            <div
              className="h-[3px] rounded-full transition-all duration-700"
              style={{ width: `${Math.min(pct, 100)}%`, background: barColor, boxShadow: `0 0 6px ${barColor}80` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────
// ResourceTile
// ─────────────────────────────────────
const ResourceTile = ({ label, val, icon: Icon, iconBg, iconColor, borderColor }) => (
  <div
    className="rounded-xl p-4 flex flex-col items-center gap-2.5 border transition-all duration-200 hover:border-[#3a3a3a] cursor-default"
    style={{ background: '#1a1a1a', borderColor: borderColor || '#2a2a2a' }}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
      <Icon size={17} className={iconColor} />
    </div>
    <p className="text-xl font-bold text-white tabular-nums">{val.toLocaleString()}</p>
    <p className="text-[#555] text-xs text-center font-medium">{label}</p>
  </div>
);

// ─────────────────────────────────────
// LimitTile
// ─────────────────────────────────────
const LimitTile = ({ label, val, icon: Icon }) => (
  <div
    className="rounded-xl p-3.5 text-center border border-[#242424] hover:border-[#333] transition-colors"
    style={{ background: '#1a1a1a' }}
  >
    <Icon size={15} className="text-[#555] mx-auto mb-2" />
    <p className="text-white font-bold text-sm">{val}</p>
    <p className="text-[#444] text-xs mt-0.5">{label}</p>
  </div>
);

// ─────────────────────────────────────
// Skeleton
// ─────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl ${className}`} style={{ background: '#1a1a1a' }} />
);

// ─────────────────────────────────────
// StatusBadge
// ─────────────────────────────────────
const StatusBadge = ({ status }) =>
  status === 'ok' ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Operational
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
      <CloudOff size={11} />
      Unreachable
    </span>
  );

// ─────────────────────────────────────
// MetaChip
// ─────────────────────────────────────
const MetaChip = ({ icon: Icon, label, value }) => (
  <div
    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#242424] text-xs"
    style={{ background: '#141414' }}
  >
    <Icon size={11} className="text-[#555]" />
    <span className="text-[#444]">{label}</span>
    <span className="text-[#888]">{value}</span>
  </div>
);

// ─────────────────────────────────────
// Section
// ─────────────────────────────────────
const Section = ({ title, icon: Icon, children, right }) => (
  <div className="rounded-2xl border border-[#242424] overflow-hidden" style={{ background: '#141414' }}>
    <div
      className="flex items-center justify-between px-5 py-3.5 border-b border-[#1f1f1f]"
      style={{ background: '#111111' }}
    >
      <div className="flex items-center gap-2.5">
        <Icon size={14} className="text-[#555]" />
        <h3 className="text-[#aaa] text-sm font-semibold tracking-wide">{title}</h3>
      </div>
      {right}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─────────────────────────────────────
// Main
// ─────────────────────────────────────
export default function CloudinaryDashboard() {
  const dispatch     = useDispatch();
  const health       = useSelector(selectCloudinaryHealth);
  const resources    = useSelector(selectCloudinaryResources);
  const snapshots    = useSelector(selectCloudinarySnapshots);
  const latest       = useSelector(selectLatestSnapshot);
  const selectedDays = useSelector(selectCloudinarySelectedDays);
  const trigger      = useSelector(selectSnapshotTrigger);

  useEffect(() => {
    dispatch(fetchCloudinaryHealth());
    dispatch(fetchCloudinaryResources());
    dispatch(fetchCloudinarySnapshots(selectedDays));
    dispatch(fetchLatestSnapshot());
  }, [selectedDays]);

  const h = health.data;
  const r = resources.data;

  return (
    <div className="min-h-screen" style={{ background: '#0F0F0F' }}>
      <div className="space-y-5 p-6 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div
          className="rounded-2xl border border-[#1f1f1f] p-5"
          style={{ background: 'linear-gradient(135deg, #141414 0%, #111111 100%)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left — title */}
            <div className="flex items-center gap-3.5">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center border border-blue-500/20"
                style={{ background: 'rgba(59,130,246,0.08)' }}
              >
                <Cloud size={20} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Cloudinary Health</h2>
                <p className="text-[#555] text-xs mt-0.5">Real-time cloud storage · AcademicArk</p>
              </div>
            </div>

            {/* Right — actions */}
            <div className="flex flex-wrap items-center gap-2">
              {h?.status && <StatusBadge status={h.status} />}

              {h?.plan && (
                <span className="px-3 py-1.5 text-xs font-medium rounded-full border border-purple-500/20 text-purple-400"
                  style={{ background: 'rgba(168,85,247,0.07)' }}>
                  {h.plan} Plan
                </span>
              )}

              <button
                onClick={() => dispatch(triggerCloudinarySnapshot())}
                disabled={trigger.loading}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-white text-xs font-medium rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: trigger.loading ? '#1d4ed8' : '#2563eb' }}
                onMouseEnter={e => e.currentTarget.style.background = '#3b82f6'}
                onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
              >
                {trigger.loading
                  ? <><span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Saving…</>
                  : <><Camera size={13} /> Save Snapshot</>
                }
              </button>

              <button
                onClick={() => { dispatch(fetchCloudinaryHealth()); dispatch(fetchCloudinaryResources()); }}
                disabled={health.loading}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#2a2a2a] text-[#888] text-xs font-medium rounded-xl transition-colors hover:border-[#3a3a3a] hover:text-white disabled:opacity-40"
                style={{ background: '#1a1a1a' }}
              >
                <RefreshCw size={12} className={health.loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          {/* Meta chips row */}
          {(h?.lastUpdated || latest.data?.timestamp || h?._cachedAt) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#1f1f1f]">
              {h?.lastUpdated && (
                <MetaChip icon={CalendarDays} label="Updated" value={h.lastUpdated} />
              )}
              {latest.data?.timestamp && (
                <MetaChip icon={Camera} label="Last snapshot" value={new Date(latest.data.timestamp).toLocaleString()} />
              )}
              {h?._cachedAt && (
                <MetaChip icon={Clock} label="Cached" value={new Date(h._cachedAt).toLocaleString()} />
              )}
            </div>
          )}
        </div>

        {/* ── Storage / Bandwidth / Transformations ── */}
        {health.loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-40" />)}
          </div>
        ) : health.error ? (
          <div
            className="flex items-center gap-3 rounded-2xl p-4 border border-red-500/20 text-red-400 text-sm"
            style={{ background: 'rgba(239,68,68,0.05)' }}
          >
            <AlertTriangle size={16} /> {health.error}
          </div>
        ) : h ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={HardDrive}
              label="Storage Used"
              value={`${h.storage.usedMB} MB`}
              sub={`of ${h.storage.limitGB} GB limit`}
              pct={h.storage.usedPct}
              iconBg="bg-blue-500/10"
              iconColor="text-blue-400"
              glow="rgba(59,130,246,0.4)"
            />
            <StatCard
              icon={Wifi}
              label="Bandwidth · Monthly"
              value={`${h.bandwidth.usedMB} MB`}
              sub={`of ${h.bandwidth.limitGB} GB limit`}
              pct={h.bandwidth.usedPct}
              iconBg="bg-indigo-500/10"
              iconColor="text-indigo-400"
              glow="rgba(99,102,241,0.4)"
            />
            <StatCard
              icon={Zap}
              label="Transformations"
              value={h.transformations.used.toLocaleString()}
              sub={`of ${h.transformations.limit.toLocaleString()} credits / mo`}
              pct={h.transformations.usedPct}
              iconBg="bg-violet-500/10"
              iconColor="text-violet-400"
              glow="rgba(139,92,246,0.4)"
            />
          </div>
        ) : null}

        {/* ── Limits + Resources side by side ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {h?.limits && (
            <Section title="Upload Size Limits" icon={Layers}>
              <div className="grid grid-cols-3 gap-3">
                <LimitTile label="Images / PDFs" val={`${h.limits.imageMaxSizeMB} MB`} icon={Image}    />
                <LimitTile label="Videos"        val={`${h.limits.videoMaxSizeMB} MB`} icon={Video}    />
                <LimitTile label="Raw Files"     val={`${h.limits.rawMaxSizeMB} MB`}   icon={FileText} />
              </div>
            </Section>
          )}

          <Section title="Resources — AcademicArk/" icon={FolderOpen}>
            {resources.loading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
              </div>
            ) : resources.error ? (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle size={13} /> {resources.error}
              </div>
            ) : r ? (
              <div className="grid grid-cols-2 gap-3">
                <ResourceTile label="Total Files"    val={r.total}  icon={Package}  iconBg="bg-blue-500/10"    iconColor="text-blue-400"    borderColor="#1e2a3a" />
                <ResourceTile label="Images & PDFs"  val={r.images} icon={Image}    iconBg="bg-emerald-500/10" iconColor="text-emerald-400" borderColor="#1a2e24" />
                <ResourceTile label="Videos"         val={r.videos} icon={Video}    iconBg="bg-purple-500/10"  iconColor="text-purple-400"  borderColor="#26183a" />
                <ResourceTile label="Raw Files"      val={r.raw}    icon={FileText} iconBg="bg-[#1f1f1f]"      iconColor="text-[#666]"      borderColor="#2a2a2a" />
              </div>
            ) : null}
          </Section>
        </div>

        {/* ── Snapshot History ── */}
        <Section
          title="Snapshot History"
          icon={BarChart3}
          right={
            <div className="flex gap-1.5">
              {[7, 14, 30].map(d => (
                <button
                  key={d}
                  onClick={() => dispatch(setSelectedDays(d))}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background:  selectedDays === d ? '#2563eb' : '#1a1a1a',
                    color:       selectedDays === d ? '#fff'    : '#666',
                    border:      selectedDays === d ? '1px solid #3b82f6' : '1px solid #2a2a2a',
                  }}
                >
                  {d}d
                </button>
              ))}
            </div>
          }
        >
          {snapshots.loading ? (
            <div className="space-y-2">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-11" />)}
            </div>
          ) : snapshots.error ? (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertTriangle size={13} /> {snapshots.error}
            </div>
          ) : !snapshots.data?.length ? (
            <div className="flex flex-col items-center py-12 gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center border border-[#242424]"
                style={{ background: '#1a1a1a' }}
              >
                <Database size={24} className="text-[#444]" strokeWidth={1.5} />
              </div>
              <p className="text-[#555] text-sm">No snapshots recorded yet</p>
              <p className="text-[#333] text-xs">
                Click <span className="text-[#666] font-medium">Save Snapshot</span> to seed the first one
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1f1f1f' }}>
                    {['Timestamp','Storage','Bandwidth','Transforms','Files'].map((h, i) => (
                      <th
                        key={h}
                        className={`pb-3 font-semibold uppercase tracking-wider text-[11px] text-[#444] ${i === 0 ? 'text-left' : 'text-right'}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...snapshots.data].reverse().map((snap, i) => (
                    <tr
                      key={i}
                      className="transition-colors"
                      style={{ borderBottom: '1px solid #1a1a1a' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="py-3.5 text-[#555]">
                        {new Date(snap.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="text-[#ccc]">{snap.storage.usedMB} MB</span>
                        <span className={`ml-2 font-semibold ${snap.storage.usedPct > 80 ? 'text-red-400' : 'text-emerald-500'}`}>
                          {snap.storage.usedPct}%
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="text-[#ccc]">{snap.bandwidth.usedMB} MB</span>
                        <span className={`ml-2 font-semibold ${snap.bandwidth.usedPct > 80 ? 'text-red-400' : 'text-emerald-500'}`}>
                          {snap.bandwidth.usedPct}%
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="text-[#ccc]">{snap.transformations.used}</span>
                        <span className="ml-1.5 text-[#3a3a3a]">/ {snap.transformations.limit.toLocaleString()}</span>
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="text-white font-bold">{snap.resources.total}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

      </div>
    </div>
  );
}
