import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

// ============================================
// ASYNC THUNKS
// ============================================

// 1️⃣ START SESSION
export const startSession = createAsyncThunk(
  "sessionv@/start",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/sessionV2/start",
        payload,
        { withCredentials: true }
      );

      return response.data.sessionId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to start session"
      );
    }
  }
);

// 2️⃣ TRACK PAGE VIEW
export const trackPageView = createAsyncThunk(
  "sessionV2/trackPageView",
  async ({ sessionId, path, from }, { rejectWithValue }) => {
    try {
      await axiosInstance.post(
        "/sessionV2/track/page-view",
        { sessionId, path, from },
        { withCredentials: true }
      );
      return true;
    } catch (error) {
      return rejectWithValue("Failed to track page view");
    }
  }
);

// 3️⃣ TRACK EVENT
export const trackEvent = createAsyncThunk(
  "sessionV2/trackEvent",
  async ({ sessionId, type, metadata, page }, { rejectWithValue }) => {
    try {
      await axiosInstance.post(
        "/sessionV2/track/event",
        { sessionId, type, metadata, page },
        { withCredentials: true }
      );
      return true;
    } catch (error) {
      return rejectWithValue("Failed to track event");
    }
  }
);

// 4️⃣ END SESSION
export const endSession = createAsyncThunk(
  "sessionV2/end",
  async ({ sessionId, exitPage }, { rejectWithValue }) => {
    try {
      await axiosInstance.post(
        "/sessionV2/end",
        { sessionId, exitPage },
        { withCredentials: true }
      );
      return true;
    } catch (error) {
      return rejectWithValue("Failed to end session");
    }
  }
);

// ============================================
// SLICE
// ============================================

const initialState = {
  sessionId: null,
  loading: false,
  error: null,
  isActive: false
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    clearSessionError: (state) => {
      state.error = null;
    },
    resetSession: (state) => {
      state.sessionId = null;
      state.isActive = false;
    }
  },
  extraReducers: (builder) => {

    // START SESSION
    builder
      .addCase(startSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload;
        state.isActive = true;
      })
      .addCase(startSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // END SESSION
    builder
      .addCase(endSession.fulfilled, (state) => {
        state.isActive = false;
      });
  }
});

export const { clearSessionError, resetSession } = sessionSlice.actions;

export default sessionSlice.reducer;
