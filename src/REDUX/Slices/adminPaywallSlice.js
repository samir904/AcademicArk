// src/REDUX/slices/adminPaywallSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

// thunks stay same as you wrote (good)
export const fetchFunnelOverview = createAsyncThunk(
  "adminPaywall/fetchFunnelOverview",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/paywall/overview");
      return res.data.data; // array of days
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching funnel overview");
    }
  }
);

export const fetchEventBreakdown = createAsyncThunk(
  "adminPaywall/fetchEventBreakdown",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/paywall/events");
      return res.data.data; // array of {_id, count}
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching event breakdown");
    }
  }
);

export const fetchUserSegments = createAsyncThunk(
  "adminPaywall/fetchUserSegments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/paywall/segments");
      return res.data.data; // {totalUsers, segments:{}}
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching user segments");
    }
  }
);

export const fetchTopNotes = createAsyncThunk(
  "adminPaywall/fetchTopNotes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/paywall/top-notes");
      return res.data.data; // your top notes array
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching top notes");
    }
  }
);

export const fetchMostPaywalledNotes = createAsyncThunk(
  "adminPaywall/fetchMostPaywalledNotes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/paywall/most-paywalled");
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching most paywalled notes"
      );
    }
  }
);


const initialState = {
  funnelOverview: [],
  eventBreakdown: [],
  userSegments: null,
  topNotes: [],
  mostPaywalledNotes: [],   // ✅ NEW

  status: {
    funnelOverview: "idle", // idle | loading | succeeded | failed
    eventBreakdown: "idle",
    userSegments: "idle",
    topNotes: "idle",
    mostPaywalledNotes: [],   // ✅ NEW
  },
  error: {
    funnelOverview: null,
    eventBreakdown: null,
    userSegments: null,
    topNotes: null,
    mostPaywalledNotes: [],   // ✅ NEW
  },
};

const adminPaywallSlice = createSlice({
  name: "adminPaywall",
  initialState,
  reducers: {
    resetPaywallAnalytics: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // funnel
      .addCase(fetchFunnelOverview.pending, (state) => {
        state.status.funnelOverview = "loading";
        state.error.funnelOverview = null;
      })
      .addCase(fetchFunnelOverview.fulfilled, (state, action) => {
        state.status.funnelOverview = "succeeded";
        state.funnelOverview = action.payload || [];
      })
      .addCase(fetchFunnelOverview.rejected, (state, action) => {
        state.status.funnelOverview = "failed";
        state.error.funnelOverview = action.payload;
      })

      // events
      .addCase(fetchEventBreakdown.pending, (state) => {
        state.status.eventBreakdown = "loading";
        state.error.eventBreakdown = null;
      })
      .addCase(fetchEventBreakdown.fulfilled, (state, action) => {
        state.status.eventBreakdown = "succeeded";
        state.eventBreakdown = action.payload || [];
      })
      .addCase(fetchEventBreakdown.rejected, (state, action) => {
        state.status.eventBreakdown = "failed";
        state.error.eventBreakdown = action.payload;
      })

      // segments
      .addCase(fetchUserSegments.pending, (state) => {
        state.status.userSegments = "loading";
        state.error.userSegments = null;
      })
      .addCase(fetchUserSegments.fulfilled, (state, action) => {
        state.status.userSegments = "succeeded";
        state.userSegments = action.payload || null;
      })
      .addCase(fetchUserSegments.rejected, (state, action) => {
        state.status.userSegments = "failed";
        state.error.userSegments = action.payload;
      })

      // top notes
      .addCase(fetchTopNotes.pending, (state) => {
        state.status.topNotes = "loading";
        state.error.topNotes = null;
      })
      .addCase(fetchTopNotes.fulfilled, (state, action) => {
        state.status.topNotes = "succeeded";
        state.topNotes = action.payload || [];
      })
      .addCase(fetchTopNotes.rejected, (state, action) => {
        state.status.topNotes = "failed";
        state.error.topNotes = action.payload;
      })
      .addCase(fetchMostPaywalledNotes.pending, (state) => {
  state.status.mostPaywalledNotes = "loading";
  state.error.mostPaywalledNotes = null;
})
.addCase(fetchMostPaywalledNotes.fulfilled, (state, action) => {
  state.status.mostPaywalledNotes = "succeeded";
  state.mostPaywalledNotes = action.payload || [];
})
.addCase(fetchMostPaywalledNotes.rejected, (state, action) => {
  state.status.mostPaywalledNotes = "failed";
  state.error.mostPaywalledNotes = action.payload;
});

  },
});

export const { resetPaywallAnalytics } = adminPaywallSlice.actions;
export default adminPaywallSlice.reducer;
