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
        "/search-analytics/log",
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

const searchAnalyticsSlice = createSlice({
  name: "searchAnalytics",

  initialState: {
    lastLoggedAt: null
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(logSearchAnalytics.fulfilled, (state) => {
        state.lastLoggedAt = Date.now();
      })
      .addCase(logSearchAnalytics.rejected, () => {
        // ❌ silent fail — analytics must NEVER affect UX
      });
  }
});

export default searchAnalyticsSlice.reducer;
