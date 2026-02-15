import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

/**
 * 🔹 Track Filter Event
 */
export const trackFilterEvent = createAsyncThunk(
  "filterAnalytics/trackFilterEvent",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/filter-analytics/track",
        payload,
        {
          headers: {
            "x-session-id": localStorage.getItem("sessionId")
          }
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to track filter"
      );
    }
  }
);

/**
 * 🔹 Fetch Hybrid Filters (Recommended + Trending)
 */
export const fetchHybridFilters = createAsyncThunk(
  "filterAnalytics/fetchHybridFilters",
  async (semester, { rejectWithValue }) => {
    try {
      const url = semester 
        ? `/filter-analytics/hybrid?semester=${semester}`
        : `/filter-analytics/hybrid`;
        
      const { data } = await axiosInstance.get(url);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch hybrid filters"
      );
    }
  }
);

/**
 * 🔹 Fetch Trending Filters
 */
export const fetchTrendingFilters = createAsyncThunk(
  "filterAnalytics/fetchTrendingFilters",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/filter-analytics/trending");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch trending filters"
      );
    }
  }
);

/**
 * 🔹 Check Preset Suggestion
 */
export const checkPresetSuggestion = createAsyncThunk(
  "filterAnalytics/checkPresetSuggestion",
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.semester) {
        params.append('semester', filters.semester);
      }
      
      if (filters.subject?.trim()) {
        params.append('subject', filters.subject.trim());
      }
      
      if (filters.category) {
        params.append('category', filters.category);
      }
      
      if (filters.unit) {
        params.append('unit', filters.unit);
      }

      console.log('📡 Calling preset suggestion API with:', Object.fromEntries(params));

      const { data } = await axiosInstance.get(
        `/filter-analytics/suggest?${params.toString()}`
      );
      
      return data;
    } catch (error) {
      console.error('❌ Preset suggestion API error:', error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to check preset suggestion"
      );
    }
  }
);

/**
 * 🔹 Track Note View
 */
export const trackNoteView = createAsyncThunk(
  "filterAnalytics/trackNoteView",
  async (noteId, { rejectWithValue }) => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      
      if (!sessionId) {
        console.warn('⚠️ No session ID, skipping view tracking');
        return null;
      }

      const { data } = await axiosInstance.post(
        "/filter-analytics/track-view",
        { noteId },
        {
          headers: {
            "x-session-id": sessionId
          }
        }
      );

      return data;
    } catch (error) {
      console.warn('⚠️ View tracking failed (non-critical):', error.message);
      return null;
    }
  }
);

// ========================================
// 🎯 ADMIN ANALYTICS THUNKS
// ========================================

/**
 * 📊 Fetch Admin Dashboard Summary
 */
export const fetchAdminDashboard = createAsyncThunk(
  "filterAnalytics/fetchAdminDashboard",
  async (days = 7, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/filter-analytics/admin/dashboard?days=${days}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin dashboard"
      );
    }
  }
);

/**
 * 👁️ Fetch Most Viewed Notes
 */
export const fetchMostViewedNotes = createAsyncThunk(
  "filterAnalytics/fetchMostViewedNotes",
  async ({ semester, subject, days = 30, limit = 20 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (semester) params.append('semester', semester);
      if (subject) params.append('subject', subject);
      params.append('days', days);
      params.append('limit', limit);

      const { data } = await axiosInstance.get(
        `/filter-analytics/admin/most-viewed?${params.toString()}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch most viewed notes"
      );
    }
  }
);

/**
 * 🚨 Fetch Content Gaps
 */
export const fetchContentGaps = createAsyncThunk(
  "filterAnalytics/fetchContentGaps",
  async ({ days = 30, minSearches = 3 }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/filter-analytics/admin/content-gaps?days=${days}&minSearches=${minSearches}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch content gaps"
      );
    }
  }
);

/**
 * 📈 Fetch Subject Performance
 */
export const fetchSubjectPerformance = createAsyncThunk(
  "filterAnalytics/fetchSubjectPerformance",
  async ({ semester, days = 30 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (semester) params.append('semester', semester);
      params.append('days', days);

      const { data } = await axiosInstance.get(
        `/filter-analytics/admin/subject-performance?${params.toString()}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subject performance"
      );
    }
  }
);

/**
 * 📱 Fetch Device Analytics
 */
export const fetchDeviceAnalytics = createAsyncThunk(
  "filterAnalytics/fetchDeviceAnalytics",
  async (days = 30, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/filter-analytics/admin/device-analytics?days=${days}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch device analytics"
      );
    }
  }
);

/**
 * ⏰ Fetch Peak Usage Times
 */
export const fetchPeakUsageTimes = createAsyncThunk(
  "filterAnalytics/fetchPeakUsageTimes",
  async (days = 30, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/filter-analytics/admin/peak-usage?days=${days}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch peak usage times"
      );
    }
  }
);

/**
 * 🎯 Fetch Popular Filter Combinations
 */
export const fetchPopularCombinations = createAsyncThunk(
  "filterAnalytics/fetchPopularCombinations",
  async ({ semester, days = 30, minOccurrences = 5 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (semester) params.append('semester', semester);
      params.append('days', days);
      params.append('minOccurrences', minOccurrences);

      const { data } = await axiosInstance.get(
        `/filter-analytics/admin/filter-combinations?${params.toString()}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch popular combinations"
      );
    }
  }
);
// ========================================
// 🎯 ADMIN ANALYTICS THUNKS (ADD THESE TWO)
// ========================================

/**
 * 📥 Fetch Top Downloaded Notes
 */
export const fetchTopDownloadedNotes = createAsyncThunk(
  "filterAnalytics/fetchTopDownloadedNotes",
  async ({ semester, subject, days = 30 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (semester) params.append('semester', semester);
      if (subject) params.append('subject', subject);
      params.append('days', days);

      const { data } = await axiosInstance.get(
        `/filter-analytics/admin/top-download?${params.toString()}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top downloaded notes"
      );
    }
  }
);

/**
 * 📊 Fetch Conversion Funnel Metrics
 */
export const fetchConversionFunnel = createAsyncThunk(
  "filterAnalytics/fetchConversionFunnel",
  async ({ semester, days = 7 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (semester) params.append('semester', semester);
      params.append('days', days);

      const { data } = await axiosInstance.get(
        `/filter-analytics/admin/conversion-funnel?${params.toString()}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch conversion funnel"
      );
    }
  }
);

// ========================================
// 🎯 SLICE
// ========================================

const filterAnalyticsSlice = createSlice({
  name: "filterAnalytics",
  initialState: {
    // User-facing data
    recommended: [],
    trending: [],
    trendingTimeframe: 'week',
    semester: null,
    loading: false,
    error: null,
    downloadMarked: false,
    presetSuggestion: null,

    // ✨ Admin Analytics Data
    admin: {
      dashboard: {
        data: null,
        loading: false,
        error: null,
        lastFetched: null
      },
      mostViewed: {
        data: [],
        loading: false,
        error: null,
        lastFetched: null
      },
      contentGaps: {
        data: [],
        loading: false,
        error: null,
        lastFetched: null
      },
      subjectPerformance: {
        data: [],
        loading: false,
        error: null,
        lastFetched: null
      },
      deviceAnalytics: {
        data: null,
        loading: false,
        error: null,
        lastFetched: null
      },
      peakUsage: {
        data: null,
        loading: false,
        error: null,
        lastFetched: null
      },
      popularCombinations: {
        data: [],
        loading: false,
        error: null,
        lastFetched: null
      },
      // ✅ ADD THESE TWO
      topDownloaded: {
        data: [],
        loading: false,
        error: null,
        lastFetched: null
      },
      conversionFunnel: {
        data: null,
        loading: false,
        error: null,
        lastFetched: null
      }
    }
  },
  reducers: {
    clearFilterAnalytics: (state) => {
      state.recommended = [];
      state.trending = [];
      state.trendingTimeframe = 'week';
      state.semester = null;
      state.error = null;
      state.presetSuggestion = null;
    },
    dismissPresetSuggestion: (state) => {
      state.presetSuggestion = null;
    },
    // ✨ NEW: Clear specific admin section
    clearAdminSection: (state, action) => {
      const section = action.payload;
      if (state.admin[section]) {
        state.admin[section] = {
          data: Array.isArray(state.admin[section].data) ? [] : null,
          loading: false,
          error: null,
          lastFetched: null
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // ========================================
      // User-facing: Hybrid Filters
      // ========================================
      .addCase(fetchHybridFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHybridFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.recommended = action.payload.recommended || [];
        state.trending = action.payload.trending || [];
        state.trendingTimeframe = action.payload.trendingTimeframe || 'week';
        state.semester = action.payload.semester;
      })
      .addCase(fetchHybridFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Trending Filters
      .addCase(fetchTrendingFilters.fulfilled, (state, action) => {
        state.trending = action.payload.trending || [];
        state.semester = action.payload.semester;
      })

      // Preset Suggestion
      .addCase(checkPresetSuggestion.fulfilled, (state, action) => {
        if (action.payload?.showSuggestion) {
          state.presetSuggestion = action.payload.suggestedFilter;
        }
      })

      // ========================================
      // 📊 Admin Dashboard
      // ========================================
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.admin.dashboard.loading = true;
        state.admin.dashboard.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.admin.dashboard.loading = false;
        state.admin.dashboard.data = action.payload;
        state.admin.dashboard.lastFetched = new Date().toISOString();
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.admin.dashboard.loading = false;
        state.admin.dashboard.error = action.payload;
      })

      // ========================================
      // 👁️ Most Viewed Notes
      // ========================================
      .addCase(fetchMostViewedNotes.pending, (state) => {
        state.admin.mostViewed.loading = true;
        state.admin.mostViewed.error = null;
      })
      .addCase(fetchMostViewedNotes.fulfilled, (state, action) => {
        state.admin.mostViewed.loading = false;
        state.admin.mostViewed.data = action.payload.data || [];
        state.admin.mostViewed.lastFetched = new Date().toISOString();
      })
      .addCase(fetchMostViewedNotes.rejected, (state, action) => {
        state.admin.mostViewed.loading = false;
        state.admin.mostViewed.error = action.payload;
      })

      // ========================================
      // 🚨 Content Gaps
      // ========================================
      .addCase(fetchContentGaps.pending, (state) => {
        state.admin.contentGaps.loading = true;
        state.admin.contentGaps.error = null;
      })
      .addCase(fetchContentGaps.fulfilled, (state, action) => {
        state.admin.contentGaps.loading = false;
        state.admin.contentGaps.data = action.payload.data || [];
        state.admin.contentGaps.lastFetched = new Date().toISOString();
      })
      .addCase(fetchContentGaps.rejected, (state, action) => {
        state.admin.contentGaps.loading = false;
        state.admin.contentGaps.error = action.payload;
      })

      // ========================================
      // 📈 Subject Performance
      // ========================================
      .addCase(fetchSubjectPerformance.pending, (state) => {
        state.admin.subjectPerformance.loading = true;
        state.admin.subjectPerformance.error = null;
      })
      .addCase(fetchSubjectPerformance.fulfilled, (state, action) => {
        state.admin.subjectPerformance.loading = false;
        state.admin.subjectPerformance.data = action.payload.data || [];
        state.admin.subjectPerformance.lastFetched = new Date().toISOString();
      })
      .addCase(fetchSubjectPerformance.rejected, (state, action) => {
        state.admin.subjectPerformance.loading = false;
        state.admin.subjectPerformance.error = action.payload;
      })

      // ========================================
      // 📱 Device Analytics
      // ========================================
      .addCase(fetchDeviceAnalytics.pending, (state) => {
        state.admin.deviceAnalytics.loading = true;
        state.admin.deviceAnalytics.error = null;
      })
      .addCase(fetchDeviceAnalytics.fulfilled, (state, action) => {
        state.admin.deviceAnalytics.loading = false;
        state.admin.deviceAnalytics.data = action.payload;
        state.admin.deviceAnalytics.lastFetched = new Date().toISOString();
      })
      .addCase(fetchDeviceAnalytics.rejected, (state, action) => {
        state.admin.deviceAnalytics.loading = false;
        state.admin.deviceAnalytics.error = action.payload;
      })

      // ========================================
      // ⏰ Peak Usage Times
      // ========================================
      .addCase(fetchPeakUsageTimes.pending, (state) => {
        state.admin.peakUsage.loading = true;
        state.admin.peakUsage.error = null;
      })
      .addCase(fetchPeakUsageTimes.fulfilled, (state, action) => {
        state.admin.peakUsage.loading = false;
        state.admin.peakUsage.data = action.payload;
        state.admin.peakUsage.lastFetched = new Date().toISOString();
      })
      .addCase(fetchPeakUsageTimes.rejected, (state, action) => {
        state.admin.peakUsage.loading = false;
        state.admin.peakUsage.error = action.payload;
      })

      // ========================================
      // 🎯 Popular Filter Combinations
      // ========================================
      .addCase(fetchPopularCombinations.pending, (state) => {
        state.admin.popularCombinations.loading = true;
        state.admin.popularCombinations.error = null;
      })
      .addCase(fetchPopularCombinations.fulfilled, (state, action) => {
        state.admin.popularCombinations.loading = false;
        state.admin.popularCombinations.data = action.payload.data || [];
        state.admin.popularCombinations.lastFetched = new Date().toISOString();
      })
      .addCase(fetchPopularCombinations.rejected, (state, action) => {
        state.admin.popularCombinations.loading = false;
        state.admin.popularCombinations.error = action.payload;
      })

      // ========================================
    // 📥 Top Downloaded Notes
    // ========================================
    .addCase(fetchTopDownloadedNotes.pending, (state) => {
      state.admin.topDownloaded.loading = true;
      state.admin.topDownloaded.error = null;
    })
    .addCase(fetchTopDownloadedNotes.fulfilled, (state, action) => {
      state.admin.topDownloaded.loading = false;
      state.admin.topDownloaded.data = action.payload.data || [];
      state.admin.topDownloaded.lastFetched = new Date().toISOString();
    })
    .addCase(fetchTopDownloadedNotes.rejected, (state, action) => {
      state.admin.topDownloaded.loading = false;
      state.admin.topDownloaded.error = action.payload;
    })

    // ========================================
    // 📊 Conversion Funnel
    // ========================================
    .addCase(fetchConversionFunnel.pending, (state) => {
      state.admin.conversionFunnel.loading = true;
      state.admin.conversionFunnel.error = null;
    })
    .addCase(fetchConversionFunnel.fulfilled, (state, action) => {
      state.admin.conversionFunnel.loading = false;
      state.admin.conversionFunnel.data = action.payload.funnel || null;
      state.admin.conversionFunnel.lastFetched = new Date().toISOString();
    })
    .addCase(fetchConversionFunnel.rejected, (state, action) => {
      state.admin.conversionFunnel.loading = false;
      state.admin.conversionFunnel.error = action.payload;
    });
  }
});

export const { 
  clearFilterAnalytics, 
  dismissPresetSuggestion,
  clearAdminSection 
} = filterAnalyticsSlice.actions;

export default filterAnalyticsSlice.reducer;

// ========================================
// 🎯 SELECTORS
// ========================================

// Admin Dashboard
export const selectAdminDashboard = (state) => state.filterAnalytics.admin.dashboard;
export const selectMostViewedNotes = (state) => state.filterAnalytics.admin.mostViewed;
export const selectContentGaps = (state) => state.filterAnalytics.admin.contentGaps;
export const selectSubjectPerformance = (state) => state.filterAnalytics.admin.subjectPerformance;
export const selectDeviceAnalytics = (state) => state.filterAnalytics.admin.deviceAnalytics;
export const selectPeakUsage = (state) => state.filterAnalytics.admin.peakUsage;
export const selectPopularCombinations = (state) => state.filterAnalytics.admin.popularCombinations;
// ✅ ADD THESE TWO
export const selectTopDownloaded = (state) => state.filterAnalytics.admin.topDownloaded;
export const selectConversionFunnel = (state) => state.filterAnalytics.admin.conversionFunnel;


// Check if data is fresh (less than 5 minutes old)
export const selectIsDataFresh = (state, section) => {
  const lastFetched = state.filterAnalytics.admin[section]?.lastFetched;
  if (!lastFetched) return false;
  
  const fiveMinutes = 5 * 60 * 1000;
  return (new Date() - new Date(lastFetched)) < fiveMinutes;
};
