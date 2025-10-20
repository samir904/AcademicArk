import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';
import { showToast } from '../../HELPERS/Toaster';

// Async thunks
export const getActiveBanner = createAsyncThunk(
  'notification/getActiveBanner',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/admin/banner');
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch banner');
    }
  }
);

export const createBanner = createAsyncThunk(
  'notification/createBanner',
  async (bannerData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/admin/banner', bannerData);
      showToast.success('Notification banner created successfully!');
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to create banner';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const listBanners = createAsyncThunk(
  'notification/listBanners',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/admin/banners');
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch banners');
    }
  }
);

export const hideBanner = createAsyncThunk(
  'notification/hideBanner',
  async (bannerId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/admin/banner/${bannerId}/hide`);
      showToast.success('Banner hidden successfully');
      return { bannerId, ...res.data };
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to hide banner';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteBanner = createAsyncThunk(
  'notification/deleteBanner',
  async (bannerId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/admin/banner/${bannerId}`);
      showToast.success('Banner deleted successfully');
      return { bannerId, ...res.data };
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to delete banner';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  activeBanner: null,
  allBanners: [],
  dismissedBanners: JSON.parse(localStorage.getItem('dismissedBanners') || '[]'), // Per-user dismiss
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    dismissBanner: (state, action) => {
      const bannerId = action.payload;
      if (!state.dismissedBanners.includes(bannerId)) {
        state.dismissedBanners.push(bannerId);
        localStorage.setItem('dismissedBanners', JSON.stringify(state.dismissedBanners));
      }
    },
    clearDismissed: (state) => {
      state.dismissedBanners = [];
      localStorage.removeItem('dismissedBanners');
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Active Banner
      .addCase(getActiveBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(getActiveBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.activeBanner = action.payload.data;
      })
      .addCase(getActiveBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Banner
      .addCase(createBanner.fulfilled, (state, action) => {
        state.allBanners.unshift(action.payload.data);
      })

      // List Banners
      .addCase(listBanners.fulfilled, (state, action) => {
        state.allBanners = action.payload.data;
      })

      // Hide Banner
      .addCase(hideBanner.fulfilled, (state, action) => {
        state.allBanners = state.allBanners.map((banner) =>
          banner._id === action.payload.bannerId ? { ...banner, visible: false } : banner
        );
      })

      // Delete Banner
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.allBanners = state.allBanners.filter(
          (banner) => banner._id !== action.payload.bannerId
        );
      });
  },
});

export const { dismissBanner, clearDismissed } = notificationSlice.actions;
export default notificationSlice.reducer;
