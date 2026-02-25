// REDUX/SLICES/cloudinarySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';
import { showToast } from '../../HELPERS/Toaster';

// ==========================================
// 📡 THUNKS
// ==========================================

// GET /api/v1/admin/cloudinary/health
export const fetchCloudinaryHealth = createAsyncThunk(
  'cloudinary/fetchHealth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/admin/cloudinary/health');
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to fetch Cloudinary health';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// GET /api/v1/admin/cloudinary/resources
export const fetchCloudinaryResources = createAsyncThunk(
  'cloudinary/fetchResources',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/admin/cloudinary/resources');
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to fetch Cloudinary resources';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// GET /api/v1/admin/cloudinary/snapshots?days=30
export const fetchCloudinarySnapshots = createAsyncThunk(
  'cloudinary/fetchSnapshots',
  async (days = 30, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/admin/cloudinary/snapshots?days=${days}`);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to fetch snapshots';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// GET /api/v1/admin/cloudinary/snapshots/latest
export const fetchLatestSnapshot = createAsyncThunk(
  'cloudinary/fetchLatestSnapshot',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/admin/cloudinary/snapshots/latest');
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to fetch latest snapshot';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// POST /api/v1/admin/cloudinary/snapshots/trigger
export const triggerCloudinarySnapshot = createAsyncThunk(
  'cloudinary/triggerSnapshot',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.post('/admin/cloudinary/snapshots/trigger');
      showToast.success('Snapshot saved successfully');
      // ✅ auto-refresh snapshots list after trigger
      dispatch(fetchCloudinarySnapshots(30));
      dispatch(fetchLatestSnapshot());
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to trigger snapshot';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==========================================
// 🗄️ INITIAL STATE
// ==========================================

const asyncState = (data = null) => ({
  data,
  loading: false,
  error:   null,
});

const initialState = {
  // ── Real-time panels
  health:    asyncState({
    status:  null,
    plan:    null,
    storage:         { usedMB: 0, limitGB: 0, usedPct: 0 },
    bandwidth:       { usedMB: 0, limitGB: 0, usedPct: 0 },
    transformations: { used: 0,   limit: 0,   usedPct: 0 },
    resources:       { total: 0,  derived: 0, objects: 0 },
    limits:          { imageMaxSizeMB: 0, videoMaxSizeMB: 0, rawMaxSizeMB: 0 },
    lastUpdated:     null,
  }),

  resources: asyncState({
    images: 0,
    videos: 0,
    raw:    0,
    total:  0,
    folder: 'AcademicArk',
  }),

  // ── Snapshot panels
  snapshots:      asyncState([]),   // history array for charts
  latestSnapshot: asyncState(null), // single latest doc

  // ── Trigger state (POST — separate loading/error)
  triggerLoading: false,
  triggerError:   null,

  // ── UI
  selectedDays: 30,  // shared days filter for snapshot charts (7 | 14 | 30)
};

// ==========================================
// 🔪 SLICE
// ==========================================

const cloudinarySlice = createSlice({
  name: 'cloudinary',
  initialState,

  reducers: {
    // ✅ Change snapshot chart range — component re-fetches on change
    setSelectedDays: (state, action) => {
      state.selectedDays = action.payload;
    },

    // ✅ Clear individual panel errors
    clearCloudinaryError: (state, action) => {
      const panel = action.payload; // 'health' | 'resources' | 'snapshots' | 'latestSnapshot'
      if (state[panel]) state[panel].error = null;
    },

    // ✅ Bust Redis cache hint (UI optimistic reset)
    resetHealthCache: (state) => {
      state.health.data = initialState.health.data;
    },
  },

  extraReducers: (builder) => {
    builder

      // ─── HEALTH ───
      .addCase(fetchCloudinaryHealth.pending,   (state) => { state.health.loading = true;  state.health.error = null; })
      .addCase(fetchCloudinaryHealth.fulfilled, (state, { payload }) => {
        state.health.loading = false;
        state.health.data    = payload.data;
      })
      .addCase(fetchCloudinaryHealth.rejected,  (state, { payload }) => { state.health.loading = false;  state.health.error = payload; })

      // ─── RESOURCES ───
      .addCase(fetchCloudinaryResources.pending,   (state) => { state.resources.loading = true;  state.resources.error = null; })
      .addCase(fetchCloudinaryResources.fulfilled, (state, { payload }) => {
        state.resources.loading = false;
        state.resources.data    = payload.data;
      })
      .addCase(fetchCloudinaryResources.rejected,  (state, { payload }) => { state.resources.loading = false; state.resources.error = payload; })

      // ─── SNAPSHOTS HISTORY ───
      .addCase(fetchCloudinarySnapshots.pending,   (state) => { state.snapshots.loading = true;  state.snapshots.error = null; })
      .addCase(fetchCloudinarySnapshots.fulfilled, (state, { payload }) => {
        state.snapshots.loading = false;
        state.snapshots.data    = payload.data;   // array of snapshots
        state.snapshots.count   = payload.count;
        state.snapshots.days    = payload.days;
      })
      .addCase(fetchCloudinarySnapshots.rejected,  (state, { payload }) => { state.snapshots.loading = false; state.snapshots.error = payload; })

      // ─── LATEST SNAPSHOT ───
      .addCase(fetchLatestSnapshot.pending,   (state) => { state.latestSnapshot.loading = true;  state.latestSnapshot.error = null; })
      .addCase(fetchLatestSnapshot.fulfilled, (state, { payload }) => {
        state.latestSnapshot.loading = false;
        state.latestSnapshot.data    = payload.data;
      })
      .addCase(fetchLatestSnapshot.rejected,  (state, { payload }) => { state.latestSnapshot.loading = false; state.latestSnapshot.error = payload; })

      // ─── TRIGGER SNAPSHOT ───
      .addCase(triggerCloudinarySnapshot.pending,   (state) => { state.triggerLoading = true;  state.triggerError = null; })
      .addCase(triggerCloudinarySnapshot.fulfilled, (state, { payload }) => {
        state.triggerLoading = false;
        // ✅ Optimistically prepend to snapshots list — no extra refetch needed
        // (dispatch inside thunk also triggers fetchCloudinarySnapshots as backup)
        if (Array.isArray(state.snapshots.data)) {
          state.snapshots.data = [...state.snapshots.data, payload.data];
        }
        state.latestSnapshot.data = payload.data;
      })
      .addCase(triggerCloudinarySnapshot.rejected,  (state, { payload }) => { state.triggerLoading = false; state.triggerError = payload; });
  },
});

// ==========================================
// 📤 EXPORTS
// ==========================================

export const {
  setSelectedDays,
  clearCloudinaryError,
  resetHealthCache,
} = cloudinarySlice.actions;

// ── Selectors
export const selectCloudinaryHealth         = (s) => s.cloudinary.health;
export const selectCloudinaryResources      = (s) => s.cloudinary.resources;
export const selectCloudinarySnapshots      = (s) => s.cloudinary.snapshots;
export const selectLatestSnapshot           = (s) => s.cloudinary.latestSnapshot;
export const selectCloudinarySelectedDays   = (s) => s.cloudinary.selectedDays;
export const selectSnapshotTrigger          = (s) => ({
  loading: s.cloudinary.triggerLoading,
  error:   s.cloudinary.triggerError,
});

export default cloudinarySlice.reducer;
