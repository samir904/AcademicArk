// =====================================
// 📊 REDUX/Slices/sessionSlice.js
// =====================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

// ============================================
// ASYNC THUNKS
// ============================================

/**
 * Start a new session
 */
export const startSession = createAsyncThunk(
  "session/startSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/session/start",
        {},
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to start session"
      );
    }
  }
);

/**
 * End current session
 */
export const endSession = createAsyncThunk(
  "session/endSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/session/end",
        {},
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to end session"
      );
    }
  }
);

/**
 * Get active session for user
 */
export const getActiveSession = createAsyncThunk(
  "session/getActiveSession",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/session/active/${userId}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch active session"
      );
    }
  }
);

/**
 * Ping session (keep alive)
 */
export const pingSession = createAsyncThunk(
  "session/pingSession",
  async ({ sessionId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/session/ping",
        { sessionId },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to ping session");
    }
  }
);


/**
 * Track page view
 */
export const trackPageView = createAsyncThunk(
  "session/trackPageView",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/session/track/page-view",
        payload,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to track page view"
      );
    }
  }
);

/**
 * Track note interaction
 */
export const trackNoteInteraction = createAsyncThunk(
  "session/trackNoteInteraction",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/session/track/note-interaction",
        payload,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to track interaction"
      );
    }
  }
);

/**
 * Track click event
 */
export const trackClickEvent = createAsyncThunk(
  "session/trackClickEvent",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/session/track/click",
        payload,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to track click"
      );
    }
  }
);

/**
 * Get session analytics
 */
export const getSessionAnalytics = createAsyncThunk(
  "session/getAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/session/analytics/summary",
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch analytics"
      );
    }
  }
);

/**
 * Get page metrics
 */
export const getPageMetrics = createAsyncThunk(
  "session/getPageMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/session/analytics/page-metrics",
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch page metrics"
      );
    }
  }
);

export const trackPageExit = createAsyncThunk(
  "session/trackPageExit",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/session/track/page-exit",
        payload,
        { withCredentials: true }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue("Failed to track page exit");
    }
  }
);


// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  // Current session data
  currentSession: {
    sessionId: null,
    userId: null,
    status: null,
    startTime: null,
    endTime: null,
    duration: 0,
    engagement: {
      pageViews: 0,
      totalClicks: 0,
      maxScrollDepth: 0,
      noteInteractions: {
        viewed: 0,
        clicked: 0,
        downloaded: 0,
        bookmarked: 0,
        rated: 0
      }
    },
    deviceInfo: null,
    bounceInfo: null,
    conversions: [],
    clickThroughData: {
      impressions: 0,
      clicks: 0,
      ctr: 0
    }
  },

  // Analytics data
  analytics: {
    engagementScore: 0,
    engagementLevel: null,
    bounceRate: 0,
    avgDuration: 0,
    pageMetrics: [],
    conversionFunnel: {
      viewed: 0,
      clicked: 0,
      downloaded: 0
    },
    deviceBreakdown: {},
    browserBreakdown: []
  },

  // Page metrics
  pageMetrics: [],

  // Tracking state
  lastTracked: {
    pageView: null,
    interaction: null,
    click: null
  },

  // UI state
  pingInterval: null,
  sessionActive: false,
  showAnalytics: false,

  // Loading & error states
  loading: false,
  analyticsLoading: false,
  pageMetricsLoading: false,
  error: null,
  analyticsError: null,
  pageMetricsError: null
};

// ============================================
// SLICE
// ============================================

const sessionSlice = createSlice({
  name: "session",
  initialState,

  reducers: {
    // Clear session
    clearSession: (state) => {
      state.currentSession = initialState.currentSession;
      state.sessionActive = false;
    },

    // Update current session
    updateCurrentSession: (state, action) => {
      state.currentSession = { ...state.currentSession, ...action.payload };
    },

    // Toggle analytics view
    toggleAnalyticsView: (state) => {
      state.showAnalytics = !state.showAnalytics;
    },

    // Clear all errors
    clearErrors: (state) => {
      state.error = null;
      state.analyticsError = null;
      state.pageMetricsError = null;
    },

    // Set ping interval ID (for cleanup)
    setPingInterval: (state, action) => {
      state.pingInterval = action.payload;
    },

    // Update engagement metrics
    updateEngagementMetrics: (state, action) => {
      state.currentSession.engagement = {
        ...state.currentSession.engagement,
        ...action.payload
      };
    },

    // Update click-through data
    updateCTRData: (state, action) => {
      state.currentSession.clickThroughData = {
        ...state.currentSession.clickThroughData,
        ...action.payload
      };
    }
  },

  extraReducers: (builder) => {
    // Start Session
    builder
      .addCase(startSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
        .addCase(startSession.fulfilled, (state, action) => {
  state.loading = false;
  state.currentSession.sessionId = action.payload.sessionId;
  state.currentSession.startTime = action.payload.startTime;
  state.currentSession.status = "ACTIVE";
  state.sessionActive = true;
})
      .addCase(startSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.sessionActive = false;
      });

    // End Session
    builder
      .addCase(endSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(endSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload;
        state.sessionActive = false;
      })
      .addCase(endSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Active Session
    builder
      .addCase(getActiveSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload;
        state.sessionActive = action.payload?.status === "ACTIVE";
      })
      .addCase(getActiveSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.sessionActive = false;
      });

    // Ping Session
    builder
      .addCase(pingSession.pending, (state) => {
        // Silent ping, no loading state change
      })
      .addCase(pingSession.fulfilled, (state, action) => {
        state.currentSession = {
  ...state.currentSession,
  ...action.payload
};

        state.sessionActive = action.payload?.status === "ACTIVE";
      })
      .addCase(pingSession.rejected, (state, action) => {
        // Silent failure on ping
        console.warn("Session ping failed:", action.payload);
      });

    // Track Page View
    builder
      .addCase(trackPageView.pending, (state) => {
        // Silent tracking
      })
      .addCase(trackPageView.fulfilled, (state, action) => {
        state.lastTracked.pageView = new Date().toISOString();
        if (action.payload?.engagement) {
          state.currentSession.engagement = {
            ...state.currentSession.engagement,
            ...action.payload.engagement
          };
        }
      })
      .addCase(trackPageView.rejected, (state, action) => {
        console.warn("Page view tracking failed:", action.payload);
      });

    // Track Note Interaction
    builder
      .addCase(trackNoteInteraction.pending, (state) => {
        // Silent tracking
      })
      .addCase(trackNoteInteraction.fulfilled, (state, action) => {
        state.lastTracked.interaction = new Date().toISOString();
        if (action.payload?.engagement?.noteInteractions) {
          state.currentSession.engagement.noteInteractions = {
            ...state.currentSession.engagement.noteInteractions,
            ...action.payload.engagement.noteInteractions
          };
        }
      })
      .addCase(trackNoteInteraction.rejected, (state, action) => {
        console.warn("Interaction tracking failed:", action.payload);
      });

    // Track Click Event
    builder
      .addCase(trackClickEvent.pending, (state) => {
        // Silent tracking
      })
      .addCase(trackClickEvent.fulfilled, (state, action) => {
        state.lastTracked.click = new Date().toISOString();
        if (action.payload?.clickThroughData) {
          state.currentSession.clickThroughData = {
            ...state.currentSession.clickThroughData,
            ...action.payload.clickThroughData
          };
        }
      })
      .addCase(trackClickEvent.rejected, (state, action) => {
        console.warn("Click tracking failed:", action.payload);
      });

    // Get Session Analytics
    builder
      .addCase(getSessionAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.analyticsError = null;
      })
      .addCase(getSessionAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload;
      })
      .addCase(getSessionAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.analyticsError = action.payload;
      });

    // Get Page Metrics
    builder
      .addCase(getPageMetrics.pending, (state) => {
        state.pageMetricsLoading = true;
        state.pageMetricsError = null;
      })
      .addCase(getPageMetrics.fulfilled, (state, action) => {
        state.pageMetricsLoading = false;
        state.pageMetrics = action.payload;
      })
      .addCase(getPageMetrics.rejected, (state, action) => {
        state.pageMetricsLoading = false;
        state.pageMetricsError = action.payload;
      });
  }
});

export const {
  clearSession,
  updateCurrentSession,
  toggleAnalyticsView,
  clearErrors,
  setPingInterval,
  updateEngagementMetrics,
  updateCTRData
} = sessionSlice.actions;

export default sessionSlice.reducer;