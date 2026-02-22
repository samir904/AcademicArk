import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

// ============================================
// 📥 FRONTEND THUNK — Log Events (batched)
// ============================================
export const logHomepageEvents = createAsyncThunk(
  "homepageAnalytics/logEvents",
  async (events, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/home/analytics/event",
        { events }
      );
      return data;
    } catch (err) {
      // Silent fail — analytics is non-critical
      return rejectWithValue(err.response?.data?.message || "Failed to log events");
    }
  }
);

// ============================================
// 📊 ADMIN THUNKS
// ============================================

/**
 * Overall CTR summary
 * GET /api/v1/home/analytics/overview?days=7
 */
export const fetchHomepageOverview = createAsyncThunk(
  "homepageAnalytics/fetchOverview",
  async (days = 7, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/home/analytics/overview?days=${days}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch overview");
    }
  }
);

/**
 * Per-section CTR breakdown
 * GET /api/v1/home/analytics/sections?days=7
 */
export const fetchHomepageSectionCTR = createAsyncThunk(
  "homepageAnalytics/fetchSectionCTR",
  async (days = 7, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/home/analytics/sections?days=${days}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch section CTR");
    }
  }
);

/**
 * Top clicked cards
 * GET /api/v1/home/analytics/top-cards?days=7&limit=10
 */
export const fetchHomepageTopCards = createAsyncThunk(
  "homepageAnalytics/fetchTopCards",
  async ({ days = 7, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/home/analytics/top-cards?days=${days}&limit=${limit}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch top cards");
    }
  }
);

/**
 * Device breakdown
 * GET /api/v1/home/analytics/devices?days=7
 */
export const fetchHomepageDevices = createAsyncThunk(
  "homepageAnalytics/fetchDevices",
  async (days = 7, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/home/analytics/devices?days=${days}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch device breakdown");
    }
  }
);

/**
 * Daily CTR trend — line chart
 * GET /api/v1/home/analytics/trend?days=30
 */
export const fetchHomepageTrend = createAsyncThunk(
  "homepageAnalytics/fetchTrend",
  async (days = 30, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/home/analytics/trend?days=${days}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch trend");
    }
  }
);

/**
 * Section scroll dropoff funnel
 * GET /api/v1/home/analytics/dropoff?days=7
 */
export const fetchHomepageDropoff = createAsyncThunk(
  "homepageAnalytics/fetchDropoff",
  async (days = 7, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/home/analytics/dropoff?days=${days}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch dropoff");
    }
  }
);

/**
 * Peak active times (hours + weekdays)
 * GET /api/v1/home/analytics/peak-times?days=14
 */
export const fetchHomepagePeakTimes = createAsyncThunk(
  "homepageAnalytics/fetchPeakTimes",
  async (days = 14, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/home/analytics/peak-times?days=${days}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch peak times");
    }
  }
);

/**
 * Manually trigger daily snapshot
 * POST /api/v1/home/analytics/generate-snapshot
 */
export const generateHomepageSnapshot = createAsyncThunk(
  "homepageAnalytics/generateSnapshot",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/home/analytics/generate-snapshot"
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to generate snapshot");
    }
  }
);
// ── Thunk
export const fetchHomepageCTABreakdown = createAsyncThunk(
  "homepageAnalytics/fetchCTABreakdown",
  async (days = 7, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/home/analytics/cta-breakdown?days=${days}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch CTA breakdown");
    }
  }
);
// ============================================
// 🏗️ INITIAL STATE
// ============================================
const adminSection = (isArray = false) => ({
  data:        isArray ? [] : null,
  loading:     false,
  error:       null,
  lastFetched: null,
});

const initialState = {
  // ── Event logging (fire-and-forget)
  eventLogging: {
    pending: false,
    error:   null,
  },

  // ── Admin sections
  admin: {
    overview:    adminSection(false),  // { totalImpressions, totalClicks, overallCTR, uniqueVisitors }
    sections:    adminSection(true),   // [{ section, impressions, clicks, ctr }]
    topCards:    adminSection(true),   // [{ rank, resourceId, title, subject, section, clicks }]
    devices:     adminSection(true),   // [{ device, count, percentage }]
    trend:       adminSection(true),   // [{ date, impressions, clicks, ctr, visitors }]
    dropoff:     adminSection(true),   // [{ position, section, impressions, dropoffPct }]
    peakTimes:   adminSection(false),  // { hourly[], weekdays[], peakHour, peakSlot, insight }
    ctaBreakdown: adminSection(false),   // { flat: [], grouped: {} }
    snapshot: {
      generating: false,
      error:      null,
      lastRun:    null,
    },
  },
};

// ============================================
// 🎯 SLICE
// ============================================
const homepageAnalyticsSlice = createSlice({
  name: "homepageAnalytics",
  initialState,

  reducers: {
    // Clear a specific admin section
    clearAdminSection: (state, action) => {
      const section = action.payload;
      if (state.admin[section]) {
        const isArray = Array.isArray(state.admin[section].data);
        state.admin[section] = adminSection(isArray);
      }
    },

    // Clear all admin data (e.g. on logout)
    clearAllAnalytics: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // ── Event logging (silent)
      .addCase(logHomepageEvents.pending, (state) => {
        state.eventLogging.pending = true;
        state.eventLogging.error   = null;
      })
      .addCase(logHomepageEvents.fulfilled, (state) => {
        state.eventLogging.pending = false;
      })
      .addCase(logHomepageEvents.rejected, (state, action) => {
        state.eventLogging.pending = false;
        state.eventLogging.error   = action.payload;
        // ✅ Never show this error to user — analytics is non-critical
      })

      // ── Overview
      .addCase(fetchHomepageOverview.pending, (state) => {
        state.admin.overview.loading = true;
        state.admin.overview.error   = null;
      })
      .addCase(fetchHomepageOverview.fulfilled, (state, action) => {
        state.admin.overview.loading     = false;
        state.admin.overview.data        = action.payload.data;
        state.admin.overview.lastFetched = new Date().toISOString();
      })
      .addCase(fetchHomepageOverview.rejected, (state, action) => {
        state.admin.overview.loading = false;
        state.admin.overview.error   = action.payload;
      })

      // ── Section CTR
      .addCase(fetchHomepageSectionCTR.pending, (state) => {
        state.admin.sections.loading = true;
        state.admin.sections.error   = null;
      })
      .addCase(fetchHomepageSectionCTR.fulfilled, (state, action) => {
        state.admin.sections.loading     = false;
        state.admin.sections.data        = action.payload.data || [];
        state.admin.sections.lastFetched = new Date().toISOString();
      })
      .addCase(fetchHomepageSectionCTR.rejected, (state, action) => {
        state.admin.sections.loading = false;
        state.admin.sections.error   = action.payload;
      })

      // ── Top Cards
      .addCase(fetchHomepageTopCards.pending, (state) => {
        state.admin.topCards.loading = true;
        state.admin.topCards.error   = null;
      })
      .addCase(fetchHomepageTopCards.fulfilled, (state, action) => {
        state.admin.topCards.loading     = false;
        state.admin.topCards.data        = action.payload.data || [];
        state.admin.topCards.lastFetched = new Date().toISOString();
      })
      .addCase(fetchHomepageTopCards.rejected, (state, action) => {
        state.admin.topCards.loading = false;
        state.admin.topCards.error   = action.payload;
      })

      // ── Devices
      .addCase(fetchHomepageDevices.pending, (state) => {
        state.admin.devices.loading = true;
        state.admin.devices.error   = null;
      })
      .addCase(fetchHomepageDevices.fulfilled, (state, action) => {
        state.admin.devices.loading     = false;
        state.admin.devices.data        = action.payload.data || [];
        state.admin.devices.lastFetched = new Date().toISOString();
      })
      .addCase(fetchHomepageDevices.rejected, (state, action) => {
        state.admin.devices.loading = false;
        state.admin.devices.error   = action.payload;
      })

      // ── Daily Trend
      .addCase(fetchHomepageTrend.pending, (state) => {
        state.admin.trend.loading = true;
        state.admin.trend.error   = null;
      })
      .addCase(fetchHomepageTrend.fulfilled, (state, action) => {
        state.admin.trend.loading     = false;
        state.admin.trend.data        = action.payload.data || [];
        state.admin.trend.lastFetched = new Date().toISOString();
      })
      .addCase(fetchHomepageTrend.rejected, (state, action) => {
        state.admin.trend.loading = false;
        state.admin.trend.error   = action.payload;
      })

      // ── Dropoff Funnel
      .addCase(fetchHomepageDropoff.pending, (state) => {
        state.admin.dropoff.loading = true;
        state.admin.dropoff.error   = null;
      })
      .addCase(fetchHomepageDropoff.fulfilled, (state, action) => {
        state.admin.dropoff.loading     = false;
        state.admin.dropoff.data        = action.payload.data || [];
        state.admin.dropoff.lastFetched = new Date().toISOString();
      })
      .addCase(fetchHomepageDropoff.rejected, (state, action) => {
        state.admin.dropoff.loading = false;
        state.admin.dropoff.error   = action.payload;
      })

      // ── Peak Times
      .addCase(fetchHomepagePeakTimes.pending, (state) => {
        state.admin.peakTimes.loading = true;
        state.admin.peakTimes.error   = null;
      })
      .addCase(fetchHomepagePeakTimes.fulfilled, (state, action) => {
        state.admin.peakTimes.loading     = false;
        state.admin.peakTimes.data        = action.payload.data || null;
        state.admin.peakTimes.lastFetched = new Date().toISOString();
      })
      .addCase(fetchHomepagePeakTimes.rejected, (state, action) => {
        state.admin.peakTimes.loading = false;
        state.admin.peakTimes.error   = action.payload;
      })

      // ── Generate Snapshot
      .addCase(generateHomepageSnapshot.pending, (state) => {
        state.admin.snapshot.generating = true;
        state.admin.snapshot.error      = null;
      })
      .addCase(generateHomepageSnapshot.fulfilled, (state) => {
        state.admin.snapshot.generating = false;
        state.admin.snapshot.lastRun    = new Date().toISOString();
      })
      .addCase(generateHomepageSnapshot.rejected, (state, action) => {
        state.admin.snapshot.generating = false;
        state.admin.snapshot.error      = action.payload;
      })
      // ── In extraReducers add:
.addCase(fetchHomepageCTABreakdown.pending, (state) => {
  state.admin.ctaBreakdown.loading = true;
  state.admin.ctaBreakdown.error   = null;
})
.addCase(fetchHomepageCTABreakdown.fulfilled, (state, action) => {
  state.admin.ctaBreakdown.loading     = false;
  state.admin.ctaBreakdown.data        = action.payload.data;
  state.admin.ctaBreakdown.lastFetched = new Date().toISOString();
})
.addCase(fetchHomepageCTABreakdown.rejected, (state, action) => {
  state.admin.ctaBreakdown.loading = false;
  state.admin.ctaBreakdown.error   = action.payload;
});

},
});

export const { clearAdminSection, clearAllAnalytics } =
  homepageAnalyticsSlice.actions;

export default homepageAnalyticsSlice.reducer;

// ============================================
// 🎯 SELECTORS
// ============================================
export const selectHomepageOverview    = (s) => s.homepageAnalytics.admin.overview;
export const selectHomepageSections    = (s) => s.homepageAnalytics.admin.sections;
export const selectHomepageTopCards    = (s) => s.homepageAnalytics.admin.topCards;
export const selectHomepageDevices     = (s) => s.homepageAnalytics.admin.devices;
export const selectHomepageTrend       = (s) => s.homepageAnalytics.admin.trend;
export const selectHomepageDropoff     = (s) => s.homepageAnalytics.admin.dropoff;
export const selectHomepagePeakTimes   = (s) => s.homepageAnalytics.admin.peakTimes;
export const selectHomepageSnapshot    = (s) => s.homepageAnalytics.admin.snapshot;
// ── Selector
export const selectHomepageCTABreakdown = (s) => s.homepageAnalytics.admin.ctaBreakdown;

// ── Freshness check (< 5 min)
export const selectIsDataFresh = (state, section) => {
  const lastFetched = state.homepageAnalytics.admin[section]?.lastFetched;
  if (!lastFetched) return false;
  return (new Date() - new Date(lastFetched)) < 5 * 60 * 1000;
};
