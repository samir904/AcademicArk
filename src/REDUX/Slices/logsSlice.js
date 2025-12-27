import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';
import { showToast } from '../../HELPERS/Toaster';

// ==================== ASYNC THUNKS ====================

/**
 * Fetch HTTP request logs
 * @param {object} param - { method, statusCode, limit, page }
 */ 
//add
export const getRequestLogs = createAsyncThunk(
    'logs/getRequestLogs',
    async ({ method = '', statusCode = '', limit = 50, page = 1 }, { rejectWithValue }) => {
        try {
            let url = `/logs/requests?limit=${limit}&page=${page}`;
            if (method) url += `&method=${method}`;
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

/**
 * Fetch console logs
 * @param {object} param - { level, limit, page }
 */
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

/**
 * Fetch log statistics
 * @param {number} days - Number of days to analyze (default: 7)
 */
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
/**
 * Delete single request log
 */
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

/**
 * Delete single console log
 */
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

/**
 * Delete old request logs (older than X days)
 */
export const deleteOldRequestLogs = createAsyncThunk(
    'logs/deleteOldRequestLogs',
    async (days = 7, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/logs/requests/cleanup/old?days=${days}`);
            showToast.success(`Deleted ${res.data.data.deletedCount} old logs`);
            return res.data;
        } catch (error) {
            showToast.error(error?.response?.data?.message || 'Failed to delete logs');
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

/**
 * Delete old console logs (older than X days)
 */
export const deleteOldConsoleLogs = createAsyncThunk(
    'logs/deleteOldConsoleLogs',
    async (days = 7, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/logs/console/cleanup/old?days=${days}`);
            showToast.success(`Deleted ${res.data.data.deletedCount} old console logs`);
            return res.data;
        } catch (error) {
            showToast.error(error?.response?.data?.message || 'Failed to delete logs');
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

/**
 * Clear all logs (DANGEROUS!)
 */
export const clearAllLogs = createAsyncThunk(
    'logs/clearAllLogs',
    async (_, { rejectWithValue }) => {
        try {
            const confirmed = window.confirm(
                '⚠️ WARNING: This will DELETE ALL LOGS permanently! Are you sure?'
            );
            if (!confirmed) return rejectWithValue('Cancelled');

            const res = await axiosInstance.delete(`/logs/cleanup/all?confirm=true`);
            showToast.success('All logs cleared');
            return res.data;
        } catch (error) {
            showToast.error(error?.response?.data?.message || 'Failed to clear logs');
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


// ==================== INITIAL STATE ====================

const initialState = {
    // Request Logs
    requestLogs: [],
    requestLogsPagination: null,
    requestLoading: false,
    requestError: null,
    requestFilters: {
        method: '',
        statusCode: '',
        limit: 50,
        page: 1
    },

    // Console Logs
    consoleLogs: [],
    consoleLogsPagination: null,
    consoleLoading: false,
    consoleError: null,
    consoleFilters: {
        level: '',
        limit: 50,
        page: 1
    },

    // Statistics
    logStats: {
        requestStats: [],
        consoleStats: []
    },
    statsLoading: false,
    statsError: null,

    // UI State
    activeLogTab: 'requests', // 'requests' or 'console'
    autoRefresh: false,
    refreshInterval: 10000 // 10 seconds
};

// ==================== SLICE ====================

const logsSlice = createSlice({
    name: 'logs',
    initialState,
    reducers: {
        // Request Logs Reducers
        setRequestFilters: (state, action) => {
            state.requestFilters = { ...state.requestFilters, ...action.payload, page: 1 };
        },
        setRequestPage: (state, action) => {
            state.requestFilters.page = action.payload;
        },
        clearRequestError: (state) => {
            state.requestError = null;
        },
        clearRequestLogs: (state) => {
            state.requestLogs = [];
            state.requestLogsPagination = null;
        },

        // Console Logs Reducers
        setConsoleFilters: (state, action) => {
            state.consoleFilters = { ...state.consoleFilters, ...action.payload, page: 1 };
        },
        setConsolePage: (state, action) => {
            state.consoleFilters.page = action.payload;
        },
        clearConsoleError: (state) => {
            state.consoleError = null;
        },
        clearConsoleLogs: (state) => {
            state.consoleLogs = [];
            state.consoleLogsPagination = null;
        },

        // UI Reducers
        setActiveLogTab: (state, action) => {
            state.activeLogTab = action.payload;
        },
        setAutoRefresh: (state, action) => {
            state.autoRefresh = action.payload;
        },
        setRefreshInterval: (state, action) => {
            state.refreshInterval = action.payload;
        },
        clearStats: (state) => {
            state.logStats = { requestStats: [], consoleStats: [] };
        },
        clearRequestError: (state) => { state.requestError = null; },
        clearConsoleError: (state) => { state.consoleError = null; },
        // Remove deleted log from list
        removeRequestLog: (state, action) => {
            state.requestLogs = state.requestLogs.filter(log => log._id !== action.payload);
        },
        removeConsoleLog: (state, action) => {
            state.consoleLogs = state.consoleLogs.filter(log => log._id !== action.payload);
        }

    },

    extraReducers: (builder) => {
        builder
            // ==================== GET REQUEST LOGS ====================
            .addCase(getRequestLogs.pending, (state) => {
                state.requestLoading = true;
                state.requestError = null;
            })
            .addCase(getRequestLogs.fulfilled, (state, action) => {
                state.requestLoading = false;
                state.requestLogs = action.payload.data.logs;
                state.requestLogsPagination = {
                    total: action.payload.data.total,
                    pages: action.payload.data.pages,
                    currentPage: action.payload.data.currentPage || state.requestFilters.page
                };
            })
            .addCase(getRequestLogs.rejected, (state, action) => {
                state.requestLoading = false;
                state.requestError = action.payload;
            })

            // ==================== GET CONSOLE LOGS ====================
            .addCase(getConsoleLogs.pending, (state) => {
                state.consoleLoading = true;
                state.consoleError = null;
            })
            .addCase(getConsoleLogs.fulfilled, (state, action) => {
                state.consoleLoading = false;
                state.consoleLogs = action.payload.data.logs;
                state.consoleLogsPagination = {
                    total: action.payload.data.total,
                    pages: action.payload.data.pages,
                    currentPage: action.payload.data.currentPage || state.consoleFilters.page
                };
            })
            .addCase(getConsoleLogs.rejected, (state, action) => {
                state.consoleLoading = false;
                state.consoleError = action.payload;
            })

            // ==================== GET LOG STATS ====================
            .addCase(getLogStats.pending, (state) => {
                state.statsLoading = true;
                state.statsError = null;
            })
            .addCase(getLogStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.logStats = action.payload.data;
            })
            .addCase(getLogStats.rejected, (state, action) => {
                state.statsLoading = false;
                state.statsError = action.payload;
            })
            // Delete request log cases
            .addCase(deleteRequestLog.pending, (state) => {
                state.requestLoading = true;
            })
            .addCase(deleteRequestLog.fulfilled, (state, action) => {
                state.requestLoading = false;
                state.requestLogs = state.requestLogs.filter(log => log._id !== action.payload.data._id);
            })
            .addCase(deleteRequestLog.rejected, (state, action) => {
                state.requestLoading = false;
                state.requestError = action.payload;
            })

            // Delete console log cases
            .addCase(deleteConsoleLog.pending, (state) => {
                state.consoleLoading = true;
            })
            .addCase(deleteConsoleLog.fulfilled, (state, action) => {
                state.consoleLoading = false;
                state.consoleLogs = state.consoleLogs.filter(log => log._id !== action.payload.data._id);
            })
            .addCase(deleteConsoleLog.rejected, (state, action) => {
                state.consoleLoading = false;
                state.consoleError = action.payload;
            })

            // Delete old logs cases
            .addCase(deleteOldRequestLogs.pending, (state) => {
                state.requestLoading = true;
            })
            .addCase(deleteOldRequestLogs.fulfilled, (state) => {
                state.requestLoading = false;
                // Refresh logs
                state.requestLogs = [];
            })
            .addCase(deleteOldRequestLogs.rejected, (state, action) => {
                state.requestLoading = false;
                state.requestError = action.payload;
            })

            .addCase(deleteOldConsoleLogs.pending, (state) => {
                state.consoleLoading = true;
            })
            .addCase(deleteOldConsoleLogs.fulfilled, (state) => {
                state.consoleLoading = false;
                state.consoleLogs = [];
            })
            .addCase(deleteOldConsoleLogs.rejected, (state, action) => {
                state.consoleLoading = false;
                state.consoleError = action.payload;
            })

            // Clear all
            .addCase(clearAllLogs.pending, (state) => {
                state.requestLoading = true;
            })
            .addCase(clearAllLogs.fulfilled, (state) => {
                state.requestLoading = false;
                state.requestLogs = [];
                state.consoleLogs = [];
                state.logStats = { requestStats: [], consoleStats: [] };
            })
            .addCase(clearAllLogs.rejected, (state, action) => {
                state.requestLoading = false;
                state.requestError = action.payload;
            });

    }
});

// ==================== EXPORTS ====================

export const {
    setRequestFilters,
    setRequestPage,
    clearRequestError,
    clearRequestLogs,
    setConsoleFilters,
    setConsolePage,
    clearConsoleError,
    clearConsoleLogs,
    setActiveLogTab,
    setAutoRefresh,
    setRefreshInterval,
    clearStats,
    removeRequestLog, 
    removeConsoleLog
} = logsSlice.actions;

export default logsSlice.reducer;
