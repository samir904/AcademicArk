// COMPONENTS/Admin/HomepageAnalyticsDashboard.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHomepageOverview,
  fetchHomepageSectionCTR,
  fetchHomepageTopCards,
  fetchHomepageDropoff,
  fetchHomepageTrend,
  fetchHomepageDevices,
  fetchHomepagePeakTimes,
  fetchHomepageCTABreakdown,
  generateHomepageSnapshot,
  selectHomepageOverview,
  selectHomepageSections,
  selectHomepageTopCards,
  selectHomepageDropoff,
  selectHomepageTrend,
  selectHomepageDevices,
  selectHomepagePeakTimes,
  selectHomepageCTABreakdown,
  selectHomepageSnapshot,
} from "../../REDUX/Slices/homepageAnalyticsSlice";
import {
  TrendingUp, MousePointerClick, Eye, Users,
  Smartphone, Monitor, Tablet, RefreshCw,
  Trophy, ChevronDown, BarChart2, Clock,
  ArrowDown, Layers, Zap,
  Download,
} from "lucide-react";
// ─────────────────────────────────────────────
// 🔧 CSV EXPORT UTILITY
// ─────────────────────────────────────────────

// Convert array of objects → CSV string
const toCSV = (rows, columns) => {
  if (!rows?.length) return "";
  const header = columns.map((c) => `"${c.label}"`).join(",");
  const body   = rows.map((row) =>
    columns.map((c) => {
      const val = c.value(row);
      // ✅ Wrap strings in quotes, leave numbers bare
      return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val ?? "";
    }).join(",")
  );
  return [header, ...body].join("\n");
};

// Trigger browser download
const downloadCSV = (csvString, filename) => {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href     = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// ✅ Master export — all sections in one call
const exportAllAnalytics = (days, { overview, sections, topCards, dropoff, trend, ctaBreakdown, devices }) => {
  const timestamp = new Date().toISOString().split("T")[0];

  // ── 1. Overview sheet
  if (overview) {
    const csv = toCSV([overview], [
      { label: "Total Impressions", value: (r) => r.totalImpressions },
      { label: "Total Clicks",      value: (r) => r.totalClicks      },
      { label: "Overall CTR (%)",   value: (r) => r.overallCTR       },
      { label: "Unique Visitors",   value: (r) => r.uniqueVisitors   },
      { label: "Total Visits",      value: (r) => r.totalVisits      },
    ]);
    downloadCSV(csv, `homepage_overview_${days}d_${timestamp}.csv`);
  }

  // ── 2. Section CTR
  if (sections?.length) {
    const csv = toCSV(sections, [
      { label: "Section",     value: (r) => SECTION_LABELS[r.section] || r.section },
      { label: "Impressions", value: (r) => r.impressions },
      { label: "Clicks",      value: (r) => r.clicks      },
      { label: "CTR (%)",     value: (r) => r.ctr         },
    ]);
    downloadCSV(csv, `homepage_sections_${days}d_${timestamp}.csv`);
  }

  // ── 3. Top Cards
  if (topCards?.length) {
    const csv = toCSV(topCards, [
      { label: "Rank",         value: (r) => r.rank        },
      { label: "Title",        value: (r) => r.title       },
      { label: "Subject",      value: (r) => r.subject     },
      { label: "Category",     value: (r) => r.category    },
      { label: "Section",      value: (r) => SECTION_LABELS[r.topSection] || r.topSection },
      { label: "Clicks",       value: (r) => r.clicks      },
      { label: "Unique Users", value: (r) => r.uniqueUsers },
      { label: "Share (%)",    value: (r) => r.sharePct    },
    ]);
    downloadCSV(csv, `homepage_top_cards_${days}d_${timestamp}.csv`);
  }

  // ── 4. Dropoff Funnel
  if (dropoff?.length) {
    const csv = toCSV(dropoff, [
      { label: "Position",         value: (r) => r.position   },
      { label: "Section",          value: (r) => SECTION_LABELS[r.section] || r.section },
      { label: "Impressions",      value: (r) => r.impressions },
      { label: "Retention (%)",    value: (r) => r.dropoffPct  },
    ]);
    downloadCSV(csv, `homepage_dropoff_${days}d_${timestamp}.csv`);
  }

  // ── 5. Daily Trend
  if (trend?.length) {
    const csv = toCSV(trend, [
      { label: "Date",        value: (r) => r.date        },
      { label: "Impressions", value: (r) => r.impressions },
      { label: "Clicks",      value: (r) => r.clicks      },
      { label: "CTR (%)",     value: (r) => r.ctr         },
      { label: "Visitors",    value: (r) => r.visitors    },
    ]);
    downloadCSV(csv, `homepage_trend_${days}d_${timestamp}.csv`);
  }

  // ── 6. CTA Breakdown (flat)
  if (ctaBreakdown?.flat?.length) {
    const csv = toCSV(ctaBreakdown.flat, [
      { label: "Section",      value: (r) => SECTION_LABELS[r.section] || r.section },
      { label: "Button Label", value: (r) => r.ctaLabel    },
      { label: "Clicks",       value: (r) => r.clicks      },
      { label: "Unique Users", value: (r) => r.uniqueUsers },
    ]);
    downloadCSV(csv, `homepage_cta_${days}d_${timestamp}.csv`);
  }

  // ── 7. Devices
  if (devices?.length) {
    const csv = toCSV(devices, [
      { label: "Device",      value: (r) => r.device     },
      { label: "Count",       value: (r) => r.count      },
      { label: "Share (%)",   value: (r) => r.percentage },
    ]);
    downloadCSV(csv, `homepage_devices_${days}d_${timestamp}.csv`);
  }
};

// ─────────────────────────────────────────────
// 🔧 HELPERS
// ─────────────────────────────────────────────
const DAYS_OPTIONS = [7, 14, 30];

const SECTION_LABELS = {
  continue_where:      "Continue Where",
  study_material_today:"Study Material",
  new_notes_badge:     "New Notes Badge",
  recommended:         "Recommended",
  trending:            "Trending",
  attendance:          "Attendance",
  downloads:           "Downloads",
  leaderboard:         "Leaderboard",
  quick_actions:       "Quick Actions",
};

const CTR_COLOR = (ctr) => {
  if (ctr >= 30) return "text-green-400";
  if (ctr >= 15) return "text-yellow-400";
  return "text-red-400";
};

const CTR_BAR_COLOR = (ctr) => {
  if (ctr >= 30) return "bg-green-500";
  if (ctr >= 15) return "bg-yellow-500";
  return "bg-red-500";
};

// ─────────────────────────────────────────────
// 🧩 SMALL COMPONENTS
// ─────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color = "text-white" }) => (
  <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs text-[#6B7280] uppercase tracking-wider font-medium">
        {label}
      </span>
      <Icon className="w-4 h-4 text-[#4B5563]" />
    </div>
    <p className={`text-3xl font-bold ${color}`}>{value ?? "—"}</p>
    {sub && <p className="text-xs text-[#4B5563] mt-1">{sub}</p>}
  </div>
);

const SectionHeader = ({ icon: Icon, title, color = "text-white" }) => (
  <div className="flex items-center gap-2 mb-5">
    <Icon className={`w-5 h-5 ${color}`} />
    <h3 className="text-base font-semibold text-white">{title}</h3>
  </div>
);

const LoadingRows = ({ rows = 4 }) => (
  <div className="space-y-2 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-9 bg-[#1F1F1F] rounded-lg" />
    ))}
  </div>
);

const EmptyState = ({ text = "No data yet" }) => (
  <div className="flex items-center justify-center py-10">
    <p className="text-[#4B5563] text-sm">{text}</p>
  </div>
);

const DaysSelector = ({ value, onChange }) => (
  <div className="flex items-center gap-1 bg-[#1F1F1F] rounded-lg p-1">
    {DAYS_OPTIONS.map((d) => (
      <button
        key={d}
        onClick={() => onChange(d)}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
          value === d
            ? "bg-[#3F3F3F] text-white"
            : "text-[#6B7280] hover:text-white"
        }`}
      >
        {d}d
      </button>
    ))}
  </div>
);

// ─────────────────────────────────────────────
// 📊 PANEL: Overview KPI Cards
// ─────────────────────────────────────────────
const OverviewPanel = ({ days }) => {
  const { data, loading } = useSelector(selectHomepageOverview);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-[#1F1F1F] rounded-xl animate-pulse" />
        ))
      ) : (
        <>
          <StatCard
            icon={Eye}
            label="Impressions"
            value={data?.totalImpressions?.toLocaleString()}
            sub={`Last ${days} days`}
          />
          <StatCard
            icon={MousePointerClick}
            label="Clicks"
            value={data?.totalClicks?.toLocaleString()}
            sub={`Last ${days} days`}
          />
          <StatCard
            icon={TrendingUp}
            label="Overall CTR"
            value={data?.overallCTR != null ? `${data.overallCTR}%` : "—"}
            color={data?.overallCTR >= 20 ? "text-green-400" : "text-yellow-400"}
            sub="Clicks ÷ Impressions"
          />
          {/* ✅ Show totalVisits — falls back to uniqueVisitors if still 0 */}
          <StatCard
            icon={Users}
            label="Total Visits"
            value={
              data?.totalVisits > 0
                ? data.totalVisits.toLocaleString()
                : data?.uniqueVisitors?.toLocaleString()
            }
            sub={
              data?.totalVisits > 0
                ? `${data.uniqueVisitors} unique user${data.uniqueVisitors !== 1 ? "s" : ""}`
                : `unique visitor${data?.uniqueVisitors !== 1 ? "s" : ""}`
            }
          />
        </>
      )}
    </div>
  );
};

const ExportButton = ({ days }) => {
  const [exporting, setExporting] = useState(false);

  const overview     = useSelector(selectHomepageOverview).data;
  const sections     = useSelector(selectHomepageSections).data;
  const topCards     = useSelector(selectHomepageTopCards).data;
  const dropoff      = useSelector(selectHomepageDropoff).data;
  const trend        = useSelector(selectHomepageTrend).data;
  const ctaBreakdown = useSelector(selectHomepageCTABreakdown).data;
  const devices      = useSelector(selectHomepageDevices).data;

  const hasData = overview || sections?.length || topCards?.length;

  const handleExport = async () => {
    if (!hasData) return;
    setExporting(true);

    // ✅ Small delay so user sees the spinner
    await new Promise((r) => setTimeout(r, 300));

    exportAllAnalytics(days, {
      overview, sections, topCards, dropoff, trend, ctaBreakdown, devices,
    });

    setExporting(false);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!hasData || exporting}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
        border transition-all duration-200 ${
          !hasData || exporting
            ? "bg-[#1F1F1F] border-[#2F2F2F] text-[#4B5563] cursor-not-allowed"
            : "bg-[#1F1F1F] border-[#3F3F3F] text-[#9CA3AF] hover:border-green-500/50 hover:text-green-400"
        }`}
    >
      {exporting ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </>
      )}
    </button>
  );
};
// ─────────────────────────────────────────────
// 📊 PANEL: Section CTR Breakdown
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// 📊 PANEL: Section CTR Breakdown — IMPROVED
// ─────────────────────────────────────────────
const SectionCTRPanel = () => {
  const { data, loading } = useSelector(selectHomepageSections);
  const [sortBy, setSortBy] = useState("ctr"); // "ctr" | "impressions" | "clicks"

  // ✅ Sort by selected dimension
  const sorted = [...(data || [])].sort((a, b) => b[sortBy] - a[sortBy]);

  const maxImpressions = Math.max(...sorted.map((s) => s.impressions), 1);
  const maxClicks      = Math.max(...sorted.map((s) => s.clicks), 1);
  const maxCTR         = Math.max(...sorted.map((s) => s.ctr), 1);

  // ✅ Aggregates for summary row
  const totalImpressions = sorted.reduce((s, r) => s + r.impressions, 0);
  const totalClicks      = sorted.reduce((s, r) => s + r.clicks, 0);
  const avgCTR           = totalImpressions > 0
    ? Math.round((totalClicks / totalImpressions) * 100 * 100) / 100
    : 0;

  const bestSection  = sorted[0];
  const worstSection = [...sorted].sort((a, b) => a.ctr - b.ctr)[0];

  return (
    <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-6">

      {/* ── Header + sort toggle */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-semibold text-white">Section CTR Breakdown</h3>
        </div>

        {/* ✅ Sort toggle */}
        {data?.length > 0 && (
          <div className="flex items-center gap-1 bg-[#1F1F1F] rounded-lg p-1">
            {[
              { key: "ctr",         label: "CTR"  },
              { key: "impressions", label: "Imp"  },
              { key: "clicks",      label: "Clicks"},
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  sortBy === opt.key
                    ? "bg-[#3F3F3F] text-white"
                    : "text-[#6B7280] hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <LoadingRows rows={7} />

      ) : !data?.length ? (
        <EmptyState />

      ) : (
        <div className="space-y-5">

          {/* ✅ Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-xl p-3 text-center">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">
                Avg CTR
              </p>
              <p className={`text-xl font-bold ${CTR_COLOR(avgCTR)}`}>
                {avgCTR}%
              </p>
              <p className="text-[10px] text-[#4B5563] mt-0.5">across all sections</p>
            </div>
            <div className="bg-[#141414] border border-green-500/10 rounded-xl p-3 text-center">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">
                Best Section
              </p>
              <p className="text-sm font-bold text-green-400 truncate capitalize">
                {SECTION_LABELS[bestSection?.section] || bestSection?.section}
              </p>
              <p className="text-[10px] text-green-400/60 mt-0.5">{bestSection?.ctr}% CTR</p>
            </div>
            <div className="bg-[#141414] border border-red-500/10 rounded-xl p-3 text-center">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">
                Needs Work
              </p>
              <p className="text-sm font-bold text-red-400 truncate capitalize">
                {SECTION_LABELS[worstSection?.section] || worstSection?.section}
              </p>
              <p className="text-[10px] text-red-400/60 mt-0.5">{worstSection?.ctr}% CTR</p>
            </div>
          </div>

          {/* ✅ Section rows */}
          <div className="space-y-4">
            {sorted.map((row, i) => {
              const isAboveAvg = row.ctr >= avgCTR;

              return (
                <div key={row.section}>

                  {/* ── Label row */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {/* ✅ Rank badge */}
                      <span className="text-[10px] text-[#4B5563] font-mono w-4">
                        #{i + 1}
                      </span>
                      <span className="text-sm text-[#D1D5DB] font-medium">
                        {SECTION_LABELS[row.section] || row.section}
                      </span>
                      {/* ✅ Above/below avg badge */}
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5
                        rounded-full ${
                          isAboveAvg
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}>
                        {isAboveAvg ? "↑ above avg" : "↓ below avg"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-[#4B5563]">
                        {row.impressions}i
                      </span>
                      <span className="text-[#6B7280]">
                        {row.clicks}c
                      </span>
                      <span className={`font-bold w-12 text-right ${CTR_COLOR(row.ctr)}`}>
                        {row.ctr}%
                      </span>
                    </div>
                  </div>

                  {/* ✅ Separate impression + click bars (clearer than overlapping) */}
                  <div className="space-y-1">

                    {/* Impressions bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-[#3F3F3F] w-14 text-right
                        flex-shrink-0">
                        imp
                      </span>
                      <div className="flex-1 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3F3F3F] rounded-full transition-all duration-500"
                          style={{ width: `${(row.impressions / maxImpressions) * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-[#4B5563] w-4 text-right flex-shrink-0">
                        {row.impressions}
                      </span>
                    </div>

                    {/* Clicks bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-[#3F3F3F] w-14 text-right
                        flex-shrink-0">
                        clicks
                      </span>
                      <div className="flex-1 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500
                            ${CTR_BAR_COLOR(row.ctr)}`}
                          style={{
                            width:   `${(row.clicks / maxImpressions) * 100}%`,
                            opacity: 0.85,
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-[#4B5563] w-4 text-right flex-shrink-0">
                        {row.clicks}
                      </span>
                    </div>

                    {/* ✅ CTR bar — relative to best CTR */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-[#3F3F3F] w-14 text-right
                        flex-shrink-0">
                        ctr
                      </span>
                      <div className="flex-1 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden
                        relative">
                        {/* Avg CTR line */}
                        <div
                          className="absolute top-0 h-full w-px bg-white/20 z-10"
                          style={{ left: `${(avgCTR / maxCTR) * 100}%` }}
                        />
                        <div
                          className={`h-full rounded-full transition-all duration-500
                            ${CTR_BAR_COLOR(row.ctr)}`}
                          style={{ width: `${(row.ctr / maxCTR) * 100}%`, opacity: 0.9 }}
                        />
                      </div>
                      <span className={`text-[9px] w-4 text-right flex-shrink-0
                        font-medium ${CTR_COLOR(row.ctr)}`}>
                        {row.ctr}%
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* ✅ Totals footer */}
          <div className="flex items-center justify-between pt-3
            border-t border-[#1F1F1F] text-xs text-[#6B7280]">
            <span>{sorted.length} sections tracked</span>
            <span>
              {totalImpressions} imp · {totalClicks} clicks ·{" "}
              <span className={`font-semibold ${CTR_COLOR(avgCTR)}`}>
                {avgCTR}% avg CTR
              </span>
            </span>
          </div>

        </div>
      )}
    </div>
  );
};


// ─────────────────────────────────────────────
// 🔧 HELPERS
// ─────────────────────────────────────────────

// ✅ Color by retention health — not arbitrary rainbow
const retentionColor = (pct) => {
  if (pct >= 70) return { bar: "#22C55E", text: "text-green-400",  bg: "bg-green-500/10"  };
  if (pct >= 45) return { bar: "#EAB308", text: "text-yellow-400", bg: "bg-yellow-500/10" };
  return            { bar: "#EF4444", text: "text-red-400",    bg: "bg-red-500/10"    };
};

// ─────────────────────────────────────────────
// 📊 PANEL: Scroll Dropoff Funnel — IMPROVED
// ─────────────────────────────────────────────
const DropoffPanel = () => {
  const { data, loading } = useSelector(selectHomepageDropoff);

  // ✅ Compute per-row delta (users lost between sections)
  const enriched = (data || []).map((row, i) => {
    const prev      = i === 0 ? null : data[i - 1];
    const usersLost = prev ? prev.impressions - row.impressions : 0;
    const deltaPct  = prev
      ? Math.round(((prev.impressions - row.impressions) / prev.impressions) * 100)
      : 0;
    return { ...row, usersLost, deltaPct };
  });

  // ✅ Overall retention = last section impressions / first section impressions
  const first        = enriched[0]?.impressions || 0;
  const last         = enriched[enriched.length - 1]?.impressions || 0;
  const totalRetain  = first > 0 ? Math.round((last / first) * 100) : 0;
  const totalDropped = first - last;

  // ✅ Biggest single drop
  const biggestDrop = [...enriched].sort((a, b) => b.deltaPct - a.deltaPct)[1]; // skip position 1

  return (
    <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-6">
      <SectionHeader icon={ArrowDown} title="Scroll Dropoff Funnel" color="text-purple-400" />

      {loading ? (
        <LoadingRows rows={7} />

      ) : !data?.length ? (
        <EmptyState />

      ) : (
        <div className="space-y-5">

          {/* ✅ Summary row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-xl p-3 text-center">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">
                Full Scroll Rate
              </p>
              <p className={`text-xl font-bold ${retentionColor(totalRetain).text}`}>
                {totalRetain}%
              </p>
              <p className="text-[10px] text-[#4B5563] mt-0.5">
                top → bottom
              </p>
            </div>
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-xl p-3 text-center">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">
                Users Lost
              </p>
              <p className="text-xl font-bold text-red-400">{totalDropped}</p>
              <p className="text-[10px] text-[#4B5563] mt-0.5">
                didn't reach bottom
              </p>
            </div>
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-xl p-3 text-center">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">
                Biggest Drop
              </p>
              <p className="text-xl font-bold text-yellow-400">
                {biggestDrop ? `${biggestDrop.deltaPct}%` : "—"}
              </p>
              <p className="text-[10px] text-[#4B5563] mt-0.5 capitalize truncate">
                {biggestDrop
                  ? `at ${SECTION_LABELS[biggestDrop.section] || biggestDrop.section}`
                  : ""}
              </p>
            </div>
          </div>

          {/* ✅ Funnel rows */}
          <div className="space-y-2.5">
            {enriched.map((row) => {
              const col = retentionColor(row.dropoffPct);

              return (
                <div key={row.section}>
                  {/* ✅ Delta arrow between rows */}
                  {row.usersLost > 0 && (
                    <div className="flex items-center gap-2 py-0.5 pl-7">
                      <div className="w-px h-3 bg-[#2F2F2F] ml-1.5" />
                      <span className="text-[10px] text-red-400/70">
                        ▼ {row.usersLost} user{row.usersLost !== 1 ? "s" : ""} dropped
                        ({row.deltaPct}%)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {/* Position badge */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center
                      flex-shrink-0 text-[10px] font-bold ${col.bg} ${col.text}`}>
                      {row.position}
                    </div>

                    {/* Funnel bar */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#D1D5DB] font-medium">
                          {SECTION_LABELS[row.section] || row.section}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#6B7280]">
                            {row.impressions} users
                          </span>
                          <span className={`text-[11px] font-semibold ${col.text}`}>
                            {row.dropoffPct}%
                          </span>
                        </div>
                      </div>

                      {/* ✅ Two-layer bar: full width background + actual retention */}
                      <div className="h-4 bg-[#1A1A1A] rounded-md overflow-hidden relative">
                        {/* Gray = potential (100%) */}
                        <div className="absolute inset-0 bg-[#1F1F1F] rounded-md" />
                        {/* Colored = actual retention */}
                        <div
                          className="absolute top-0 left-0 h-full rounded-md
                            transition-all duration-700"
                          style={{
                            width:      `${row.dropoffPct}%`,
                            background: col.bar,
                            opacity:    0.75,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ✅ Legend */}
          <div className="flex items-center gap-4 pt-1 flex-wrap">
            {[
              { color: "bg-green-500",  label: "Good (≥70%)"   },
              { color: "bg-yellow-500", label: "Fair (45–69%)" },
              { color: "bg-red-500",    label: "Weak (<45%)"   },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${l.color} opacity-75`} />
                <span className="text-[10px] text-[#4B5563]">{l.label}</span>
              </div>
            ))}
            <span className="text-[10px] text-[#4B5563] ml-auto">
              Position 1 = 100% anchor
            </span>
          </div>

        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// 📊 PANEL: Top Clicked Cards
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// 🔧 Rank medal helper
// ─────────────────────────────────────────────
const RANK_STYLE = {
  1: { label: "🥇", color: "text-yellow-400",  border: "border-yellow-400/20" },
  2: { label: "🥈", color: "text-slate-300",   border: "border-slate-400/20"  },
  3: { label: "🥉", color: "text-orange-400",  border: "border-orange-400/20" },
};

const CATEGORY_COLORS = {
  "Notes":              "bg-blue-500/10 text-blue-400",
  "Handwritten Notes":  "bg-purple-500/10 text-purple-400",
  "Important Questions":"bg-red-500/10 text-red-400",
  "Previous Year Papers":"bg-green-500/10 text-green-400",
};

// ─────────────────────────────────────────────
// 📊 PANEL: Top Clicked Cards — IMPROVED
// ─────────────────────────────────────────────
const TopCardsPanel = () => {
  const { data, loading } = useSelector(selectHomepageTopCards);

  // ✅ Max clicks for share bar scale
  const maxClicks    = Math.max(...(data?.map((c) => c.clicks) || [1]), 1);
  const totalClicks  = data?.reduce((s, c) => s + c.clicks, 0) || 0;

  return (
    <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="text-base font-semibold text-white">Top Clicked Notes</h3>
        </div>
        {totalClicks > 0 && (
          <span className="text-xs text-[#6B7280]">
            {totalClicks} total clicks
          </span>
        )}
      </div>

      {loading ? (
        <LoadingRows rows={5} />

      ) : !data?.length ? (
        <EmptyState text="No card clicks yet" />

      ) : (
        <div className="space-y-3">
          {data.map((card) => {
            const rankStyle = RANK_STYLE[card.rank] || { label: `#${card.rank}`, color: "text-[#6B7280]", border: "border-[#1F1F1F]" };
            const catColor  = CATEGORY_COLORS[card.category] || "bg-[#1F1F1F] text-[#9CA3AF]";
            const sharePct  = card.sharePct ?? Math.round((card.clicks / totalClicks) * 100);

            return (
              <div
                key={card._id}
                className={`bg-[#141414] border rounded-xl px-4 py-3.5
                  transition-colors hover:bg-[#1A1A1A] ${rankStyle.border}`}
              >
                {/* ── Row 1: rank + title + clicks */}
                <div className="flex items-start gap-3">

                  {/* Rank medal */}
                  <span className={`text-base w-6 flex-shrink-0 mt-0.5 ${rankStyle.color}`}>
                    {rankStyle.label}
                  </span>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-semibold leading-snug
                      capitalize truncate">
                      {card.title}
                    </p>

                    {/* ── Row 2: subject + category badge + section */}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[11px] text-[#6B7280] capitalize truncate">
                        {card.subject}
                      </span>

                      {/* ✅ Category badge */}
                      <span className={`text-[10px] font-medium px-2 py-0.5
                        rounded-full flex-shrink-0 ${catColor}`}>
                        {card.category}
                      </span>

                      {/* ✅ Section badge */}
                      <span className="text-[10px] text-[#4B5563] bg-[#1F1F1F]
                        px-2 py-0.5 rounded-full flex-shrink-0">
                        {SECTION_LABELS[card.topSection] || card.topSection}
                      </span>

                      {/* ✅ Multiple sections indicator */}
                      {card.sections?.length > 1 && (
                        <span className="text-[10px] text-[#4B5563]">
                          +{card.sections.length - 1} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Clicks count */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-base font-bold text-white">{card.clicks}</p>
                    <p className="text-[10px] text-[#4B5563]">
                      {card.uniqueUsers ?? 1} user{(card.uniqueUsers ?? 1) !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* ── Row 3: share bar + extra meta */}
                <div className="mt-3 flex items-center gap-3">
                  {/* ✅ Click share bar */}
                  <div className="flex-1 h-1.5 bg-[#1F1F1F] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500/70 rounded-full transition-all duration-500"
                      style={{ width: `${(card.clicks / maxClicks) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#4B5563] flex-shrink-0">
                    {sharePct}% of clicks
                  </span>

                  {/* ✅ Avg position (if available) */}
                  {card.avgPosition != null && (
                    <span className="text-[10px] text-[#4B5563] flex-shrink-0">
                      avg pos {card.avgPosition}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


// ─────────────────────────────────────────────
// 📊 PANEL: CTA Breakdown
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// 🔧 HELPER — sanitize internal ctaLabels
// ─────────────────────────────────────────────
const CLEAN_LABEL = {
  "Details header link":      "Details →",
  "View all header link":     "View All →",
  "View full leaderboard":    "View Full Leaderboard",
  "View All Downloads":       "View All Downloads",
  "Continue Reading":         "Continue Reading",
  "Start Managing Attendance":"Start Managing Attendance",
  "View Details":             "View Details",
};
const cleanLabel = (raw) => CLEAN_LABEL[raw] || raw;

// ─────────────────────────────────────────────
// 📊 PANEL: CTA Breakdown — IMPROVED
// ─────────────────────────────────────────────
const CTABreakdownPanel = () => {
  const { data, loading }    = useSelector(selectHomepageCTABreakdown);
  const [view, setView]      = useState("flat");   // "flat" | "grouped"

  const flat    = data?.flat    || [];
  const grouped = data?.grouped || {};

  // ✅ Max clicks for share bar scale
  const maxClicks = Math.max(...flat.map((r) => r.clicks), 1);

  // ✅ Total clicks for % share
  const totalClicks = flat.reduce((s, r) => s + r.clicks, 0);

  return (
    <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-6">

      {/* ── Header + toggle */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <MousePointerClick className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-semibold text-white">Button / CTA Clicks</h3>
        </div>

        {/* ✅ View toggle */}
        {flat.length > 0 && (
          <div className="flex items-center gap-1 bg-[#1F1F1F] rounded-lg p-1">
            {["flat", "grouped"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  view === v
                    ? "bg-[#3F3F3F] text-white"
                    : "text-[#6B7280] hover:text-white"
                }`}
              >
                {v === "flat" ? "Ranked" : "By Section"}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <LoadingRows rows={5} />

      ) : !flat.length ? (
        <EmptyState text="No CTA clicks tracked yet" />

      ) : view === "flat" ? (
        // ── FLAT VIEW — ranked table with share bar
        <div className="space-y-1">
          {/* ── Column headers */}
          <div className="flex items-center gap-3 pb-2 border-b border-[#1F1F1F]
            text-[10px] text-[#6B7280] uppercase tracking-wider">
            <span className="w-5 flex-shrink-0">#</span>
            <span className="flex-1">Button</span>
            <span className="w-28 hidden md:block">Section</span>
            <span className="w-24">Share</span>
            <span className="w-12 text-right">Clicks</span>
          </div>

          {flat.map((row, i) => {
            const sharePct = Math.round((row.clicks / totalClicks) * 100);
            return (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 hover:bg-[#141414]
                  rounded-lg px-1 transition-colors"
              >
                {/* Rank */}
                <span className="text-xs text-[#4B5563] w-5 flex-shrink-0 font-mono">
                  {i + 1}
                </span>

                {/* Label + section (mobile stacked) */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {cleanLabel(row.ctaLabel)}
                  </p>
                  <p className="text-[11px] text-[#6B7280] md:hidden capitalize mt-0.5">
                    {SECTION_LABELS[row.section] || row.section}
                  </p>
                </div>

                {/* Section — desktop only */}
                <span className="text-xs text-[#9CA3AF] w-28 hidden md:block capitalize truncate">
                  {SECTION_LABELS[row.section] || row.section}
                </span>

                {/* ✅ Share bar */}
                <div className="w-24 flex items-center gap-1.5">
                  <div className="flex-1 h-1.5 bg-[#1F1F1F] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${(row.clicks / maxClicks) * 100}%`, opacity: 0.85 }}
                    />
                  </div>
                  <span className="text-[10px] text-[#6B7280] w-7 text-right flex-shrink-0">
                    {sharePct}%
                  </span>
                </div>

                {/* Clicks */}
                <span className="text-sm font-bold text-white w-12 text-right flex-shrink-0">
                  {row.clicks}
                </span>
              </div>
            );
          })}

          {/* ✅ Total row */}
          <div className="flex items-center justify-between pt-3 border-t border-[#1F1F1F]
            text-xs text-[#6B7280]">
            <span>{flat.length} unique CTAs</span>
            <span className="font-semibold text-white">{totalClicks} total clicks</span>
          </div>
        </div>

      ) : (
        // ── GROUPED VIEW — per section accordion
        <div className="space-y-3">
          {Object.entries(grouped).map(([section, ctaList]) => {
            const sectionTotal = ctaList.reduce((s, r) => s + r.clicks, 0);
            return (
              <div
                key={section}
                className="bg-[#141414] border border-[#1F1F1F] rounded-xl overflow-hidden"
              >
                {/* Section header */}
                <div className="flex items-center justify-between px-4 py-3
                  border-b border-[#1F1F1F]">
                  <span className="text-sm font-semibold text-white capitalize">
                    {SECTION_LABELS[section] || section}
                  </span>
                  <span className="text-xs text-[#6B7280]">
                    {sectionTotal} click{sectionTotal !== 1 ? "s" : ""}
                    · {ctaList.length} CTA{ctaList.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* CTA rows inside section */}
                <div className="divide-y divide-[#1A1A1A]">
                  {ctaList.map((cta, j) => {
                    const pct = Math.round((cta.clicks / sectionTotal) * 100);
                    return (
                      <div
                        key={j}
                        className="flex items-center gap-3 px-4 py-2.5"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#D1D5DB] truncate">
                            {cleanLabel(cta.ctaLabel)}
                          </p>
                          {/* ✅ Mini share bar within section */}
                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-[#1F1F1F] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500/70 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-[#4B5563] w-6 text-right">
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-white">{cta.clicks}</p>
                          <p className="text-[10px] text-[#4B5563]">
                            {cta.uniqueUsers} user{cta.uniqueUsers !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


// ─────────────────────────────────────────────
// 📊 PANEL: Daily CTR Trend
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// 📊 PANEL: Daily CTR Trend — FIXED
// ─────────────────────────────────────────────
const TrendPanel = () => {
  const { data, loading } = useSelector(selectHomepageTrend);

  // ✅ Only use non-zero rows for scale
  const validData = data?.filter((d) => d.impressions > 0) || [];
  const maxImpressions = Math.max(...validData.map((d) => d.impressions), 1);
  const maxClicks      = Math.max(...validData.map((d) => d.clicks), 1);

  return (
    <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-6">
      <SectionHeader icon={TrendingUp} title="Daily CTR Trend" color="text-cyan-400" />

      {loading ? (
        <div className="h-40 bg-[#1F1F1F] rounded-lg animate-pulse" />

      ) : !validData.length ? (
        <EmptyState text="Not enough data for trend yet" />

      ) : validData.length < 3 ? (
        // ✅ Too few points for a bar chart — show stat cards instead
        <div className="space-y-3">
          {validData.map((row) => (
            <div
              key={row.date}
              className="bg-[#141414] border border-[#1F1F1F] rounded-xl p-4"
            >
              {/* ── Date */}
              <p className="text-xs text-[#6B7280] mb-3 font-medium">{row.date}</p>

              {/* ── 4 stat pills */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#1F1F1F] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">
                    Impressions
                  </p>
                  <p className="text-xl font-bold text-white">{row.impressions}</p>
                </div>
                <div className="bg-[#1F1F1F] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">
                    Clicks
                  </p>
                  <p className="text-xl font-bold text-white">{row.clicks}</p>
                </div>
                <div className="bg-[#1F1F1F] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">
                    CTR
                  </p>
                  <p className={`text-xl font-bold ${CTR_COLOR(row.ctr)}`}>
                    {Number(row.ctr).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-[#1F1F1F] rounded-lg p-3 text-center">
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">
                    Visitors
                  </p>
                  <p className="text-xl font-bold text-white">{row.visitors ?? "—"}</p>
                </div>
              </div>

              {/* ── Mini impression vs click visual */}
              <div className="mt-4 space-y-1.5">
               {/* ✅ IMPRESSIONS — was missing the inner fill div */}
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-[#6B7280] w-20 flex-shrink-0">
      Impressions
    </span>
    <div className="flex-1 h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
      <div
        className="h-full bg-[#9CA3AF] rounded-full"
        style={{ width: "100%" }} 
      />
    </div>
    <span className="text-[10px] text-[#9CA3AF] w-6 text-right">
      {row.impressions}
    </span>
  </div>
              {/* ✅ CLICKS — relative to impressions */}
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-[#6B7280] w-20 flex-shrink-0">
      Clicks
    </span>
    <div className="flex-1 h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${CTR_BAR_COLOR(row.ctr)}`}
        style={{
          width:   `${(row.clicks / row.impressions) * 100}%`,
          opacity: 0.85,
        }}
      />
    </div>
    <span className="text-[10px] text-[#9CA3AF] w-6 text-right">
      {row.clicks}
    </span>
  </div>
              </div>
            </div>
          ))}

          <p className="text-[10px] text-[#4B5563] text-center pt-1">
            Bar chart unlocks after 3+ days of data
          </p>
        </div>

      ) : (
        // ✅ Normal bar chart — 3+ days
        <div className="space-y-2">
          {validData.map((row) => (
            <div key={row.date} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">{row.date}</span>
                <span className="text-xs text-[#9CA3AF]">
                  {row.impressions}i · {row.clicks}c ·{" "}
                  <span className={CTR_COLOR(row.ctr)}>
                    {Number(row.ctr).toFixed(1)}%
                  </span>
                </span>
              </div>
              {/* Impression bar */}
              <div className="h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2F2F2F] rounded-full"
                  style={{ width: `${(row.impressions / maxImpressions) * 100}%` }}
                />
              </div>
              {/* Click bar */}
              <div className="h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${CTR_BAR_COLOR(row.ctr)}`}
                  style={{
                    width:   `${(row.clicks / maxImpressions) * 100}%`,
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          ))}
          <p className="text-[10px] text-[#4B5563] pt-1">
            ■ Gray = impressions &nbsp; ■ Colored = clicks
          </p>
        </div>
      )}
    </div>
  );
};




// ─────────────────────────────────────────────
// 📊 PANEL: Devices
// ─────────────────────────────────────────────
const DevicesPanel = () => {
  const { data, loading } = useSelector(selectHomepageDevices);

  const ICONS = {
    MOBILE:  { icon: Smartphone, color: "text-blue-400",  bg: "bg-blue-500/20" },
    DESKTOP: { icon: Monitor,    color: "text-green-400", bg: "bg-green-500/20" },
    TABLET:  { icon: Tablet,     color: "text-purple-400",bg: "bg-purple-500/20" },
  };

  return (
    <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-6">
      <SectionHeader icon={Monitor} title="Device Breakdown" color="text-green-400" />
      {loading ? (
        <LoadingRows rows={3} />
      ) : !data?.length ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {data.map((d) => {
            const cfg  = ICONS[d.device] || ICONS.DESKTOP;
            const Icon = cfg.icon;
            return (
              <div key={d.device} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white font-medium capitalize">
                      {d.device.toLowerCase()}
                    </span>
                    <span className="text-xs text-[#9CA3AF]">
                      {d.count} events · {d.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cfg.color.replace("text-", "bg-")}`}
                      style={{ width: `${d.percentage}%`, opacity: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// 📊 PANEL: Peak Times
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// 🔧 HELPERS
// ─────────────────────────────────────────────
const SLOT_CONFIG = {
  morning:   { label: "Morning",   time: "6–12 PM",  color: "text-yellow-400",  bg: "bg-yellow-500/10",  bar: "#EAB308" },
  afternoon: { label: "Afternoon", time: "12–5 PM",  color: "text-orange-400",  bg: "bg-orange-500/10",  bar: "#F97316" },
  evening:   { label: "Evening",   time: "5–9 PM",   color: "text-purple-400",  bg: "bg-purple-500/10",  bar: "#A855F7" },
  night:     { label: "Night",     time: "9 PM–6 AM", color: "text-blue-400",   bg: "bg-blue-500/10",    bar: "#3B82F6" },
};

// ─────────────────────────────────────────────
// 📊 PANEL: Peak Times — IMPROVED
// ─────────────────────────────────────────────
const PeakTimesPanel = () => {
  const { data, loading } = useSelector(selectHomepagePeakTimes);

  const hourly     = data?.hourly     || [];
  const weekdays   = data?.weekdays   || [];
  const slotTotals = data?.slotTotals || {};
  const peakHour   = data?.peakHour;
  const peakSlot   = data?.peakSlot;

  const maxH = Math.max(...hourly.map((h) => h.impressions), 1);
  const maxW = Math.max(...weekdays.map((w) => w.impressions), 1);
  const maxSlot = Math.max(...Object.values(slotTotals), 1);

  return (
    <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-6">
      <SectionHeader icon={Clock} title="Peak Activity Times" color="text-orange-400" />

      {loading ? (
        <div className="h-48 bg-[#1F1F1F] rounded-lg animate-pulse" />
      ) : !data ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">

          {/* ── Insight pill */}
          {data.insight && (
            <div className="flex items-start gap-2.5 bg-[#1A1A1A] border border-[#2F2F2F]
              rounded-xl px-4 py-3">
              <span className="text-base flex-shrink-0">💡</span>
              <p className="text-sm text-[#D1D5DB] leading-relaxed">{data.insight}</p>
            </div>
          )}

          {/* ── Slot totals — 4 cards */}
          <div>
            <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-3">
              Activity by Time Slot
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(SLOT_CONFIG).map(([slot, cfg]) => {
                const count    = slotTotals[slot] ?? 0;
                const isPeak   = slot === peakSlot;
                const slotPct  = Math.round((count / maxSlot) * 100);

                return (
                  <div
                    key={slot}
                    className={`rounded-xl p-3 border transition-all ${
                      isPeak
                        ? `${cfg.bg} border-current ${cfg.color}`
                        : "bg-[#141414] border-[#1F1F1F]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-semibold ${isPeak ? cfg.color : "text-[#9CA3AF]"}`}>
                        {cfg.label}
                      </span>
                      {isPeak && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full
                          ${cfg.bg} ${cfg.color}`}>
                          PEAK
                        </span>
                      )}
                    </div>
                    <p className={`text-xl font-bold ${isPeak ? cfg.color : "text-white"}`}>
                      {count}
                    </p>
                    <p className="text-[10px] text-[#4B5563] mb-2">{cfg.time}</p>

                    {/* ✅ Slot share bar */}
                    <div className="h-1 bg-[#1F1F1F] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width:      `${count > 0 ? Math.max(slotPct, 4) : 0}%`,
                          background: count > 0 ? cfg.bar : "transparent",
                          opacity:    0.8,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Hourly chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[#6B7280] uppercase tracking-wider">
                By Hour (IST)
              </p>
              {/* ✅ Peak hour badge */}
              {peakHour && (
                <div className="flex items-center gap-1.5 bg-orange-500/10
                  border border-orange-500/20 rounded-full px-3 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                  <span className="text-[11px] text-orange-400 font-medium">
                    Peak: {peakHour.label} · {peakHour.impressions} impressions
                  </span>
                </div>
              )}
            </div>

            {/* ✅ Bars */}
            <div className="flex items-end gap-px h-20 mb-1">
              {hourly.map((h) => {
                const isPeakBar = h.hour === peakHour?.hour;
                const heightPct = h.impressions > 0
                  ? Math.max((h.impressions / maxH) * 100, 8)
                  : 2;

                return (
                  <div
                    key={h.hour}
                    className="flex-1 rounded-sm transition-all duration-300
                      cursor-default group relative"
                    style={{
                      height:     `${heightPct}%`,
                      background: isPeakBar
                        ? "#F97316"
                        : h.impressions > 0 ? "#78350F" : "#1F1F1F",
                      opacity:    h.impressions > 0
                        ? isPeakBar ? 1 : 0.6
                        : 0.5,
                    }}
                  >
                    {/* ✅ Tooltip on hover */}
                    {h.impressions > 0 && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
                        bg-[#2F2F2F] border border-[#3F3F3F] rounded px-2 py-1
                        whitespace-nowrap text-[10px] text-white
                        opacity-0 group-hover:opacity-100 pointer-events-none
                        transition-opacity z-10">
                        {h.label}: {h.impressions}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-[9px] text-[#4B5563]">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
          </div>

          {/* ── Weekday chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[#6B7280] uppercase tracking-wider">
                By Weekday
              </p>
              {/* ✅ Peak weekday badge */}
              {data.peakWeekday && (
                <div className="flex items-center gap-1.5 bg-orange-500/10
                  border border-orange-500/20 rounded-full px-3 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                  <span className="text-[11px] text-orange-400 font-medium">
                    Peak: {data.peakWeekday.label} · {data.peakWeekday.impressions}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-end gap-2 h-16">
              {weekdays.map((w) => {
                const isPeakDay = w.day === data.peakWeekday?.day;
                const heightPx  = w.impressions > 0
                  ? Math.max((w.impressions / maxW) * 48, 6)
                  : 2;

                return (
                  <div key={w.day} className="flex-1 flex flex-col items-center gap-1.5
                    group relative cursor-default">

                    {/* ✅ Tooltip */}
                    {w.impressions > 0 && (
                      <div className="absolute bottom-full mb-1 bg-[#2F2F2F]
                        border border-[#3F3F3F] rounded px-2 py-1
                        whitespace-nowrap text-[10px] text-white
                        opacity-0 group-hover:opacity-100 pointer-events-none
                        transition-opacity z-10">
                        {w.label}: {w.impressions}
                      </div>
                    )}

                    <div
                      className="w-full rounded-md transition-all duration-300"
                      style={{
                        height:     `${heightPx}px`,
                        background: isPeakDay
                          ? "#F97316"
                          : w.impressions > 0 ? "#78350F" : "#1F1F1F",
                        opacity: w.impressions > 0
                          ? isPeakDay ? 1 : 0.6
                          : 0.5,
                      }}
                    />
                    <span className={`text-[10px] font-medium transition-colors ${
                      isPeakDay ? "text-orange-400" : "text-[#4B5563]"
                    }`}>
                      {w.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};


// ─────────────────────────────────────────────
// 🏠 MAIN DASHBOARD
// ─────────────────────────────────────────────
export default function HomepageAnalyticsDashboard() {
  const dispatch  = useDispatch();
  const snapshot  = useSelector(selectHomepageSnapshot);

  const [days, setDays] = useState(7);

  // ── Fetch everything on mount + when days changes
  useEffect(() => {
    dispatch(fetchHomepageOverview(days));
    dispatch(fetchHomepageSectionCTR(days));
    dispatch(fetchHomepageTopCards({ days, limit: 10 }));
    dispatch(fetchHomepageDropoff(days));
    dispatch(fetchHomepageTrend(days));
    dispatch(fetchHomepageDevices(days));
    dispatch(fetchHomepageCTABreakdown(days));
  }, [dispatch, days]);

  // ── Peak times uses 14d window — fetch once
  useEffect(() => {
    dispatch(fetchHomepagePeakTimes(14));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchHomepageOverview(days));
    dispatch(fetchHomepageSectionCTR(days));
    dispatch(fetchHomepageTopCards({ days, limit: 10 }));
    dispatch(fetchHomepageDropoff(days));
    dispatch(fetchHomepageTrend(days));
    dispatch(fetchHomepageDevices(days));
    dispatch(fetchHomepageCTABreakdown(days));
    dispatch(fetchHomepagePeakTimes(14));
  };

  const handleSnapshot = async () => {
    await dispatch(generateHomepageSnapshot());
    handleRefresh();
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white p-6 space-y-6">

      {/* ── Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Homepage Analytics</h2>
          <p className="text-xs text-[#4B5563] mt-0.5">
      Last {days} days · {snapshot ? "from snapshots" : "live data"}
    </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* ── Days filter */}
          <DaysSelector value={days} onChange={setDays} />
<ExportButton days={days} />   {/* ✅ ADD THIS */}
          {/* ── Refresh */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-[#1F1F1F] hover:bg-[#2F2F2F]
              border border-[#2F2F2F] text-[#9CA3AF] hover:text-white
              px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>

          {/* ── Generate Snapshot */}
          <button
            onClick={handleSnapshot}
            disabled={snapshot.generating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500
              disabled:opacity-50 text-white px-3 py-1.5 rounded-lg
              text-xs font-medium transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            {snapshot.generating ? "Generating…" : "Force Snapshot"}
          </button>
        </div>
      </div>

      {/* ── Row 1: KPI cards */}
      <OverviewPanel days={days} />

      {/* ── Row 2: Section CTR + Dropoff Funnel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCTRPanel />
        <DropoffPanel />
      </div>

      {/* ── Row 3: Top Cards + CTA Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopCardsPanel />
        <CTABreakdownPanel />
      </div>

      {/* ── Row 4: Trend + Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrendPanel />
        <DevicesPanel />
      </div>

      {/* ── Row 5: Peak Times — full width */}
      <PeakTimesPanel />

      {/* ── Snapshot meta */}
      {snapshot.lastRun && (
        <p className="text-xs text-[#4B5563] text-right">
          Last snapshot: {new Date(snapshot.lastRun).toLocaleString()}
        </p>
      )}
    </div>
  );
}
