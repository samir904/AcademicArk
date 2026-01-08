// FRONTEND/REDUX/Slices/redisHealthSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';
import { showToast } from '../../HELPERS/Toaster';

/**
 * Get Redis health
 */
export const getRedisHealth = createAsyncThunk(
    '/cache/getRedisHealth',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/cache/health');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get Redis health';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

/**
 * Get memory statistics
 */
export const getMemoryStats = createAsyncThunk(
    '/cache/getMemoryStats',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/cache/memory');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get memory stats';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

/**
 * Get key statistics
 */
export const getKeyStats = createAsyncThunk(
    '/cache/getKeyStats',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/cache/keys');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get key stats';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

/**
 * Get hit/miss statistics
 */
export const getHitMissStats = createAsyncThunk(
    '/cache/getHitMissStats',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/cache/hits');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get hit/miss stats';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

/**
 * Get cache performance
 */
export const getCachePerformance = createAsyncThunk(
    '/cache/getCachePerformance',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/cache/performance');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to get cache performance';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

const initialState = {
    loading: false,
    error: null,
    redisHealth: {
        status: 'disconnected',
        connected: false,
        connectionTime: null,
        responseTime: 0,
        uptime: 0,
        memory: {
            used: 0,
            peak: 0,
            total: 0,
            percentage: 0,
            fragmentation: 0
        },
        clients: {
            connected: 0,
            blocked: 0
        },
        keys: {
            total: 0,
            expired: 0,
            evicted: 0
        },
        stats: {
            totalCommands: 0,
            commandsPerSec: 0,
            hitRate: '0%',
            hits: 0,
            misses: 0,
            evictions: 0
        }
    },
    memoryStats: {
        used: '0 MB',
        peak: '0 MB',
        total: '0 MB',
        percentage: 0,
        fragmentation: 0
    },
    keyStats: {
        total: 0,
        expired: 0,
        evicted: 0,
        ttlAvg: 0
    },
    hitMissStats: {
        hitRate: '0%',
        hits: 0,
        misses: 0,
        totalRequests: 0
    },
    cachePerformance: {
        commandsPerSec: 0,
        totalCommands: 0,
        evictions: 0,
        connectedClients: 0
    }
};

const redisHealthSlice = createSlice({
    name: 'redisHealth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Get Redis Health
        builder
            .addCase(getRedisHealth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRedisHealth.fulfilled, (state, action) => {
                state.loading = false;
                state.redisHealth = action.payload.data;
            })
            .addCase(getRedisHealth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Memory Stats
        builder
            .addCase(getMemoryStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMemoryStats.fulfilled, (state, action) => {
                state.loading = false;
                state.memoryStats = action.payload.data;
            })
            .addCase(getMemoryStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Key Stats
        builder
            .addCase(getKeyStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getKeyStats.fulfilled, (state, action) => {
                state.loading = false;
                state.keyStats = action.payload.data;
            })
            .addCase(getKeyStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Hit/Miss Stats
        builder
            .addCase(getHitMissStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getHitMissStats.fulfilled, (state, action) => {
                state.loading = false;
                state.hitMissStats = action.payload.data;
            })
            .addCase(getHitMissStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Cache Performance
        builder
            .addCase(getCachePerformance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCachePerformance.fulfilled, (state, action) => {
                state.loading = false;
                state.cachePerformance = action.payload.data;
            })
            .addCase(getCachePerformance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = redisHealthSlice.actions;
export default redisHealthSlice.reducer;