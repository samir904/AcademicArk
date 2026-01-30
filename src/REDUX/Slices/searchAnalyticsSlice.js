import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

/**
 * 🔍 LOG SEARCH ANALYTICS
 * Fire-and-forget
 * Called AFTER search API responds
 */
export const logSearchAnalytics = createAsyncThunk(
  "searchAnalytics/log",
  async (payload, { rejectWithValue }) => {
    try {
      await axiosInstance.post(
        "/search/analytics/log",
        payload,
        { withCredentials: true }
      );
      return true;
    } catch (error) {
      // ❌ DO NOT throw, DO NOT toast
      return rejectWithValue(null);
    }
  }
);

/**
 * 🕘 FETCH RECENT SEARCHES (user specific)
 * Called when search input is focused
 */
export const fetchRecentSearches = createAsyncThunk(
  "searchAnalytics/fetchRecent",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        "/search/analytics/recent",
        { withCredentials: true }
      );

      return res.data.searches || [];
    } catch (error) {
      return rejectWithValue([]);
    }
  }
);

const searchAnalyticsSlice = createSlice({
  name: "searchAnalytics",

  initialState: {
    lastLoggedAt: null,
    recentSearches: [],
    loadingRecent: false
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(logSearchAnalytics.fulfilled, (state) => {
        state.lastLoggedAt = Date.now();
      })
      .addCase(logSearchAnalytics.rejected, () => {
        // ❌ silent fail — analytics must NEVER affect UX
      })
      /* 🕘 Recent Searches */
    .addCase(fetchRecentSearches.pending, (state) => {
      state.loadingRecent = true;
    })
    .addCase(fetchRecentSearches.fulfilled, (state, action) => {
      state.loadingRecent = false;
      state.recentSearches = action.payload;
    })
    .addCase(fetchRecentSearches.rejected, (state) => {
      state.loadingRecent = false;
      state.recentSearches = [];
    });
  }
});

export default searchAnalyticsSlice.reducer;
