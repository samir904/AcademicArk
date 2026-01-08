// FRONTEND/REDUX/Slices/queryMetricsSlice.js - NEW FILE

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';
import { showToast } from '../../HELPERS/Toaster';

/**
 * Get overall query metrics
 */
export const getOverallQueryMetrics = createAsyncThunk(
    '/query-metrics/getOverallQueryMetrics',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/query-metrics/overall');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get query metrics';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

/**
 * Get query metrics by route
 */
export const getQueryMetricsByRoute = createAsyncThunk(
    '/query-metrics/getQueryMetricsByRoute',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/query-metrics/by-route');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get route metrics';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

/**
 * Get query metrics by collection
 */
export const getQueryMetricsByCollection = createAsyncThunk(
    '/query-metrics/getQueryMetricsByCollection',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/query-metrics/by-collection');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get collection metrics';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

/**
 * Get slow queries
 */
export const getSlowQueries = createAsyncThunk(
    '/query-metrics/getSlowQueries',
    async (limit = 20, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/query-metrics/slow-queries?limit=${limit}`);
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get slow queries';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

/**
 * Get detailed query report
 */
export const getDetailedQueryReport = createAsyncThunk(
    '/query-metrics/getDetailedQueryReport',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/query-metrics/report');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get query report';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

/**
 * Reset query metrics
 */
export const resetQueryMetrics = createAsyncThunk(
    '/query-metrics/resetQueryMetrics',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post('/query-metrics/reset');
            showToast.success('Metrics reset successfully');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to reset metrics';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

const initialState = {
    loading: false,
    error: null,
    overall: {
        totalQueries: 0,
        avgQueryTime: 0,
        totalQueryTime: 0,
        routeCount: 0,
        collectionCount: 0,
        slowQueriesCount: 0
    },
    byRoute: {},
    byCollection: {},
    slowQueries: [],
    detailedReport: null
};

const queryMetricsSlice = createSlice({
    name: 'queryMetrics',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Get Overall Query Metrics
        builder
            .addCase(getOverallQueryMetrics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOverallQueryMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.overall = action.payload.data;
            })
            .addCase(getOverallQueryMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Query Metrics by Route
        builder
            .addCase(getQueryMetricsByRoute.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQueryMetricsByRoute.fulfilled, (state, action) => {
                state.loading = false;
                state.byRoute = action.payload.data;
            })
            .addCase(getQueryMetricsByRoute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Query Metrics by Collection
        builder
            .addCase(getQueryMetricsByCollection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQueryMetricsByCollection.fulfilled, (state, action) => {
                state.loading = false;
                state.byCollection = action.payload.data;
            })
            .addCase(getQueryMetricsByCollection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Slow Queries
        builder
            .addCase(getSlowQueries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSlowQueries.fulfilled, (state, action) => {
                state.loading = false;
                state.slowQueries = action.payload.data.queries;
            })
            .addCase(getSlowQueries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Detailed Query Report
        builder
            .addCase(getDetailedQueryReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDetailedQueryReport.fulfilled, (state, action) => {
                state.loading = false;
                state.detailedReport = action.payload.data;
                // Also update individual data
                state.overall = action.payload.data.overall;
                state.byRoute = action.payload.data.byRoute;
                state.byCollection = action.payload.data.byCollection;
                state.slowQueries = action.payload.data.slowQueries;
            })
            .addCase(getDetailedQueryReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Reset Query Metrics
        builder
            .addCase(resetQueryMetrics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetQueryMetrics.fulfilled, (state) => {
                state.loading = false;
                state.overall = initialState.overall;
                state.byRoute = {};
                state.byCollection = {};
                state.slowQueries = [];
            })
            .addCase(resetQueryMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = queryMetricsSlice.actions;
export default queryMetricsSlice.reducer;
