import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';
import { showToast } from '../../HELPERS/Toaster';

// ============================================
// ASYNC THUNKS
// ============================================

/**
 * Get retention funnel data
 */
export const getRetentionFunnel = createAsyncThunk(
  'retention/getFunnel',
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await axiosInstance.get(`/retention/funnel?${params}`);
      return res.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get funnel data';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Get cohort analysis data
 */
export const getCohortAnalysis = createAsyncThunk(
  'retention/getCohort',
  async ({ weeksBack = 12 } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/retention/cohort?weeksBack=${weeksBack}`);
      return res.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get cohort data';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Get engagement metrics
 */
export const getEngagementMetrics = createAsyncThunk(
  'retention/getEngagement',
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await axiosInstance.get(`/retention/engagement?${params}`);
      return res.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get engagement data';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Get retention status
 */
export const getRetentionStatus = createAsyncThunk(
  'retention/getStatus',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/retention/status');
      return res.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get status data';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Get churn risk users
 */
export const getChurnRiskUsers = createAsyncThunk(
  'retention/getChurnRisk',
  async ({ limit = 50, minChurnProbability = 0.5 } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/retention/churn-risk?limit=${limit}&minChurnProbability=${minChurnProbability}`
      );
      return res.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get churn risk users';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Get specific user retention data
 */
export const getUserRetentionData = createAsyncThunk(
  'retention/getUserData',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/retention/user/${userId}`);
      return res.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get user data';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Get user activity timeline
 */
export const getUserActivityTimeline = createAsyncThunk(
  'retention/getActivityTimeline',
  async ({ userId, daysBack = 30 } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/retention/activity/${userId}?daysBack=${daysBack}`
      );
      return res.data.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get activity timeline';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  // Funnel data
  funnel: null,
  funnelLoading: false,
  funnelError: null,

  // Cohort data
  cohort: null,
  cohortLoading: false,
  cohortError: null,

  // Engagement metrics
  engagement: null,
  engagementLoading: false,
  engagementError: null,

  // Retention status
  retentionStatus: null,
  retentionStatusLoading: false,
  retentionStatusError: null,

  // Churn risk users
  churnRiskUsers: null,
  churnRiskLoading: false,
  churnRiskError: null,

  // User retention data
  userRetention: null,
  userRetentionLoading: false,
  userRetentionError: null,

  // User activity timeline
  userActivity: null,
  userActivityLoading: false,
  userActivityError: null,

  // UI states
  selectedUserId: null,
  dateRange: { start: null, end: null },
  activeMetric: 'funnel', // funnel, cohort, engagement, status, churn
};

// ============================================
// SLICE
// ============================================

const retentionSlice = createSlice({
  name: 'retention',
  initialState,

  reducers: {
    // Clear errors
    clearFunnelError: (state) => {
      state.funnelError = null;
    },

    clearCohortError: (state) => {
      state.cohortError = null;
    },

    clearEngagementError: (state) => {
      state.engagementError = null;
    },

    clearChurnRiskError: (state) => {
      state.churnRiskError = null;
    },

    // Set selected user
    setSelectedUser: (state, action) => {
      state.selectedUserId = action.payload;
    },

    // Set date range
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },

    // Set active metric
    setActiveMetric: (state, action) => {
      state.activeMetric = action.payload;
    },

    // Reset retention data
    resetRetention: (state) => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // ============================================
    // GET FUNNEL
    // ============================================
    builder
      .addCase(getRetentionFunnel.pending, (state) => {
        state.funnelLoading = true;
        state.funnelError = null;
      })
      .addCase(getRetentionFunnel.fulfilled, (state, action) => {
        state.funnelLoading = false;
        state.funnel = action.payload;
      })
      .addCase(getRetentionFunnel.rejected, (state, action) => {
        state.funnelLoading = false;
        state.funnelError = action.payload;
      });

    // ============================================
    // GET COHORT
    // ============================================
    builder
      .addCase(getCohortAnalysis.pending, (state) => {
        state.cohortLoading = true;
        state.cohortError = null;
      })
      .addCase(getCohortAnalysis.fulfilled, (state, action) => {
        state.cohortLoading = false;
        state.cohort = action.payload;
      })
      .addCase(getCohortAnalysis.rejected, (state, action) => {
        state.cohortLoading = false;
        state.cohortError = action.payload;
      });

    // ============================================
    // GET ENGAGEMENT
    // ============================================
    builder
      .addCase(getEngagementMetrics.pending, (state) => {
        state.engagementLoading = true;
        state.engagementError = null;
      })
      .addCase(getEngagementMetrics.fulfilled, (state, action) => {
        state.engagementLoading = false;
        state.engagement = action.payload;
      })
      .addCase(getEngagementMetrics.rejected, (state, action) => {
        state.engagementLoading = false;
        state.engagementError = action.payload;
      });

    // ============================================
    // GET RETENTION STATUS
    // ============================================
    builder
      .addCase(getRetentionStatus.pending, (state) => {
        state.retentionStatusLoading = true;
        state.retentionStatusError = null;
      })
      .addCase(getRetentionStatus.fulfilled, (state, action) => {
        state.retentionStatusLoading = false;
        state.retentionStatus = action.payload;
      })
      .addCase(getRetentionStatus.rejected, (state, action) => {
        state.retentionStatusLoading = false;
        state.retentionStatusError = action.payload;
      });

    // ============================================
    // GET CHURN RISK
    // ============================================
    builder
      .addCase(getChurnRiskUsers.pending, (state) => {
        state.churnRiskLoading = true;
        state.churnRiskError = null;
      })
      .addCase(getChurnRiskUsers.fulfilled, (state, action) => {
        state.churnRiskLoading = false;
        state.churnRiskUsers = action.payload;
      })
      .addCase(getChurnRiskUsers.rejected, (state, action) => {
        state.churnRiskLoading = false;
        state.churnRiskError = action.payload;
      });

    // ============================================
    // GET USER RETENTION DATA
    // ============================================
    builder
      .addCase(getUserRetentionData.pending, (state) => {
        state.userRetentionLoading = true;
        state.userRetentionError = null;
      })
      .addCase(getUserRetentionData.fulfilled, (state, action) => {
        state.userRetentionLoading = false;
        state.userRetention = action.payload;
      })
      .addCase(getUserRetentionData.rejected, (state, action) => {
        state.userRetentionLoading = false;
        state.userRetentionError = action.payload;
      });

    // ============================================
    // GET USER ACTIVITY
    // ============================================
    builder
      .addCase(getUserActivityTimeline.pending, (state) => {
        state.userActivityLoading = true;
        state.userActivityError = null;
      })
      .addCase(getUserActivityTimeline.fulfilled, (state, action) => {
        state.userActivityLoading = false;
        state.userActivity = action.payload;
      })
      .addCase(getUserActivityTimeline.rejected, (state, action) => {
        state.userActivityLoading = false;
        state.userActivityError = action.payload;
      });
  },
});

// ============================================
// EXPORTS
// ============================================

export const {
  clearFunnelError,
  clearCohortError,
  clearEngagementError,
  clearChurnRiskError,
  setSelectedUser,
  setDateRange,
  setActiveMetric,
  resetRetention,
} = retentionSlice.actions;

export default retentionSlice.reducer;
