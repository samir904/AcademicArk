// REDUX/Slices/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';
import { showToast } from '../../HELPERS/Toaster';

// Async thunks
export const getDashboardStats = createAsyncThunk('/admin/getDashboardStats', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/admin/dashboard/stats');
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get dashboard stats';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const getAllUsers = createAsyncThunk('/admin/getAllUsers', async ({ page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get users';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const getAllNotesAdmin = createAsyncThunk('/admin/getAllNotes', async ({ page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/admin/notes?page=${page}&limit=${limit}&search=${search}`);
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get notes';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const deleteUser = createAsyncThunk('/admin/deleteUser', async (userId, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.delete(`/admin/users/${userId}`);
        showToast.success('User deleted successfully');
        return { userId, ...res.data };
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to delete user';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const deleteNoteAdmin = createAsyncThunk('/admin/deleteNote', async (noteId, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.delete(`/admin/notes/${noteId}`);
        showToast.success('Note deleted successfully');
        return { noteId, ...res.data };
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to delete note';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const updateUserRole = createAsyncThunk('/admin/updateUserRole', async ({ userId, role }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.put(`/admin/users/${userId}/role`, { role });
        showToast.success('User role updated successfully');
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to update user role';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const getRecentActivity = createAsyncThunk('/admin/getRecentActivity', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/admin/activity');
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get recent activity';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const getServerMetrics = createAsyncThunk(
    'admin/getServerMetrics',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/admin/server-metrics');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get server metrics';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
)

export const getSessionMetrics = createAsyncThunk(
    '/admin/getSessionMetrics',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/admin/session-metrics');
            return res.data;
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to get session metrics';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
)

export const getSessionHistory = createAsyncThunk('/admin/getSessionHistory', async (days = 30, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/admin/session-history?days=${days}`);
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get session history';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const getWeeklyComparison = createAsyncThunk('/admin/getWeeklyComparison', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/admin/weekly-comparison');
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get weekly comparison';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const getTrafficPattern = createAsyncThunk('/admin/getTrafficPattern', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/admin/traffic-pattern');
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get traffic pattern';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const getMilestoneStats = createAsyncThunk(
    '/admin/getMilestoneStats',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/public/stats');
            return {
                totalUsers: res.data.data.totalUsers,
                totalNotes: res.data.data.totalNotes,
                totalDownloads: res.data.data.totalDownloads
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const getAdminLogs = createAsyncThunk(
    '/admin/getAdminLogs',
    async ({ days = 7, action = '', page = 1 }, { rejectWithValue }) => {
        try {
            let url = `/admin/admin-logs?days=${days}&page=${page}`;
            if (action) url += `&action=${action}`;

            const res = await axiosInstance.get(url);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

/**
 * Get overall retention metrics
 * Returns: retention rate, churn rate, active users, new users, cohort data
 */
export const getRetentionMetrics = createAsyncThunk(
  '/admin/getRetentionMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/admin/retention-metrics');
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get retention metrics';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Get churn analysis (users who left)
 * @param {number} days - Days to analyze (default: 30)
 */
export const getChurnAnalysis = createAsyncThunk(
  '/admin/getChurnAnalysis',
  async (days = 30, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/admin/churn-analysis?days=${days}`);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get churn analysis';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Get user lifetime value metrics
 * Returns: avg session duration, avg engagement, avg user lifetime
 */
export const getUserLifetimeValue = createAsyncThunk(
  '/admin/getUserLifetimeValue',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/admin/ltv-metrics');
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get LTV metrics';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Get all user cohorts
 * Returns: Array of cohorts with retention data
 */
export const getAllCohorts = createAsyncThunk(
  '/admin/getAllCohorts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/admin/retention/cohorts');
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get cohorts';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Calculate retention for a specific month
 * @param {object} param - { year, month }
 */
export const calculateCohortRetention = createAsyncThunk(
  '/admin/calculateCohortRetention',
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/admin/retention/calculate/${year}/${month}`
      );
      showToast.success('Cohort retention calculated successfully');
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to calculate cohort retention';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Get specific cohort details with all users
 * @param {string} cohortName - Cohort name (e.g., "Dec-2024")
 */
export const getCohortDetails = createAsyncThunk(
  '/admin/getCohortDetails',
  async (cohortName, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/admin/retention/cohorts/${cohortName}`);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get cohort details';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
    loading: false,
    error: null,
    dashboardStats: null,
    users: [],
    notes: [],
    usersPagination: null,
    notesPagination: null,
    recentActivity: null,
    serverMetrics: null,
    sessionMetrics: null,
    sessionHistory: null,
    weeklyComparison: null,
    trafficPattern: null,
    milestoneStats: { totalUsers: 0, totalNotes: 0, totalDownloads: 0 },
    adminLogs: [],
    adminLogsPagination: null,
    // ========== NEW: RETENTION STATE ==========
  retentionMetrics: {
    retentionRate: '0%',
    churnRate: '0%',
    usersStartOfMonth: 0,
    newUsersThisMonth: 0,
    activeUsersThisMonth: 0,
    cohorts: []
  },
  churnAnalysis: {
    period: '30 days',
    totalUsers: 0,
    activeUsers: 0,
    churnedUsers: 0,
    churnRate: '0%',
    atRiskCount: 0,
    atRiskUsers: []
  },
  ltv: {
    avgSessionDuration: 0,
    avgEngagement: 0,
    avgUserLifetime: 0,
    estimatedLTV: 'N/A'
  },
  cohorts: [],
  selectedCohort: null,
  retentionLoading: false,
  retentionError: null
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearUsers: (state) => {
            state.users = [];
            state.usersPagination = null;
        },
        clearNotes: (state) => {
            state.notes = [];
            state.notesPagination = null;
        },
        clearRetentionError: (state) => {
      state.retentionError = null;
    },
    clearCohorts: (state) => {
      state.cohorts = [];
      state.selectedCohort = null;
    }
    },
    extraReducers: (builder) => {
        builder
            // Get Dashboard Stats
            .addCase(getDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardStats = action.payload.data;
            })
            .addCase(getDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get All Users
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data.users;
                state.usersPagination = action.payload.data.pagination;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get All Notes
            .addCase(getAllNotesAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllNotesAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = action.payload.data.notes;
                state.notesPagination = action.payload.data.pagination;
            })
            .addCase(getAllNotesAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user._id !== action.payload.userId);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Note
            .addCase(deleteNoteAdmin.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteNoteAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = state.notes.filter(note => note._id !== action.payload.noteId);
            })
            .addCase(deleteNoteAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update User Role
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload.data;
                state.users = state.users.map(user =>
                    user._id === updatedUser._id ? updatedUser : user
                );
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Recent Activity
            .addCase(getRecentActivity.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRecentActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.recentActivity = action.payload.data;
            })
            .addCase(getRecentActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //server metrics extra reducer
            .addCase(getServerMetrics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getServerMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.serverMetrics = action.payload.data;
            })
            .addCase(getServerMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getSessionMetrics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSessionMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.sessionMetrics = action.payload.data;
            })
            .addCase(getSessionMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getSessionHistory.fulfilled, (state, action) => {
                state.sessionHistory = action.payload.data;
            })
            .addCase(getWeeklyComparison.fulfilled, (state, action) => {
                state.weeklyComparison = action.payload.data;
            })
            .addCase(getTrafficPattern.fulfilled, (state, action) => {
                state.trafficPattern = action.payload.data;
            })
            .addCase(getMilestoneStats.fulfilled, (state, action) => {
                state.milestoneStats = action.payload;
            })
            .addCase(getAdminLogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.adminLogs = action.payload.data;
                state.adminLogsPagination = action.payload.pagination;
            })
            .addCase(getAdminLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getRetentionMetrics.pending, (state) => {
        state.retentionLoading = true;
        state.retentionError = null;
      })
      .addCase(getRetentionMetrics.fulfilled, (state, action) => {
        state.retentionLoading = false;
        state.retentionMetrics = action.payload.data;
      })
      .addCase(getRetentionMetrics.rejected, (state, action) => {
        state.retentionLoading = false;
        state.retentionError = action.payload;
      })

      // ========== NEW: CHURN ANALYSIS ==========
      .addCase(getChurnAnalysis.pending, (state) => {
        state.retentionLoading = true;
        state.retentionError = null;
      })
      .addCase(getChurnAnalysis.fulfilled, (state, action) => {
        state.retentionLoading = false;
        state.churnAnalysis = action.payload.data;
      })
      .addCase(getChurnAnalysis.rejected, (state, action) => {
        state.retentionLoading = false;
        state.retentionError = action.payload;
      })

      // ========== NEW: USER LIFETIME VALUE ==========
      .addCase(getUserLifetimeValue.pending, (state) => {
        state.retentionLoading = true;
        state.retentionError = null;
      })
      .addCase(getUserLifetimeValue.fulfilled, (state, action) => {
        state.retentionLoading = false;
        state.ltv = action.payload.data;
      })
      .addCase(getUserLifetimeValue.rejected, (state, action) => {
        state.retentionLoading = false;
        state.retentionError = action.payload;
      })

      // ========== NEW: GET ALL COHORTS ==========
      .addCase(getAllCohorts.pending, (state) => {
        state.retentionLoading = true;
        state.retentionError = null;
      })
      .addCase(getAllCohorts.fulfilled, (state, action) => {
        state.retentionLoading = false;
        state.cohorts = action.payload.data;
      })
      .addCase(getAllCohorts.rejected, (state, action) => {
        state.retentionLoading = false;
        state.retentionError = action.payload;
      })

      // ========== NEW: CALCULATE COHORT ==========
      .addCase(calculateCohortRetention.pending, (state) => {
        state.retentionLoading = true;
        state.retentionError = null;
      })
      .addCase(calculateCohortRetention.fulfilled, (state, action) => {
        state.retentionLoading = false;
        // Add new cohort to beginning of list
        if (action.payload.data.cohort) {
          state.cohorts = [action.payload.data.cohort, ...state.cohorts];
        }
      })
      .addCase(calculateCohortRetention.rejected, (state, action) => {
        state.retentionLoading = false;
        state.retentionError = action.payload;
      })

      // ========== NEW: GET COHORT DETAILS ==========
      .addCase(getCohortDetails.pending, (state) => {
        state.retentionLoading = true;
        state.retentionError = null;
      })
      .addCase(getCohortDetails.fulfilled, (state, action) => {
        state.retentionLoading = false;
        state.selectedCohort = action.payload.data;
      })
      .addCase(getCohortDetails.rejected, (state, action) => {
        state.retentionLoading = false;
        state.retentionError = action.payload;
      });


    }
});

export const { clearError, clearUsers, clearNotes, clearRetentionError, clearCohorts } = adminSlice.actions;
export default adminSlice.reducer;
