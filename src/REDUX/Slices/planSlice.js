import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

// ============================================
// ASYNC THUNKS
// ============================================

// 🔓 PUBLIC – fetch active plans
export const fetchActivePlans = createAsyncThunk(
  "plans/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/plans");
      return res.data.plans;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch plans"
      );
    }
  }
);

// 🔐 ADMIN – fetch all plans
export const fetchAllPlansAdmin = createAsyncThunk(
  "plans/fetchAllAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/plans/admin", {
        withCredentials: true
      });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin plans"
      );
    }
  }
);

// 🔐 ADMIN – create plan
export const createPlan = createAsyncThunk(
  "plans/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/plans/admin", payload, {
        withCredentials: true
      });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create plan"
      );
    }
  }
);

// 🔐 ADMIN – update plan
export const updatePlan = createAsyncThunk(
  "plans/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/plans/admin/${id}`,
        updates,
        { withCredentials: true }
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update plan"
      );
    }
  }
);

// 🔐 ADMIN – toggle plan status
export const togglePlanStatus = createAsyncThunk(
  "plans/toggle",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/plans/admin/${id}/toggle`,
        {},
        { withCredentials: true }
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle plan status"
      );
    }
  }
);

// ============================================
// SLICE
// ============================================

const initialState = {
  // Public
  activePlans: [],
  loading: false,
  error: null,

  // Admin
  adminPlans: [],
  adminLoading: false,
  adminError: null,

  // Mutation flags
  actionLoading: false,
  actionSuccess: false
};

const planSlice = createSlice({
  name: "plans",
  initialState,

  reducers: {
    clearPlanError: (state) => {
      state.error = null;
      state.adminError = null;
    },
    clearPlanSuccess: (state) => {
      state.actionSuccess = false;
    }
  },

  extraReducers: (builder) => {
    // ======================
    // FETCH ACTIVE PLANS
    // ======================
    builder
      .addCase(fetchActivePlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivePlans.fulfilled, (state, action) => {
        state.loading = false;
        state.activePlans = action.payload;
      })
      .addCase(fetchActivePlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ======================
    // FETCH ADMIN PLANS
    // ======================
    builder
      .addCase(fetchAllPlansAdmin.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(fetchAllPlansAdmin.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminPlans = action.payload;
      })
      .addCase(fetchAllPlansAdmin.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload;
      });

    // ======================
    // CREATE / UPDATE / TOGGLE
    // ======================
    builder
      .addCase(createPlan.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;
        state.adminPlans.unshift(action.payload);
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.actionLoading = false;
        state.adminError = action.payload;
      });

    builder
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.actionSuccess = true;
        const index = state.adminPlans.findIndex(
          p => p._id === action.payload._id
        );
        if (index !== -1) {
          state.adminPlans[index] = action.payload;
        }
      });

    builder
      .addCase(togglePlanStatus.fulfilled, (state, action) => {
        state.actionSuccess = true;
        const index = state.adminPlans.findIndex(
          p => p._id === action.payload._id
        );
        if (index !== -1) {
          state.adminPlans[index] = action.payload;
        }
      });
  }
});

export const {
  clearPlanError,
  clearPlanSuccess
} = planSlice.actions;

export default planSlice.reducer;
