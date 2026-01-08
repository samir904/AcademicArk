// FRONTEND/REDUX/Slices/mongoDbHealthSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';
import { showToast } from '../../HELPERS/Toaster';

/**
 * Get MongoDB health
 */
export const getMongoDBHealth = createAsyncThunk(
    '/db/getMongoDBHealth',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/db/health');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get MongoDB health';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

/**
 * Get database statistics
 */
export const getDatabaseStats = createAsyncThunk(
    '/db/getDatabaseStats',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/db/stats');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get database stats';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

/**
 * Get performance metrics
 */
export const getPerformanceMetrics = createAsyncThunk(
    '/db/getPerformanceMetrics',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/db/performance');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get performance metrics';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

/**
 * Get connection details
 */
export const getConnectionDetails = createAsyncThunk(
    '/db/getConnectionDetails',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/db/connection');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get connection details';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

const initialState = {
    loading: false,
    error: null,
    mongodbHealth: {
        status: 'disconnected',
        connected: false,
        connectionTime: null,
        responseTime: 0,
        uptime: 0,
        collections: [],
        indexes: 0,
        dbSize: '0 MB',
        version: 'unknown',
        operations: {
            totalInserts: 0,
            totalUpdates: 0,
            totalDeletes: 0,
            totalQueries: 0
        },
        memory: {
            resident: 0,
            virtual: 0,
            mapped: 0
        }
    },
    databaseStats: {
        databases: 0,
        indexes: 0,
        collections: 0,
        dataSize: '0 MB',
        indexSize: '0 MB',
        storageSize: '0 MB'
    },
    performanceMetrics: {
        connections: {},
        network: {},
        opcounters: {},
        opcountersRepl: {}
    },
    connectionDetails: {
        host: 'localhost',
        port: 27017,
        name: 'academicark',
        readyState: 0,
        collections: 0,
        status: 'disconnected'
    }
};

const mongoDbHealthSlice = createSlice({
    name: 'mongodbHealth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Get MongoDB Health
        builder
            .addCase(getMongoDBHealth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMongoDBHealth.fulfilled, (state, action) => {
                state.loading = false;
                state.mongodbHealth = action.payload.data;
            })
            .addCase(getMongoDBHealth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Database Stats
        builder
            .addCase(getDatabaseStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDatabaseStats.fulfilled, (state, action) => {
                state.loading = false;
                state.databaseStats = action.payload.data;
            })
            .addCase(getDatabaseStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Performance Metrics
        builder
            .addCase(getPerformanceMetrics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPerformanceMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.performanceMetrics = action.payload.data;
            })
            .addCase(getPerformanceMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Connection Details
        builder
            .addCase(getConnectionDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getConnectionDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.connectionDetails = action.payload.data;
            })
            .addCase(getConnectionDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = mongoDbHealthSlice.actions;
export default mongoDbHealthSlice.reducer;