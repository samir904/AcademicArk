// src/COMPONENTS/admin/AdminPaywallAnalyticsDashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFunnelOverview,
  fetchEventBreakdown,
  fetchUserSegments,
  fetchTopNotes,
} from "../../../REDUX/Slices/adminPaywallSlice";

import {
  selectFunnelTotals,
  selectFunnelSeriesByDay,
  selectEventCountsMap,
  selectSegmentCounts,
  selectTopNotes,
} from "../../../REDUX/selectors/adminPaywallSelectors";


const AdminPaywallAnalyticsDashboard = () => {
  const dispatch = useDispatch();

  const funnelTotals = useSelector(selectFunnelTotals);
  const funnelSeries = useSelector(selectFunnelSeriesByDay);
  const eventMap = useSelector(selectEventCountsMap);
  const segmentCounts = useSelector(selectSegmentCounts);
  const topNotes = useSelector(selectTopNotes);

  const status = useSelector((s) => s.adminPaywall.status);
  const error = useSelector((s) => s.adminPaywall.error);
const segments = useSelector((s) => s.adminPaywall.userSegments);

  useEffect(() => {
    dispatch(fetchFunnelOverview());
    dispatch(fetchEventBreakdown());
    dispatch(fetchUserSegments());
    dispatch(fetchTopNotes());
  }, [dispatch]);

  const isLoading =
    status.funnelOverview === "loading" ||
    status.eventBreakdown === "loading" ||
    status.userSegments === "loading" ||
    status.topNotes === "loading";

  const anyError =
    error.funnelOverview || error.eventBreakdown || error.userSegments || error.topNotes;

  if (isLoading) return <div className="p-4">Loading paywall analytics...</div>;
  if (anyError) return <div className="p-4 text-red-600">Error: {String(anyError)}</div>;

  return (
  <div className="p-8 space-y-10 bg-[#0f172a] min-h-screen text-white">

    {/* Header */}
    <div>
      <h2 className="text-2xl font-bold tracking-tight">
        Paywall & Conversion Analytics
      </h2>
      <p className="text-sm text-gray-400 mt-1">
        Funnel performance, event behavior & user segmentation
      </p>
    </div>

    {/* === KPI CARDS === */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <KpiCard title="Paywall Shown" value={funnelTotals.paywallShown} color="blue" />
      <KpiCard title="Support Clicks" value={funnelTotals.supportClicks} color="yellow" />
      <KpiCard title="Payments Success" value={funnelTotals.paymentSuccess} color="green" />
      <KpiCard title="Conversion %" value={`${funnelTotals.overallConversionRate}%`} color="purple" />
    </div>

    {/* === CONVERSION RATES PANEL === */}
    <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
      <h3 className="font-semibold mb-6 text-gray-200">Conversion Funnel Rates</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RateCard
          label="Preview → Support"
          value={`${funnelTotals.previewToSupportRate}%`}
        />
        <RateCard
          label="Support → Payment"
          value={`${funnelTotals.supportToPaymentRate}%`}
        />
        <RateCard
          label="Overall Conversion"
          value={`${funnelTotals.overallConversionRate}%`}
        />
      </div>
    </div>

    {/* === EVENT BREAKDOWN GRID === */}
    <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
      <h3 className="font-semibold mb-6 text-gray-200">
        Event Breakdown
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(eventMap).length > 0 ? (
          Object.entries(eventMap).map(([key, value]) => (
            <div
              key={key}
              className="bg-black/40 border border-white/10 rounded-lg p-4 hover:border-blue-500/40 transition"
            >
              <p className="text-xs text-gray-400 uppercase">
                {key.replaceAll("_", " ")}
              </p>
              <p className="text-xl font-bold mt-2 text-white">
                {value}
              </p>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">
            No event data yet.
          </div>
        )}
      </div>
    </div>

    {/* === USER SEGMENTS === */}
    <div>
      <h3 className="font-semibold mb-6 text-gray-200">
        User Segmentation
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <KpiCard title="Total Users" value={segmentCounts.totalUsers} color="blue" />
        <KpiCard title="Converted" value={segmentCounts.converted} color="green" />
        <KpiCard title="Hot Leads" value={segmentCounts.hotLeads} color="red" />
        <KpiCard title="Warm Leads" value={segmentCounts.warmLeads} color="yellow" />
        <KpiCard title="Cold Leads" value={segmentCounts.coldLeads} color="gray" />
      </div>
    </div>

    {/* === SEGMENT USER BREAKDOWN === */}
<div className="bg-[#111827] border border-white/10 rounded-xl p-6">
  <h3 className="font-semibold mb-6 text-gray-200">
    Segment Breakdown (Users)
  </h3>

  {["converted", "hotLeads", "warmLeads", "coldLeads"].map((segmentKey) => {
    const segment = segments?.segments?.[segmentKey];

    if (!segment || segment.users.length === 0) return null;

    return (
      <div key={segmentKey} className="mb-10">
        <h4 className="text-lg font-semibold text-blue-400 mb-4 capitalize">
          {segmentKey.replace(/([A-Z])/g, " $1")}
        </h4>

        <div className="space-y-4">
          {segment.users.map((u) => (
            <div
              key={u._id}
              className="bg-black/40 border border-white/10 rounded-lg p-5"
            >
              {/* User Info */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-white">
                    {u.userId?.fullName}
                  </p>
                  <p className="text-sm text-gray-400">
                    {u.userId?.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {u.userId?.role} • Semester {u.userId?.academicProfile?.semester || "-"}
                  </p>
                </div>

                <div className="text-xs text-gray-400">
                  First Exposure:
                  <div className="text-gray-300">
                    {new Date(u.firstExposureAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
                <Metric label="Previews Started" value={u.previewsStarted} />
                <Metric label="Previews Ended" value={u.previewsEnded} />
                <Metric label="Paywall Shown" value={u.paywallShownCount} />
                <Metric label="Support Clicks" value={u.supportClickedCount} />
                <Metric label="Preview Support Clicks" value={u.previewSupportClicks} />
                <Metric label="Lock Attempts" value={u.lockDownloadAttempts} />
                <Metric label="Limit Support Clicks" value={u.downloadLimitSupportClicks} />
                <Metric label="Dismissed" value={u.paywallDismissedCount} />
              </div>

              {/* Conversion Status */}
              <div className="mt-4">
                {u.hasConverted ? (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    Converted
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                    Not Converted
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  })}
</div>


    {/* === TOP CONVERTING NOTES === */}
    <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
      <h3 className="font-semibold mb-6 text-gray-200">
        Top Converting Notes
      </h3>

      {topNotes?.length ? (
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-white/10">
                <th className="py-3 pr-6">Note</th>
                <th className="py-3 pr-6">Conversions</th>
              </tr>
            </thead>
            <tbody>
              {topNotes.map((n, idx) => (
                <tr
                  key={n?._id || idx}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="py-3 pr-6">{n?.title || n?._id}</td>
                  <td className="py-3 pr-6 font-semibold">
                    {n?.count ?? n?.conversions ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          No conversions yet.
        </div>
      )}
    </div>

  </div>
);

};

const KpiCard = ({ title, value, color }) => {
  const colors = {
    blue: "text-blue-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
    purple: "text-purple-400",
    gray: "text-gray-400"
  };

  return (
    <div className="bg-[#111827] border border-white/10 rounded-xl p-5 hover:border-blue-500/40 transition">
      <p className="text-xs text-gray-400 uppercase tracking-wide">
        {title}
      </p>
      <h2 className={`text-2xl font-bold mt-3 ${colors[color]}`}>
        {value ?? 0}
      </h2>
    </div>
  );
};
const RateCard = ({ label, value }) => {
  return (
    <div className="bg-black/40 border border-white/10 rounded-xl p-5 hover:border-purple-500/40 transition">
      <p className="text-xs text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <h2 className="text-2xl font-bold mt-3 text-purple-400">
        {value ?? "0%"}
      </h2>
    </div>
  );
};
const Metric = ({ label, value }) => (
  <div className="bg-[#0f172a] border border-white/10 rounded-md p-3">
    <p className="text-gray-400">{label}</p>
    <p className="text-white font-semibold mt-1">
      {value ?? 0}
    </p>
  </div>
);



export default AdminPaywallAnalyticsDashboard;
