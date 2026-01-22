import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

export const fetchPersonalizedHome = createAsyncThunk(
    "home/fetchPersonalizedHome",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                "/home/personalized",
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch home data"
            );
        }
    }
);
// ✨ NEW: Invalidate cache (call after profile update)
export const invalidateHomepageCache = createAsyncThunk(
    "home/invalidateCache",
    async (_, { rejectWithValue }) => {
        try {
            // Invalidate on backend
            await axiosInstance.post("/home/cache/invalidate");
            // Then refetch fresh data
            const response = await axiosInstance.get(
                "/home/personalized",
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to refresh data"
            );
        }
    }
);

const initialState = {
    greeting: null,
    continue: null,
    recommended: null,
    trending: null,
    // ⭐ ADD
    attendance: null,
    leaderboard: null,
    downloads: null,

    isProfileComplete: false,
    loading: false,
    error: null
};

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        clearHomeError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPersonalizedHome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPersonalizedHome.fulfilled, (state, action) => {
                state.loading = false;
                state.greeting = action.payload.greeting;
                state.continue = action.payload.continue;
                state.recommended = action.payload.recommended;
                state.trending = action.payload.trending;
                state.isProfileComplete = action.payload.greeting.isProfileComplete;
                // ⭐ ADD
                state.attendance = action.payload.attendance;
                state.leaderboard = action.payload.leaderboard;
                state.downloads = action.payload.downloads;
            })
            .addCase(fetchPersonalizedHome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(invalidateHomepageCache.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(invalidateHomepageCache.fulfilled, (state, action) => {
                state.loading = false;
                state.greeting = action.payload.greeting;
                state.continue = action.payload.continue;
                state.recommended = action.payload.recommended;
                state.trending = action.payload.trending;
            })
            .addCase(invalidateHomepageCache.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});

export const { clearHomeError } = homeSlice.actions;
export default homeSlice.reducer;
