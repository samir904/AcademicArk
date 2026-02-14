// src/REDUX/selectors/adminPaywallSelectors.js
import { createSelector } from "@reduxjs/toolkit";

/* =====================================================
   BASE SELECTOR (ALWAYS FIRST)
===================================================== */

const selectAdminPaywall = (state) => state.adminPaywall || {};


/* =====================================================
   RAW DATA SELECTORS (DEFINE BEFORE USING)
===================================================== */

export const selectFunnelOverview = createSelector(
  [selectAdminPaywall],
  (s) => s.funnelOverview || []
);

export const selectEventBreakdown = createSelector(
  [selectAdminPaywall],
  (s) => s.eventBreakdown || []
);

export const selectUserSegments = createSelector(
  [selectAdminPaywall],
  (s) => s.userSegments || {}
);

export const selectTopNotes = createSelector(
  [selectAdminPaywall],
  (s) => s.topNotes || []
);


/* =====================================================
   DERIVED SELECTORS
===================================================== */


/* 1️⃣ Funnel Totals (Aggregated Across Days) */

export const selectFunnelTotals = createSelector(
  [selectFunnelOverview],
  (days) => {
    const totals = days.reduce(
      (acc, d) => {
        acc.paywallShown += d.paywallShown || 0;
        acc.supportClicks += d.supportClicks || 0;
        acc.paymentSuccess += d.paymentSuccess || 0;
        acc.previewsStarted += d.previewsStarted || 0;
        acc.previewsEnded += d.previewsEnded || 0;
        acc.lockDownloadAttempts += d.lockDownloadAttempts || 0;
        return acc;
      },
      {
        paywallShown: 0,
        supportClicks: 0,
        paymentSuccess: 0,
        previewsStarted: 0,
        previewsEnded: 0,
        lockDownloadAttempts: 0,
      }
    );

    const overallConversionRate =
      totals.paywallShown > 0
        ? (totals.paymentSuccess / totals.paywallShown) * 100
        : 0;

    return {
      ...totals,
      overallConversionRate: Number(overallConversionRate.toFixed(2)),
    };
  }
);


/* 2️⃣ Funnel Series (For Charts) */

export const selectFunnelSeriesByDay = createSelector(
  [selectFunnelOverview],
  (days) => {
    return days
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((d) => ({
        date: d.date,
        paywallShown: d.paywallShown || 0,
        supportClicks: d.supportClicks || 0,
        paymentSuccess: d.paymentSuccess || 0,
        overallConversionRate: Number(d?.rates?.overallConversionRate || 0),
      }));
  }
);


/* 3️⃣ Event Breakdown Map */

export const selectEventCountsMap = createSelector(
  [selectEventBreakdown],
  (rows) => {
    return rows.reduce((acc, r) => {
      acc[r._id] = r.count || 0;
      return acc;
    }, {});
  }
);


/* 4️⃣ Sorted Event Rows (UI Friendly) */

export const selectEventRows = createSelector(
  [selectEventBreakdown],
  (rows) => {
    return rows
      .slice()
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .map((r) => ({
        event: r._id,
        count: r.count || 0,
      }));
  }
);


/* 5️⃣ Segment Counts (Card Friendly) */

export const selectSegmentCounts = createSelector(
  [selectUserSegments],
  (data) => {
    const seg = data?.segments || {};
    return {
      totalUsers: data?.totalUsers ?? 0,
      converted: seg.converted?.count ?? 0,
      hotLeads: seg.hotLeads?.count ?? 0,
      warmLeads: seg.warmLeads?.count ?? 0,
      coldLeads: seg.coldLeads?.count ?? 0,
    };
  }
);


/* 6️⃣ Clean Day Rows (Optional Table View) */

export const selectFunnelDayRows = createSelector(
  [selectFunnelOverview],
  (days) => {
    return days
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((d) => ({
        date: d.date,
        paywallShown: d.paywallShown || 0,
        supportClicks: d.supportClicks || 0,
        paymentStarted: d.paymentStarted || 0,
        paymentSuccess: d.paymentSuccess || 0,
        overallConversionRate: Number(d?.rates?.overallConversionRate || 0),
      }));
  }
);
