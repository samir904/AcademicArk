import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

// 🔥 Async thunk to track event
export const trackPaywallEvent = createAsyncThunk(
  "/paywall/trackEvent",
  async ({ noteId = null, eventType, metadata = {} }, { rejectWithValue }) => {
    try {
      await axiosInstance.post(
        "/paywall/event",
        {
          noteId,
          eventType,
          metadata
        },
        { withCredentials: true }
      );

      return { eventType };

    } catch (error) {
      console.error("Paywall tracking failed:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to track paywall event"
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  lastTrackedEvent: null
};

const paywallTrackingSlice = createSlice({
  name: "paywallTracking",
  initialState,
  reducers: {
    clearTrackingError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(trackPaywallEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(trackPaywallEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.lastTrackedEvent = action.payload.eventType;
      })
      .addCase(trackPaywallEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearTrackingError } = paywallTrackingSlice.actions;
export default paywallTrackingSlice.reducer;
