import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

/* =====================================================
   📊 ADMIN ANALYTICS THUNKS
===================================================== */

/**
 * ❌ Failed searches (zero results)
 */
export const fetchFailedSearches = createAsyncThunk(
    "searchAdmin/fetchFailedSearches",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/search/admin/failed", {
                withCredentials: true
            });
            return res.data.data;
        } catch (error) {
            return rejectWithValue("Failed to load failed searches");
        }
    }
);

/**
 * 🔁 What users did AFTER failed search
 */
export const fetchFailedSearchActions = createAsyncThunk(
    "searchAdmin/fetchFailedSearchActions",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/search/admin/failed/actions", {
                withCredentials: true
            });
            return res.data.data;
        } catch (error) {
            return rejectWithValue("Failed to load failed search actions");
        }
    }
);

/**
 * 🔥 Top search queries
 */
export const fetchTopSearchQueries = createAsyncThunk(
    "searchAdmin/fetchTopSearchQueries",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/search/admin/top", {
                withCredentials: true
            });
            return res.data.data;
        } catch (error) {
            return rejectWithValue("Failed to load top searches");
        }
    }
);

/**
 * 🧠 Existing typo → correction mappings
 */
export const fetchSearchCorrections = createAsyncThunk(
    "searchAdmin/fetchSearchCorrections",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/search/admin/corrections", {
                withCredentials: true
            });
            return res.data.data;
        } catch (error) {
            return rejectWithValue("Failed to load corrections");
        }
    }
);

export const fetchSearchSynonyms = createAsyncThunk(
    "searchAdmin/fetchSynonyms",
    async () => {
        const res = await axiosInstance.get("/search/admin/synonyms");
        return res.data.data;
    }
);

export const fetchCorrectionSuggestions = createAsyncThunk(
    "searchAdmin/fetchCorrectionSuggestions",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(
                "/search/admin/suggestions/corrections",
                { withCredentials: true }
            );
            return res.data.data;
        } catch {
            return rejectWithValue("Failed to load correction suggestions");
        }
    }
);

const initialState = {
    loading: false,
    error: null,

    failedSearches: [],
    failedSearchActions: [],
    topSearches: [],
    corrections: [],
    synonyms: [], // ✅ ADD THIS
    correctionSuggestions: []
};

const searchAdminAnalyticsSlice = createSlice({
    name: "searchAdminAnalytics",
    initialState,
    reducers: {
        clearSearchAdminAnalytics: () => initialState
    },
    extraReducers: (builder) => {
        builder

            /* ❌ Failed Searches */
            .addCase(fetchFailedSearches.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFailedSearches.fulfilled, (state, action) => {
                state.loading = false;
                state.failedSearches = action.payload;
            })
            .addCase(fetchFailedSearches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* 🔁 Failed Search Actions */
            .addCase(fetchFailedSearchActions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFailedSearchActions.fulfilled, (state, action) => {
                state.loading = false;
                state.failedSearchActions = action.payload;
            })
            .addCase(fetchFailedSearchActions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* 🔥 Top Searches */
            .addCase(fetchTopSearchQueries.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTopSearchQueries.fulfilled, (state, action) => {
                state.loading = false;
                state.topSearches = action.payload;
            })
            .addCase(fetchTopSearchQueries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* 🧠 Corrections */
            .addCase(fetchSearchCorrections.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSearchCorrections.fulfilled, (state, action) => {
                state.loading = false;
                state.corrections = action.payload;
            })
            .addCase(fetchSearchCorrections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            /* 🔗 Synonyms */
            .addCase(fetchSearchSynonyms.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSearchSynonyms.fulfilled, (state, action) => {
                state.loading = false;
                state.synonyms = action.payload;
            })
            .addCase(fetchSearchSynonyms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCorrectionSuggestions.fulfilled, (state, action) => {
                state.correctionSuggestions = action.payload;
            });
    }
});

export const { clearSearchAdminAnalytics } =
    searchAdminAnalyticsSlice.actions;

export default searchAdminAnalyticsSlice.reducer;
