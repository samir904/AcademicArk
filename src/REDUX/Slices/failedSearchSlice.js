import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

/**
 * 📉 LOG FAILED SEARCH ACTION
 * Fire-and-forget analytics
 */
export const logFailedSearchAction = createAsyncThunk(
  "failedSearch/logAction",
  async (payload, { rejectWithValue }) => {
    try {
      /**
       * payload example:
       * {
       *   searchAnalyticsId,
       *   action: "opened_library",
       *   value: "DS notes"
       * }
       */
      await axiosInstance.post("search/failed/failed-action", payload, {
        withCredentials: true
      });

      return true; // no data needed
    } catch (error) {
      // ❌ SILENT FAIL — analytics must not break UX
      return rejectWithValue(null);
    }
  }
);


const initialState = {
  lastLoggedAction: null
};

const failedSearchSlice = createSlice({
  name: "failedSearch",
  initialState,
  reducers: {
    resetFailedSearchState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(logFailedSearchAction.fulfilled, (state, action) => {
        state.lastLoggedAction = "success";
      })
      .addCase(logFailedSearchAction.rejected, (state) => {
        // silent
        state.lastLoggedAction = "failed";
      });
  }
});

export const { resetFailedSearchState } = failedSearchSlice.actions;
export default failedSearchSlice.reducer;
