import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5014/api/v1";

// ============================================
// ASYNC THUNKS
// ============================================

export const fetchLeaderboard = createAsyncThunk(
  "leaderboard/fetchLeaderboard",
  async ({ type = "TOP_STUDENTS", limit = 100 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/leaderboards?type=${type}&limit=${limit}`,
        { withCredentials: true }
      );
      return {
        type,
        data: response.data.data
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leaderboard"
      );
    }
  }
);

export const fetchLeaderboardHistory = createAsyncThunk(
  "leaderboard/fetchHistory",
  async ({ type, days = 7 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/leaderboards/history?type=${type}&days=${days}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch history"
      );
    }
  }
);

// ============================================
// SLICE
// ============================================

const initialState = {
  // Current leaderboard data
  data: {
    type: "TOP_STUDENTS",
    entries: [],
    generatedAt: null,
    totalEntries: 0,
    dataQuality: {}
  },

  // History data
  history: [],

  // UI state
  activeTab: "TOP_STUDENTS",
  limit: 100,

  // Loading & error states
  loading: false,
  historyLoading: false,
  error: null,
  historyError: null
};

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,

  reducers: {
    // Change active tab
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    // Set limit
    setLimit: (state, action) => {
      state.limit = action.payload;
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
    },

    clearHistoryError: (state) => {
      state.historyError = null;
    }
  },

  extraReducers: (builder) => {
    // Fetch Leaderboard
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.activeTab = action.payload.type;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch History
    builder
      .addCase(fetchLeaderboardHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchLeaderboardHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload.snapshots || [];
      })
      .addCase(fetchLeaderboardHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      });
  }
});

export const { setActiveTab, setLimit, clearError, clearHistoryError } =
  leaderboardSlice.actions;

export default leaderboardSlice.reducer;
