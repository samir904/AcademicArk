import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

// ============================================
// ASYNC THUNKS
// ============================================

// Overview Tab
export const fetchOverview = createAsyncThunk(
  "adminAnalytics/fetchOverview",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/overview?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch overview"
      );
    }
  }
);

// Sessions Tab
export const fetchSessionsTimeline = createAsyncThunk(
  "adminAnalytics/fetchSessionsTimeline",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/sessions/timeline?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sessions timeline"
      );
    }
  }
);

export const fetchReturningUsers = createAsyncThunk(
  "adminAnalytics/fetchReturningUsers",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/users/returning?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch returning users"
      );
    }
  }
);

export const fetchNewUsers = createAsyncThunk(
  "adminAnalytics/fetchNewUsers",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/users/new?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch new users"
      );
    }
  }
);

// Pages Tab
export const fetchTopPages = createAsyncThunk(
  "adminAnalytics/fetchTopPages",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/pages/top?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top pages"
      );
    }
  }
);

export const fetchPageEngagement = createAsyncThunk(
  "adminAnalytics/fetchPageEngagement",
  async ({ pageName }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/pages/engagement?pageName=${pageName}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch page engagement"
      );
    }
  }
);

// Notes Tab
export const fetchTopViewedNotes = createAsyncThunk(
  "adminAnalytics/fetchTopViewedNotes",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/notes/top-viewed?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top viewed notes"
      );
    }
  }
);

export const fetchTopDownloadedNotes = createAsyncThunk(
  "adminAnalytics/fetchTopDownloadedNotes",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/notes/top-downloaded?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top downloaded notes"
      );
    }
  }
);

export const fetchNotesFunnel = createAsyncThunk(
  "adminAnalytics/fetchNotesFunnel",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/notes/funnel?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notes funnel"
      );
    }
  }
);

export const fetchDeadContent = createAsyncThunk(
  "adminAnalytics/fetchDeadContent",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/notes/dead-content?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dead content"
      );
    }
  }
);

// Funnel Tab
export const fetchDownloadFunnel = createAsyncThunk(
  "adminAnalytics/fetchDownloadFunnel",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/funnel/download?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch download funnel"
      );
    }
  }
);

export const fetchConversionsSummary = createAsyncThunk(
  "adminAnalytics/fetchConversionsSummary",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/conversions/summary?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch conversions summary"
      );
    }
  }
);

// CTR Tab
export const fetchCTRBySection = createAsyncThunk(
  "adminAnalytics/fetchCTRBySection",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/ctr/by-section?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch CTR by section"
      );
    }
  }
);

export const fetchEngagementSummary = createAsyncThunk(
  "adminAnalytics/fetchEngagementSummary",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/engagement/summary?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch engagement summary"
      );
    }
  }
);

// Devices Tab
export const fetchDeviceBreakdown = createAsyncThunk(
  "adminAnalytics/fetchDeviceBreakdown",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/devices/breakdown?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch device breakdown"
      );
    }
  }
);

export const fetchBrowserBreakdown = createAsyncThunk(
  "adminAnalytics/fetchBrowserBreakdown",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/browsers/breakdown?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch browser breakdown"
      );
    }
  }
);

export const fetchOSBreakdown = createAsyncThunk(
  "adminAnalytics/fetchOSBreakdown",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/os/breakdown?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch OS breakdown"
      );
    }
  }
);

// Acquisition Tab
export const fetchTrafficSources = createAsyncThunk(
  "adminAnalytics/fetchTrafficSources",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/acquisition/sources?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch traffic sources"
      );
    }
  }
);

export const fetchEntryPagesBySource = createAsyncThunk(
  "adminAnalytics/fetchEntryPagesBySource",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/acquisition/entry-pages?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch entry pages"
      );
    }
  }
);

export const fetchTopReferrers = createAsyncThunk(
  "adminAnalytics/fetchTopReferrers",
  async ({ range = "7" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/analytics/acquisition/referrers?range=${range}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top referrers"
      );
    }
  }
);


// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  // Overview Tab
  overview: {
    timeRange: "",
    totalSessions: 0,
    activeUsersToday: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    totalPageViews: 0,
    downloadsToday: 0,
    totalDownloads: 0
  },

  // Sessions Tab
  sessionsTimeline: [],
  returningUsers: {
    totalUniqueUsers: 0,
    returningUsers: 0,
    newUsers: 0,
    returningPercentage: "0"
  },
  newUsers: {
    newUsers: 0
  },

  // Pages Tab
  topPages: [],
  pageEngagement: {},

  // Notes Tab
  topViewedNotes: [],
  topDownloadedNotes: [],
  notesFunnel: {
    views: 0,
    clicks: 0,
    downloads: 0,
    clickThroughRate: 0,
    downloadConversionRate: 0,
    overallConversion: 0
  },
  deadContent: [],

  // Funnel Tab
  downloadFunnel: {
    step1_homepage: 0,
    step2_notesList: 0,
    step3_noteDetail: 0,
    step4_download: 0,
    drop1: 0,
    drop2: 0,
    drop3: 0
  },
  conversionsSummary: {
    totalSessions: 0,
    sessionsWithConversions: 0,
    totalConversions: 0,
    downloadConversions: 0,
    bookmarkConversions: 0,
    conversionRate: 0
  },

  // CTR Tab
  ctrBySection: [],
  engagementSummary: {
    totalBookmarks: 0,
    totalRatings: 0,
    avgPageViews: 0,
    avgClicks: 0,
    avgScrollDepth: 0,
    avgSessionDuration: 0
  },

  // Devices Tab
  deviceBreakdown: [],
  browserBreakdown: [],
  osBreakdown: [],

    // Acquisition Tab
  trafficSources: [],
  entryPagesBySource: [],
  topReferrers: [],


  // UI State
  activeTab: "overview",
  selectedRange: "7",

  // Loading & Error States
  loading: false,
  error: null
};

// ============================================
// SLICE
// ============================================

const adminAnalyticsSlice = createSlice({
  name: "adminAnalytics",
  initialState,

  reducers: {
    // Change active tab
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    // Set date range
    setSelectedRange: (state, action) => {
      state.selectedRange = action.payload;
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    // ===== OVERVIEW =====
    builder
      .addCase(fetchOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== SESSIONS TIMELINE =====
    builder
      .addCase(fetchSessionsTimeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionsTimeline.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionsTimeline = action.payload;
      })
      .addCase(fetchSessionsTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== RETURNING USERS =====
    builder
      .addCase(fetchReturningUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReturningUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.returningUsers = action.payload;
      })
      .addCase(fetchReturningUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== NEW USERS =====
    builder
      .addCase(fetchNewUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.newUsers = action.payload;
      })
      .addCase(fetchNewUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== TOP PAGES =====
    builder
      .addCase(fetchTopPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopPages.fulfilled, (state, action) => {
        state.loading = false;
        state.topPages = action.payload;
      })
      .addCase(fetchTopPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== PAGE ENGAGEMENT =====
    builder
      .addCase(fetchPageEngagement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageEngagement.fulfilled, (state, action) => {
        state.loading = false;
        state.pageEngagement = action.payload;
      })
      .addCase(fetchPageEngagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== TOP VIEWED NOTES =====
    builder
      .addCase(fetchTopViewedNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopViewedNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.topViewedNotes = action.payload;
      })
      .addCase(fetchTopViewedNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== TOP DOWNLOADED NOTES =====
    builder
      .addCase(fetchTopDownloadedNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopDownloadedNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.topDownloadedNotes = action.payload;
      })
      .addCase(fetchTopDownloadedNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== NOTES FUNNEL =====
    builder
      .addCase(fetchNotesFunnel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotesFunnel.fulfilled, (state, action) => {
        state.loading = false;
        state.notesFunnel = action.payload;
      })
      .addCase(fetchNotesFunnel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== DEAD CONTENT =====
    builder
      .addCase(fetchDeadContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeadContent.fulfilled, (state, action) => {
        state.loading = false;
        state.deadContent = action.payload;
      })
      .addCase(fetchDeadContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== DOWNLOAD FUNNEL =====
    builder
      .addCase(fetchDownloadFunnel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDownloadFunnel.fulfilled, (state, action) => {
        state.loading = false;
        state.downloadFunnel = action.payload;
      })
      .addCase(fetchDownloadFunnel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== CONVERSIONS SUMMARY =====
    builder
      .addCase(fetchConversionsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversionsSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.conversionsSummary = action.payload;
      })
      .addCase(fetchConversionsSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== CTR BY SECTION =====
    builder
      .addCase(fetchCTRBySection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCTRBySection.fulfilled, (state, action) => {
        state.loading = false;
        state.ctrBySection = action.payload;
      })
      .addCase(fetchCTRBySection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== ENGAGEMENT SUMMARY =====
    builder
      .addCase(fetchEngagementSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEngagementSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.engagementSummary = action.payload;
      })
      .addCase(fetchEngagementSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== DEVICE BREAKDOWN =====
    builder
      .addCase(fetchDeviceBreakdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeviceBreakdown.fulfilled, (state, action) => {
        state.loading = false;
        state.deviceBreakdown = action.payload;
      })
      .addCase(fetchDeviceBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== BROWSER BREAKDOWN =====
    builder
      .addCase(fetchBrowserBreakdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrowserBreakdown.fulfilled, (state, action) => {
        state.loading = false;
        state.browserBreakdown = action.payload;
      })
      .addCase(fetchBrowserBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== OS BREAKDOWN =====
    builder
      .addCase(fetchOSBreakdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOSBreakdown.fulfilled, (state, action) => {
        state.loading = false;
        state.osBreakdown = action.payload;
      })
      .addCase(fetchOSBreakdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

          // ===== TRAFFIC SOURCES =====
    builder
      .addCase(fetchTrafficSources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrafficSources.fulfilled, (state, action) => {
        state.loading = false;
        state.trafficSources = action.payload;
      })
      .addCase(fetchTrafficSources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== ENTRY PAGES BY SOURCE =====
    builder
      .addCase(fetchEntryPagesBySource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntryPagesBySource.fulfilled, (state, action) => {
        state.loading = false;
        state.entryPagesBySource = action.payload;
      })
      .addCase(fetchEntryPagesBySource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== TOP REFERRERS =====
    builder
      .addCase(fetchTopReferrers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopReferrers.fulfilled, (state, action) => {
        state.loading = false;
        state.topReferrers = action.payload;
      })
      .addCase(fetchTopReferrers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  }
});

export const { setActiveTab, setSelectedRange, clearError } = adminAnalyticsSlice.actions;

export default adminAnalyticsSlice.reducer;