import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

// ============================================
// 🎯 ASYNC THUNKS
// ============================================

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

export const invalidateHomepageCache = createAsyncThunk(
  "home/invalidateCache",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/home/cache/invalidate");
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

// ============================================
// 🎯 INITIAL STATE
// ============================================

const initialState = {
  greeting:           null,
  continue:           null,
  studyMaterialToday: null,   // ✅ NEW
  newNotesBadge:      null,   // ✅ ADD
  recommended:        null,
  trending:           null,
  attendance:         null,
  leaderboard:        null,
  downloads:          null,
  metadata:           null,   // ✅ NEW

  isProfileComplete:  false,
  loading:            false,
  error:              null,
};

// ============================================
// 🎯 HELPER — maps full payload into state
// ============================================

// ✅ Reusable so both fulfilled cases stay DRY
const applyPayload = (state, payload) => {
  state.greeting           = payload.greeting           ?? null;
  state.continue           = payload.continue           ?? null;
  state.studyMaterialToday = payload.studyMaterialToday ?? null;  // ✅
   state.newNotesBadge      = payload.newNotesBadge      ?? null;  // ✅ ADD
  state.recommended        = payload.recommended        ?? null;
  state.trending           = payload.trending           ?? null;
  state.attendance         = payload.attendance         ?? null;
  state.leaderboard        = payload.leaderboard        ?? null;
  state.downloads          = payload.downloads          ?? null;
  state.metadata           = payload.metadata           ?? null;  // ✅
  state.isProfileComplete  = payload.metadata?.profileComplete ?? false;
};

// ============================================
// 🎯 SLICE
// ============================================

const homeSlice = createSlice({
  name: "home",
  initialState,

  reducers: {
    clearHomeError: (state) => {
      state.error = null;
    },

    // ✅ Useful when cache is invalidated externally (e.g. after note view)
    resetHomeState: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // ── fetchPersonalizedHome
      .addCase(fetchPersonalizedHome.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchPersonalizedHome.fulfilled, (state, action) => {
        state.loading = false;
        applyPayload(state, action.payload);
      })
      .addCase(fetchPersonalizedHome.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── invalidateHomepageCache
      .addCase(invalidateHomepageCache.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(invalidateHomepageCache.fulfilled, (state, action) => {
        state.loading = false;
        applyPayload(state, action.payload);  // ✅ was missing fields before
      })
      .addCase(invalidateHomepageCache.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });
  },
});

export const { clearHomeError, resetHomeState } = homeSlice.actions;
export default homeSlice.reducer;
