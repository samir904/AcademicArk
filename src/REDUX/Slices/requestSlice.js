import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';
import { showToast } from '../../HELPERS/Toaster';

// ✅ CREATE REQUEST
export const createRequest = createAsyncThunk(
  'request/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/admin/requests/create', data);
      showToast.success(res.data.message);
      return res.data;
    } catch (error) {
      showToast.error(error?.response?.data?.message || 'Failed to create request');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// ✅ GET MY REQUESTS
export const getMyRequests = createAsyncThunk(
  'request/getMyRequests',
  async ({ status, page = 1 } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/admin/requests/my-requests', {
        params: { status, page }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// ✅ GET ALL REQUESTS (Public)
export const getAllRequests = createAsyncThunk(
  'request/getAll',
  async ({ status, requestType, semester, branch, sortBy, page = 1 } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/admin/requests/all', {
        params: { status, requestType, semester, branch, sortBy, page }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// ✅ UPVOTE REQUEST
export const upvoteRequest = createAsyncThunk(
  'request/upvote',
  async (requestId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/admin/requests/${requestId}/upvote`);
      return { requestId, ...res.data.data };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// ✅ ADMIN: GET ALL REQUESTS
export const getAdminRequests = createAsyncThunk(
  'request/admin/getAll',
  async ({ status, page = 1, search } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/admin/requests/admin/all', {
        params: { status, page, search }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// ✅ ADMIN: UPDATE REQUEST
export const updateRequestStatus = createAsyncThunk(
  'request/admin/update',
  async ({ requestId, status, adminNotes, fulfilledNoteId, priority }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/admin/requests/admin/${requestId}`, {
        status,
        adminNotes,
        fulfilledNoteId,
        priority
      });
      showToast.success('Request updated successfully');
      return res.data;
    } catch (error) {
      showToast.error(error?.response?.data?.message || 'Failed to update');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

const initialState = {
  myRequests: [],
  allRequests: [],
  adminRequests: [],
  stats: null,
  pagination: null,
  loading: false,
  error: null
};

const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Create Request
    builder
      .addCase(createRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get My Requests
    builder
      .addCase(getMyRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.myRequests = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getMyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get All Requests
    builder
      .addCase(getAllRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.allRequests = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Upvote Request
    builder
      .addCase(upvoteRequest.fulfilled, (state, action) => {
        const { requestId, upvoteCount, hasUpvoted } = action.payload;
        // Update in allRequests
        const request = state.allRequests.find(r => r._id === requestId);
        if (request) {
          request.upvoteCount = upvoteCount;
          request.hasUpvoted = hasUpvoted;
        }
      });

    // Admin Get Requests
    builder
      .addCase(getAdminRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.adminRequests = action.payload.data;
        state.stats = action.payload.stats;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAdminRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Admin Update Request
    builder
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const updatedRequest = action.payload.data;
        const index = state.adminRequests.findIndex(r => r._id === updatedRequest._id);
        if (index !== -1) {
          state.adminRequests[index] = updatedRequest;
        }
      });
  }
});

export const { clearError } = requestSlice.actions;
export default requestSlice.reducer;
