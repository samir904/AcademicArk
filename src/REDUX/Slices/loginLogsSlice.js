import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';
import { showToast } from '../../HELPERS/Toaster';

// ============================================
// ASYNC THUNKS
// ============================================

/**
 * Get current user's login history
 */
export const getMyLoginHistory = createAsyncThunk(
  'loginLogs/getMyLoginHistory',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/login-logs/my-history?page=${page}&limit=${limit}`
      );
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get login history';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Get all IP addresses user logged in from
 */
export const getMyIPs = createAsyncThunk(
  'loginLogs/getMyIPs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/login-logs/my-ips');
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get IPs';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Get login analytics (stats)
 */
export const getLoginAnalytics = createAsyncThunk(
  'loginLogs/getLoginAnalytics',
  async ({ days = 7 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/login-logs/analytics?days=${days}`
      );
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get analytics';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Get all login logs (ADMIN ONLY)
 */
export const getAllLoginLogs = createAsyncThunk(
  'loginLogs/getAllLoginLogs',
  async ({ page = 1, limit = 20, status = 'success' }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/login-logs/all?page=${page}&limit=${limit}&status=${status}`
      );
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get logs';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Logout from specific device/session
 */
export const logoutFromDevice = createAsyncThunk(
  'loginLogs/logoutFromDevice',
  async (sessionId, { rejectWithValue }) => {
    try {
      // This would be a backend endpoint to logout from specific device
      const res = await axiosInstance.post('/login-logs/logout-device', { sessionId });
      showToast.success('Device logged out successfully');
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to logout';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

/**
 * Block/Unblock an IP address
 */
export const blockIPAddress = createAsyncThunk(
  'loginLogs/blockIPAddress',
  async ({ ipAddress, action }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/login-logs/block-ip', {
        ipAddress,
        action // 'block' or 'unblock'
      });
      showToast.success(`IP ${action === 'block' ? 'blocked' : 'unblocked'}`);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update IP status';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);
// Add these after existing async thunks

export const getLoginsByDeviceStats = createAsyncThunk(
  'loginLogs/getLoginsByDeviceStats',
  async ({ days = 30 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/login-logs/by-device?days=${days}`
      );
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get device stats';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getLoginsByBrowserStats = createAsyncThunk(
  'loginLogs/getLoginsByBrowserStats',
  async ({ days = 30 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/login-logs/by-browser?days=${days}`
      );
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get browser stats';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getSuspiciousLoginsData = createAsyncThunk(
  'loginLogs/getSuspiciousLogins',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/login-logs/suspicious');
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get suspicious logins';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getUserIPsData = createAsyncThunk(
  'loginLogs/getUserIPs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/login-logs/my-ips');
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get IPs';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);


// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  // Login history
  loginHistory: [],
  loginHistoryLoading: false,
  loginHistoryError: null,
  loginHistoryPagination: null,

  // IP addresses
  myIPs: [],
  myIPsLoading: false,
  myIPsError: null,

  // Analytics/Stats
  loginAnalytics: null,
  analyticsLoading: false,
  analyticsError: null,
  analyticsTimeRange: 7, // days

  // All logs (admin)
  allLoginLogs: [],
  allLogsLoading: false,
  allLogsError: null,
  allLogsPagination: null,

  // Device management
  selectedSession: null,
  logoutDeviceLoading: false,

  // IP blocking
  blockedIPs: [],
  blockingLoading: false,

  // UI states
  activeTab: 'history', // history, devices, analytics
  selectedDevice: null,

  // NEW: Device stats
  deviceStats: [],
  deviceStatsLoading: false,
  deviceStatsError: null,

  // NEW: Browser stats
  browserStats: [],
  browserStatsLoading: false,
  browserStatsError: null,

  // NEW: Suspicious logins
  suspiciousLogins: [],
  suspiciousLoginsLoading: false,
  suspiciousLoginsError: null,

  // NEW: User IPs
  userIPs: [],
  userIPsLoading: false,
  userIPsError: null,
};

// ============================================
// SLICE
// ============================================

const loginLogsSlice = createSlice({
  name: 'loginLogs',
  initialState,

  reducers: {
    // Clear errors
    clearLoginHistoryError: (state) => {
      state.loginHistoryError = null;
    },

    clearAnalyticsError: (state) => {
      state.analyticsError = null;
    },

    clearAllLogsError: (state) => {
      state.allLogsError = null;
    },

    // Set active tab
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    // Select a device/session
    selectDevice: (state, action) => {
      state.selectedDevice = action.payload;
    },

    // Reset login logs
    resetLoginLogs: (state) => {
      return initialState;
    },

    // Set analytics time range
    setAnalyticsTimeRange: (state, action) => {
      state.analyticsTimeRange = action.payload;
    },
    // NEW: Add these
    clearDeviceStatsError: (state) => {
      state.deviceStatsError = null;
    },

    clearBrowserStatsError: (state) => {
      state.browserStatsError = null;
    },

    clearSuspiciousLoginsError: (state) => {
      state.suspiciousLoginsError = null;
    },

    clearUserIPsError: (state) => {
      state.userIPsError = null;
    },
  },

  extraReducers: (builder) => {
    // ============================================
    // GET MY LOGIN HISTORY
    // ============================================
    builder
      .addCase(getMyLoginHistory.pending, (state) => {
        state.loginHistoryLoading = true;
        state.loginHistoryError = null;
      })
      .addCase(getMyLoginHistory.fulfilled, (state, action) => {
        state.loginHistoryLoading = false;
        state.loginHistory = action.payload.data;
        state.loginHistoryPagination = action.payload.pagination;
      })
      .addCase(getMyLoginHistory.rejected, (state, action) => {
        state.loginHistoryLoading = false;
        state.loginHistoryError = action.payload;
      });

    // ============================================
    // GET MY IPs
    // ============================================
    builder
      .addCase(getMyIPs.pending, (state) => {
        state.myIPsLoading = true;
        state.myIPsError = null;
      })
      .addCase(getMyIPs.fulfilled, (state, action) => {
        state.myIPsLoading = false;
        state.myIPs = action.payload.data;
      })
      .addCase(getMyIPs.rejected, (state, action) => {
        state.myIPsLoading = false;
        state.myIPsError = action.payload;
      });

    // ============================================
    // GET LOGIN ANALYTICS
    // ============================================
    builder
      .addCase(getLoginAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.analyticsError = null;
      })
      .addCase(getLoginAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.loginAnalytics = action.payload.data;
      })
      .addCase(getLoginAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.analyticsError = action.payload;
      });

    // ============================================
    // GET ALL LOGIN LOGS (ADMIN)
    // ============================================
    builder
      .addCase(getAllLoginLogs.pending, (state) => {
        state.allLogsLoading = true;
        state.allLogsError = null;
      })
      .addCase(getAllLoginLogs.fulfilled, (state, action) => {
        state.allLogsLoading = false;
        state.allLoginLogs = action.payload.data;
        state.allLogsPagination = action.payload.pagination;
      })
      .addCase(getAllLoginLogs.rejected, (state, action) => {
        state.allLogsLoading = false;
        state.allLogsError = action.payload;
      });

    // ============================================
    // LOGOUT FROM DEVICE
    // ============================================
    builder
      .addCase(logoutFromDevice.pending, (state) => {
        state.logoutDeviceLoading = true;
      })
      .addCase(logoutFromDevice.fulfilled, (state, action) => {
        state.logoutDeviceLoading = false;
        // Remove the session from login history
        state.loginHistory = state.loginHistory.filter(
          log => log._id !== action.payload.sessionId
        );
      })
      .addCase(logoutFromDevice.rejected, (state, action) => {
        state.logoutDeviceLoading = false;
        state.loginHistoryError = action.payload;
      });

    // ============================================
    // BLOCK IP ADDRESS
    // ============================================
    builder
      .addCase(blockIPAddress.pending, (state) => {
        state.blockingLoading = true;
      })
      .addCase(blockIPAddress.fulfilled, (state, action) => {
        state.blockingLoading = false;
        // Update blocked IPs list
        state.blockedIPs = action.payload.data.blockedIPs || [];
      })
      .addCase(blockIPAddress.rejected, (state, action) => {
        state.blockingLoading = false;
      });

      // ============================================
// GET DEVICE STATS
// ============================================
builder
  .addCase(getLoginsByDeviceStats.pending, (state) => {
    state.deviceStatsLoading = true;
    state.deviceStatsError = null;
  })
  .addCase(getLoginsByDeviceStats.fulfilled, (state, action) => {
    state.deviceStatsLoading = false;
    state.deviceStats = action.payload.data;
  })
  .addCase(getLoginsByDeviceStats.rejected, (state, action) => {
    state.deviceStatsLoading = false;
    state.deviceStatsError = action.payload;
  });

// ============================================
// GET BROWSER STATS
// ============================================
builder
  .addCase(getLoginsByBrowserStats.pending, (state) => {
    state.browserStatsLoading = true;
    state.browserStatsError = null;
  })
  .addCase(getLoginsByBrowserStats.fulfilled, (state, action) => {
    state.browserStatsLoading = false;
    state.browserStats = action.payload.data;
  })
  .addCase(getLoginsByBrowserStats.rejected, (state, action) => {
    state.browserStatsLoading = false;
    state.browserStatsError = action.payload;
  });

// ============================================
// GET SUSPICIOUS LOGINS
// ============================================
builder
  .addCase(getSuspiciousLoginsData.pending, (state) => {
    state.suspiciousLoginsLoading = true;
    state.suspiciousLoginsError = null;
  })
  .addCase(getSuspiciousLoginsData.fulfilled, (state, action) => {
    state.suspiciousLoginsLoading = false;
    state.suspiciousLogins = action.payload.data;
  })
  .addCase(getSuspiciousLoginsData.rejected, (state, action) => {
    state.suspiciousLoginsLoading = false;
    state.suspiciousLoginsError = action.payload;
  });

// ============================================
// GET USER IPS
// ============================================
builder
  .addCase(getUserIPsData.pending, (state) => {
    state.userIPsLoading = true;
    state.userIPsError = null;
  })
  .addCase(getUserIPsData.fulfilled, (state, action) => {
    state.userIPsLoading = false;
    state.userIPs = action.payload.data;
  })
  .addCase(getUserIPsData.rejected, (state, action) => {
    state.userIPsLoading = false;
    state.userIPsError = action.payload;
  });

  },
});

// ============================================
// EXPORTS
// ============================================

export const {
  clearLoginHistoryError,
  clearAnalyticsError,
  clearAllLogsError,
  setActiveTab,
  selectDevice,
  resetLoginLogs,
  setAnalyticsTimeRange,
  clearDeviceStatsError,
  clearBrowserStatsError,
  clearSuspiciousLoginsError,
  clearUserIPsError,
} = loginLogsSlice.actions;

export default loginLogsSlice.reducer;
