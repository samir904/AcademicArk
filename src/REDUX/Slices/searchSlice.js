// REDUX/Slices/searchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';
import { showToast } from '../../HELPERS/Toaster';

// Async thunks
export const searchNotes = createAsyncThunk(
    "/search/searchNotes",
    async (searchParams, { rejectWithValue }) => {
        try {
            const queryString = new URLSearchParams(searchParams).toString();
            const res = await axiosInstance.get(`/search/search?${queryString}`);

            // 🔥 LOG ANALYTICS (fire-and-forget)
            const analyticsRes = await axiosInstance.post(
                "/search/analytics/log",
                {
                    rawQuery: searchParams.query,
                    normalizedQuery: searchParams.query
                        ?.toLowerCase()
                        .trim()
                        .replace(/\s+/g, " "),
                    resultsCount: res.data.data.notes.length,
                    intent: res.data.data.intent
                },
                { withCredentials: true }
            );

            return {
                ...res.data,
                searchAnalyticsId: analyticsRes.data.searchAnalyticsId || null
            };
        } catch (error) {
            const message =
                error?.response?.data?.message || "Failed to search notes";
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const getTrendingNotes = createAsyncThunk('/search/getTrendingNotes', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/search/trending');
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get trending notes';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const getPopularNotes = createAsyncThunk('/search/getPopularNotes', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/search/popular');
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get popular notes';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

const initialState = {
    loading: false,
    error: null,
    // 🔥 ADD THIS
    query: "",

    searchResults: [],
    trendingNotes: [],
    popularNotes: [],
    pagination: null,
    filters: {},
    suggestions: {},
    // 🔥 ADD THIS
    searchAnalyticsId: null,
    hasSubmitted: false,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.query = action.payload;
        },

        clearSearch: (state) => {
            state.query = "";
            state.searchResults = [];
            state.pagination = null;
            state.filters = {};
            state.error = null;
            state.searchAnalyticsId = null;
            state.hasSubmitted = false;
        },

        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        clearError: (state) => {
            state.error = null;
        },
        resetResultsOnly: (state) => {
            state.searchResults = [];
            state.pagination = null;
            state.error = null;
            // ❗ DO NOT touch hasSubmitted or searchAnalyticsId
        }
    },

    extraReducers: (builder) => {
        builder
            // Search Notes
            .addCase(searchNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.hasSubmitted = true; // 🔥 IMPORTANT
                state.searchResults = action.payload.data.notes;
                state.pagination = action.payload.data.pagination;
                state.filters = action.payload.data.filters;
                state.suggestions = action.payload.data.suggestions;
                // 🔑 STORE THIS
                state.searchAnalyticsId = action.payload.searchAnalyticsId;
            })
            .addCase(searchNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Trending Notes
            .addCase(getTrendingNotes.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTrendingNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.trendingNotes = action.payload.data;
            })
            .addCase(getTrendingNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Popular Notes
            .addCase(getPopularNotes.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPopularNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.popularNotes = action.payload.data;
            })
            .addCase(getPopularNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearSearch, setSearchQuery, resetResultsOnly,setFilters, clearError } = searchSlice.actions;
export default searchSlice.reducer;
