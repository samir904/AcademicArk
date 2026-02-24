// logsSlice.js — Complete Updated Version
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';
import { showToast } from '../../HELPERS/Toaster';


// ==========================================
// 📥 EXISTING THUNKS
// ==========================================

export const getRequestLogs = createAsyncThunk(
  'logs/getRequestLogs',
  async ({ method = '', statusCode = '', limit = 50, page = 1 }, { rejectWithValue }) => {
    try {
      let url = `/logs/requests?limit=${limit}&page=${page}`;
      if (method)     url += `&method=${method}`;
      if (statusCode) url += `&statusCode=${statusCode}`;
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get request logs';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getConsoleLogs = createAsyncThunk(
  'logs/getConsoleLogs',
  async ({ level = '', limit = 50, page = 1 }, { rejectWithValue }) => {
    try {
      let url = `/logs/console?limit=${limit}&page=${page}`;
      if (level) url += `&level=${level}`;
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get console logs';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getLogStats = createAsyncThunk(
  'logs/getLogStats',
  async (days = 7, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/logs/stats?days=${days}`);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get log statistics';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteRequestLog = createAsyncThunk(
  'logs/deleteRequestLog',
  async (logId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/logs/requests/${logId}`);
      showToast.success('Request log deleted');
      return res.data;
    } catch (error) {
      showToast.error(error?.response?.data?.message || 'Failed to delete log');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const deleteConsoleLog = createAsyncThunk(
  'logs/deleteConsoleLog',
  async (logId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/logs/console/${logId}`);
      showToast.success('Console log deleted');
      return res.data;
    } catch (error) {
      showToast.error(error?.response?.data?.message || 'Failed to delete log');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const deleteOldRequestLogs = createAsyncThunk(
  'logs/deleteOldRequestLogs',
  async (days = 7, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/logs/requests/cleanup/old?days=${days}`);
      showToast.success(`Deleted ${res.data.deletedCount} old request logs`);
      return res.data;
    } catch (error) {
      showToast.error(error?.response?.data?.message || 'Failed to delete logs');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const deleteOldConsoleLogs = createAsyncThunk(
  'logs/deleteOldConsoleLogs',
  async (days = 7, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/logs/console/cleanup/old?days=${days}`);
      showToast.success(`Deleted ${res.data.deletedCount} old console logs`);
      return res.data;
    } catch (error) {
      showToast.error(error?.response?.data?.message || 'Failed to delete logs');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// ✅ Was missing from slice — now added
export const deleteRequestLogsByStatus = createAsyncThunk(
  'logs/deleteRequestLogsByStatus',
  async (statusCode, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/logs/requests/cleanup/status?statusCode=${statusCode}`);
      showToast.success(`Deleted ${res.data.deletedCount} logs with status ${statusCode}`);
      return res.data;
    } catch (error) {
      showToast.error(error?.response?.data?.message || 'Failed to delete logs');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const clearAllLogs = createAsyncThunk(
  'logs/clearAllLogs',
  async (_, { rejectWithValue }) => {
    try {
      const confirmed = window.confirm('⚠️ WARNING: This will DELETE ALL LOGS permanently! Are you sure?');
      if (!confirmed) return rejectWithValue('Cancelled');
      const res = await axiosInstance.delete('/logs/cleanup/all?confirm=true');
      showToast.success('All logs cleared');
      return res.data;
    } catch (error) {
      showToast.error(error?.response?.data?.message || 'Failed to clear logs');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


// ==========================================
// 🆕 NEW ANALYTICS THUNKS
// ==========================================

// ── Returns: { overview, methodBreakdown, statusBreakdown, timeline }
export const fetchRequestAnalytics = createAsyncThunk(
  'logs/fetchRequestAnalytics',
  async (hours = 6, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/logs/analytics?hours=${hours}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

// ── Returns: [{ method, path, count, avgResponseTime, maxResponseTime, minResponseTime }]
export const fetchSlowEndpoints = createAsyncThunk(
  'logs/fetchSlowEndpoints',
  async ({ hours = 6, threshold = 1000 } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/logs/slow-endpoints?hours=${hours}&threshold=${threshold}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch slow endpoints');
    }
  }
);

// ── Returns: { errorsByEndpoint, errorsByType, recentErrors }
export const fetchErrorBreakdown = createAsyncThunk(
  'logs/fetchErrorBreakdown',
  async (hours = 6, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/logs/error-breakdown?hours=${hours}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch error breakdown');
    }
  }
);

// ── Returns: [{ hour, weekday, requests, errors, avgResponseTime }]
export const fetchTrafficHeatmap = createAsyncThunk(
  'logs/fetchTrafficHeatmap',
  async (hours = 6, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/logs/traffic-heatmap?hours=${hours}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch traffic heatmap');
    }
  }
);

// ── Returns: [{ method, path, count, avgResponseTime, errorRate, uniqueUsers }]
export const fetchTopEndpoints = createAsyncThunk(
  'logs/fetchTopEndpoints',
  async ({ hours = 6, limit = 15 } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/logs/top-endpoints?hours=${hours}&limit=${limit}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch top endpoints');
    }
  }
);

// ── Returns: [{ userId, userEmail, totalRequests, errorCount, avgResponseTime, lastActive }]
export const fetchTopUsers = createAsyncThunk(
  'logs/fetchTopUsers',
  async ({ hours = 6, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/logs/top-users?hours=${hours}&limit=${limit}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch top users');
    }
  }
);

// ── Returns: { riskScore, riskLevel, data: { highFreqIPs, abuse401IPs, abuse404IPs, rpmSpikes, suspiciousPaths, summary } }
export const fetchSuspiciousActivity = createAsyncThunk(
  'logs/fetchSuspiciousActivity',
  async (hours = 6, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/logs/suspicious?hours=${hours}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch suspicious activity');
    }
  }
);

// ── Returns: { deviceBreakdown, browserBreakdown, osBreakdown, mobileVsDesktop, insight }
export const fetchDeviceIntelligence = createAsyncThunk(
  'logs/fetchDeviceIntelligence',
  async (hours = 6, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/logs/device-intelligence?hours=${hours}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch device intelligence');
    }
  }
);

// ── Returns: { anonVsAuth, abuseSignals, topActiveUsers, distribution }
export const fetchUserBehaviorSignals = createAsyncThunk(
  'logs/fetchUserBehaviorSignals',
  async ({ hours = 6, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/logs/user-behavior?hours=${hours}&limit=${limit}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch user behavior');
    }
  }
);


// ==========================================
// 🗄️ INITIAL STATE
// ==========================================

const asyncState = (data = null) => ({
  data,
  loading: false,
  error:   null,
   hours:     6,       // ✅ stored from each API response
  threshold: null,    // ✅ for slowEndpoints
});

const initialState = {
  // ── Existing
  requestLogs:           [],
  requestLogsPagination: null,
  requestLoading:        false,
  requestError:          null,
  requestFilters: { method: '', statusCode: '', limit: 50, page: 1 },

  consoleLogs:           [],
  consoleLogsPagination: null,
  consoleLoading:        false,
  consoleError:          null,
  consoleFilters: { level: '', limit: 50, page: 1 },

  logStats:     { requestStats: [], consoleStats: [] },
  statsLoading: false,
  statsError:   null,

  // ── UI
  activeLogTab:    'requests',
  autoRefresh:     false,
  refreshInterval: 10000,
  selectedHours:   6,        // ✅ shared hours filter for all analytics panels

  // ── New analytics panels — each has { data, loading, error }
  analytics:          asyncState({ overview: {}, methodBreakdown: [], statusBreakdown: [], timeline: [] }),
  slowEndpoints:      asyncState([]),
  errorBreakdown:     asyncState({ errorsByEndpoint: [], errorsByType: [], recentErrors: [] }),
  trafficHeatmap:     asyncState([]),
  topEndpoints:       asyncState([]),
  topUsers:           asyncState([]),
  suspiciousActivity: asyncState({
    highFreqIPs: [], abuse401IPs: [], abuse404IPs: [],
    rpmSpikes: [], suspiciousPaths: [],
    summary: { totalSuspiciousIPs: 0, bruteForceAttempts: 0, pathScanAttempts: 0, peakRPM: 0, attackProbes: 0 },
loading:    false,
    error:      null,
    hours:      6,
    riskScore:  0,     // ✅ stored here too — panels read from this
    riskLevel:  'LOW', // ✅ stored here too
  }),
  deviceIntelligence: asyncState({
    deviceBreakdown: [], browserBreakdown: [], osBreakdown: [],
    mobileVsDesktop: {}, insight: '',
  }),
  userBehavior:       asyncState({
    anonVsAuth: {}, abuseSignals: [], topActiveUsers: [], distribution: {},
  }),

  // ── Risk metadata (from /suspicious)
  riskScore: 0,
  riskLevel: 'LOW',
};


// ==========================================
// 🔪 SLICE
// ==========================================

const logsSlice = createSlice({
  name: 'logs',
  initialState,

  reducers: {
    // ── Request logs
    setRequestFilters:  (state, action) => { state.requestFilters = { ...state.requestFilters, ...action.payload, page: 1 }; },
    setRequestPage:     (state, action) => { state.requestFilters.page = action.payload; },
    clearRequestError:  (state)         => { state.requestError = null; },
    clearRequestLogs:   (state)         => { state.requestLogs = []; state.requestLogsPagination = null; },
    removeRequestLog:   (state, action) => { state.requestLogs = state.requestLogs.filter(l => l._id !== action.payload); },

    // ── Console logs
    setConsoleFilters:  (state, action) => { state.consoleFilters = { ...state.consoleFilters, ...action.payload, page: 1 }; },
    setConsolePage:     (state, action) => { state.consoleFilters.page = action.payload; },
    clearConsoleError:  (state)         => { state.consoleError = null; },
    clearConsoleLogs:   (state)         => { state.consoleLogs = []; state.consoleLogsPagination = null; },
    removeConsoleLog:   (state, action) => { state.consoleLogs = state.consoleLogs.filter(l => l._id !== action.payload); },

    // ── UI
    setActiveLogTab:    (state, action) => { state.activeLogTab    = action.payload; },
    setAutoRefresh:     (state, action) => { state.autoRefresh     = action.payload; },
    setRefreshInterval: (state, action) => { state.refreshInterval = action.payload; },

    // ✅ Single hours filter controls ALL analytics panels at once
    setSelectedHours:   (state, action) => { state.selectedHours  = action.payload; },

    clearStats:         (state) => { state.logStats = { requestStats: [], consoleStats: [] }; },

    // ✅ Reset single analytics panel errors
    clearAnalyticsError: (state, action) => {
      const panel = action.payload; // e.g. "analytics" | "slowEndpoints" | etc.
      if (state[panel]) state[panel].error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ─── GET REQUEST LOGS ───
      .addCase(getRequestLogs.pending,   (state) => { state.requestLoading = true;  state.requestError = null; })
      .addCase(getRequestLogs.fulfilled, (state, { payload }) => {
        state.requestLoading        = false;
        state.requestLogs           = payload.data.logs;
        state.requestLogsPagination = {
          total:       payload.data.total,
          pages:       payload.data.pages,
          currentPage: payload.data.currentPage || state.requestFilters.page,
        };
      })
      .addCase(getRequestLogs.rejected, (state, { payload }) => { state.requestLoading = false; state.requestError = payload; })

      // ─── GET CONSOLE LOGS ───
      .addCase(getConsoleLogs.pending,   (state) => { state.consoleLoading = true;  state.consoleError = null; })
      .addCase(getConsoleLogs.fulfilled, (state, { payload }) => {
        state.consoleLoading        = false;
        state.consoleLogs           = payload.data.logs;
        state.consoleLogsPagination = {
          total:       payload.data.total,
          pages:       payload.data.pages,
          currentPage: payload.data.currentPage || state.consoleFilters.page,
        };
      })
      .addCase(getConsoleLogs.rejected, (state, { payload }) => { state.consoleLoading = false; state.consoleError = payload; })

      // ─── GET LOG STATS ───
      .addCase(getLogStats.pending,   (state) => { state.statsLoading = true;  state.statsError = null; })
      .addCase(getLogStats.fulfilled, (state, { payload }) => { state.statsLoading = false; state.logStats = payload.data; })
      .addCase(getLogStats.rejected,  (state, { payload }) => { state.statsLoading = false; state.statsError = payload; })

      // ─── DELETE REQUEST LOG ───
      .addCase(deleteRequestLog.pending,   (state) => { state.requestLoading = true; })
      .addCase(deleteRequestLog.fulfilled, (state, { payload }) => {
        state.requestLoading = false;
        state.requestLogs    = state.requestLogs.filter(l => l._id !== payload.data._id);
      })
      .addCase(deleteRequestLog.rejected,  (state, { payload }) => { state.requestLoading = false; state.requestError = payload; })

      // ─── DELETE CONSOLE LOG ───
      .addCase(deleteConsoleLog.pending,   (state) => { state.consoleLoading = true; })
      .addCase(deleteConsoleLog.fulfilled, (state, { payload }) => {
        state.consoleLoading = false;
        state.consoleLogs    = state.consoleLogs.filter(l => l._id !== payload.data._id);
      })
      .addCase(deleteConsoleLog.rejected,  (state, { payload }) => { state.consoleLoading = false; state.consoleError = payload; })

      // ─── DELETE OLD REQUEST LOGS ───
      .addCase(deleteOldRequestLogs.pending,   (state) => { state.requestLoading = true; })
      .addCase(deleteOldRequestLogs.fulfilled,  (state) => { state.requestLoading = false; state.requestLogs = []; })
      .addCase(deleteOldRequestLogs.rejected,   (state, { payload }) => { state.requestLoading = false; state.requestError = payload; })

      // ─── DELETE OLD CONSOLE LOGS ───
      .addCase(deleteOldConsoleLogs.pending,   (state) => { state.consoleLoading = true; })
      .addCase(deleteOldConsoleLogs.fulfilled,  (state) => { state.consoleLoading = false; state.consoleLogs = []; })
      .addCase(deleteOldConsoleLogs.rejected,   (state, { payload }) => { state.consoleLoading = false; state.consoleError = payload; })

      // ─── DELETE BY STATUS ───
      .addCase(deleteRequestLogsByStatus.pending,   (state) => { state.requestLoading = true; })
      .addCase(deleteRequestLogsByStatus.fulfilled,  (state) => { state.requestLoading = false; state.requestLogs = []; })
      .addCase(deleteRequestLogsByStatus.rejected,   (state, { payload }) => { state.requestLoading = false; state.requestError = payload; })

      // ─── CLEAR ALL LOGS ───
      .addCase(clearAllLogs.pending,   (state) => { state.requestLoading = true; })
      .addCase(clearAllLogs.fulfilled, (state) => {
        state.requestLoading = false;
        state.requestLogs    = [];
        state.consoleLogs    = [];
        state.logStats       = { requestStats: [], consoleStats: [] };
      })
      .addCase(clearAllLogs.rejected,  (state, { payload }) => { state.requestLoading = false; state.requestError = payload; })


      // ══════════════════════════════════════
      // 🆕 NEW ANALYTICS EXTRA REDUCERS
      // ══════════════════════════════════════

      // ─── REQUEST ANALYTICS ───
      // payload: { success, hours, data: { overview, methodBreakdown, statusBreakdown, timeline } }
      .addCase(fetchRequestAnalytics.pending,   (state) => { state.analytics.loading = true;  state.analytics.error = null; })
      .addCase(fetchRequestAnalytics.fulfilled, (state, { payload }) => {
        state.analytics.loading = false;
        state.analytics.data    = payload.data; // { overview, methodBreakdown, statusBreakdown, timeline }
        state.analytics.hours   = payload.hours; // ✅
      })
      .addCase(fetchRequestAnalytics.rejected,  (state, { payload }) => { state.analytics.loading = false; state.analytics.error = payload; })

      // ─── SLOW ENDPOINTS ───
      // payload: { success, data: [...], threshold, hours }
      .addCase(fetchSlowEndpoints.pending,   (state) => { state.slowEndpoints.loading = true;  state.slowEndpoints.error = null; })
      .addCase(fetchSlowEndpoints.fulfilled, (state, { payload }) => {
        state.slowEndpoints.loading = false;
        state.slowEndpoints.data    = payload.data;
        state.slowEndpoints.hours      = payload.hours;     // ✅
  state.slowEndpoints.threshold  = payload.threshold; // ✅
      })
      .addCase(fetchSlowEndpoints.rejected,  (state, { payload }) => { state.slowEndpoints.loading = false; state.slowEndpoints.error = payload; })

      // ─── ERROR BREAKDOWN ───
      // payload: { success, hours, data: { errorsByEndpoint, errorsByType, recentErrors } }
      .addCase(fetchErrorBreakdown.pending,   (state) => { state.errorBreakdown.loading = true;  state.errorBreakdown.error = null; })
      .addCase(fetchErrorBreakdown.fulfilled, (state, { payload }) => {
        state.errorBreakdown.loading = false;
        state.errorBreakdown.data    = payload.data;
        state.errorBreakdown.hours   = payload.hours; // ✅
      })
      .addCase(fetchErrorBreakdown.rejected,  (state, { payload }) => { state.errorBreakdown.loading = false; state.errorBreakdown.error = payload; })

      // ─── TRAFFIC HEATMAP ───
      // payload: { success, hours, data: [{ hour, weekday, requests, errors, avgResponseTime }] }
      .addCase(fetchTrafficHeatmap.pending,   (state) => { state.trafficHeatmap.loading = true;  state.trafficHeatmap.error = null; })
      .addCase(fetchTrafficHeatmap.fulfilled, (state, { payload }) => {
        state.trafficHeatmap.loading = false;
        state.trafficHeatmap.data    = payload.data;
        state.errorBreakdown.hours   = payload.hours; // ✅
      })
      .addCase(fetchTrafficHeatmap.rejected,  (state, { payload }) => { state.trafficHeatmap.loading = false; state.trafficHeatmap.error = payload; })

      // ─── TOP ENDPOINTS ───
      // payload: { success, hours, data: [...] }
      .addCase(fetchTopEndpoints.pending,   (state) => { state.topEndpoints.loading = true;  state.topEndpoints.error = null; })
      .addCase(fetchTopEndpoints.fulfilled, (state, { payload }) => {
        state.topEndpoints.loading = false;
        state.topEndpoints.data    = payload.data;
        state.errorBreakdown.hours   = payload.hours; // ✅
      })
      .addCase(fetchTopEndpoints.rejected,  (state, { payload }) => { state.topEndpoints.loading = false; state.topEndpoints.error = payload; })

      // ─── TOP USERS ───
      // payload: { success, hours, data: [...] }
      .addCase(fetchTopUsers.pending,   (state) => { state.topUsers.loading = true;  state.topUsers.error = null; })
      .addCase(fetchTopUsers.fulfilled, (state, { payload }) => {
        state.topUsers.loading = false;
        state.topUsers.data    = payload.data;
        state.errorBreakdown.hours   = payload.hours; // ✅
      })
      .addCase(fetchTopUsers.rejected,  (state, { payload }) => { state.topUsers.loading = false; state.topUsers.error = payload; })

      // ─── SUSPICIOUS ACTIVITY ───
      // payload: { success, hours, riskScore, riskLevel, data: { highFreqIPs, ... summary } }
      .addCase(fetchSuspiciousActivity.pending,   (state) => { state.suspiciousActivity.loading = true;  state.suspiciousActivity.error = null; })
      .addCase(fetchSuspiciousActivity.fulfilled, (state, { payload }) => {
        state.suspiciousActivity.loading = false;
        state.suspiciousActivity.data    = payload.data;
        // ✅ Hoist risk metadata to top level — used in dashboard header badge
        state.riskScore = payload.riskScore;
        state.riskLevel = payload.riskLevel;
        state.suspiciousActivity.hours     = payload.hours;      // ✅
  state.suspiciousActivity.riskScore = payload.riskScore;  // ✅
  state.suspiciousActivity.riskLevel = payload.riskLevel;  // ✅
      })
      .addCase(fetchSuspiciousActivity.rejected,  (state, { payload }) => { state.suspiciousActivity.loading = false; state.suspiciousActivity.error = payload; })

      // ─── DEVICE INTELLIGENCE ───
      // payload: { success, hours, data: { deviceBreakdown, browserBreakdown, osBreakdown, mobileVsDesktop, insight } }
      .addCase(fetchDeviceIntelligence.pending,   (state) => { state.deviceIntelligence.loading = true;  state.deviceIntelligence.error = null; })
      .addCase(fetchDeviceIntelligence.fulfilled, (state, { payload }) => {
        state.deviceIntelligence.loading = false;
        state.deviceIntelligence.data    = payload.data;
        state.deviceIntelligence.hours   = payload.hours; // ✅
      })
      .addCase(fetchDeviceIntelligence.rejected,  (state, { payload }) => { state.deviceIntelligence.loading = false; state.deviceIntelligence.error = payload; })

      // ─── USER BEHAVIOR SIGNALS ───
      // payload: { success, hours, data: { anonVsAuth, abuseSignals, topActiveUsers, distribution } }
      .addCase(fetchUserBehaviorSignals.pending,   (state) => { state.userBehavior.loading = true;  state.userBehavior.error = null; })
      .addCase(fetchUserBehaviorSignals.fulfilled, (state, { payload }) => {
        state.userBehavior.loading = false;
        state.userBehavior.data    = payload.data;
        state.deviceIntelligence.hours   = payload.hours; // ✅
      })
      .addCase(fetchUserBehaviorSignals.rejected,  (state, { payload }) => { state.userBehavior.loading = false; state.userBehavior.error = payload; });
  },
});


// ==========================================
// 📤 EXPORTS
// ==========================================

export const {
  // Request logs
  setRequestFilters, setRequestPage,
  clearRequestError, clearRequestLogs, removeRequestLog,
  // Console logs
  setConsoleFilters, setConsolePage,
  clearConsoleError, clearConsoleLogs, removeConsoleLog,
  // UI
  setActiveLogTab, setAutoRefresh, setRefreshInterval,
  setSelectedHours, clearStats, clearAnalyticsError,
} = logsSlice.actions;

// ==========================================
// 📤 SELECTORS — correct names matching all panels
// ==========================================

export const selectRequestLogs      = (s) => s.logs.requestLogs;
export const selectConsoleLogs      = (s) => s.logs.consoleLogs;
export const selectLogStats         = (s) => s.logs.logStats;
export const selectSelectedHours    = (s) => s.logs.selectedHours;
export const selectRiskLevel        = (s) => ({ score: s.logs.riskScore, level: s.logs.riskLevel });

// ✅ Exact names used in every panel — no mismatch
export const selectAnalytics           = (s) => s.logs.analytics;
export const selectSlowEndpoints       = (s) => s.logs.slowEndpoints;
export const selectErrorBreakdown      = (s) => s.logs.errorBreakdown;
export const selectTrafficHeatmap      = (s) => s.logs.trafficHeatmap;
export const selectTopEndpoints        = (s) => s.logs.topEndpoints;
export const selectTopUsers            = (s) => s.logs.topUsers;
export const selectSuspiciousActivity  = (s) => s.logs.suspiciousActivity; // ✅ was selectSuspicious
export const selectDeviceIntelligence  = (s) => s.logs.deviceIntelligence; // ✅ was selectDeviceIntel
export const selectUserBehavior        = (s) => s.logs.userBehavior;

export default logsSlice.reducer;
