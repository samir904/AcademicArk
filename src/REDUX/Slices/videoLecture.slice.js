import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from "../../HELPERS/axiosInstance"
import { createSelector } from '@reduxjs/toolkit';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// ============================================
// THUNKS
// ============================================

export const registerVideoLecture = createAsyncThunk(
  'videoLecture/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/videos`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload video lecture'
      );
    }
  }
);

export const getAllVideoLectures = createAsyncThunk(
  'videoLecture/getAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.subject) queryParams.append('subject', filters.subject);
      if (filters.semester) queryParams.append('semester', filters.semester);
      if (filters.university) queryParams.append('university', filters.university);
      if (filters.course) queryParams.append('course', filters.course);
      if (filters.chapterNumber) queryParams.append('chapterNumber', filters.chapterNumber);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);

      const response = await axiosInstance.get(
        `/videos?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch videos'
      );
    }
  }
);

export const getVideoLecture = createAsyncThunk(
  'videoLecture/getOne',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/videos/${videoId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch video'
      );
    }
  }
);

export const addVideoRating = createAsyncThunk(
  'videoLecture/addRating',
  async ({ videoId, rating, review }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/videos/${videoId}/rate`,
        { rating, review }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add rating'
      );
    }
  }
);

export const bookmarkVideoLecture = createAsyncThunk(
  'videoLecture/bookmark',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/videos/${videoId}/bookmark`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to bookmark video'
      );
    }
  }
);

export const incrementVideoViewCount = createAsyncThunk(
  'videoLecture/incrementView',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/videos/${videoId}/view`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to increment view'
      );
    }
  }
);

// ============================================
// SLICE
// ============================================

const initialState = {
  // List state
  allVideos: [],
  filteredVideos: [],
  bookmarkedVideos: [], 
  // Single video state
  currentVideo: null,
  
  // UI state
  uploading: false,
  loading: false,
  loadingDetail: false,
  
  // Error state
  error: null,
  errorDetail: null,
  
  // Pagination (for future use)
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
  },
  
  // Filter state
  activeFilters: {
    subject: '',
    semester: '',
    university: '',
    course: '',
    chapterNumber: '',
    sortBy: 'latest',
  },

  // Messages
  successMessage: '',
};

const videoLectureSlice = createSlice({
  name: 'videoLecture',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },
    clearErrorDetail: (state) => {
      state.errorDetail = null;
    },
    
    // Clear messages
    clearSuccessMessage: (state) => {
      state.successMessage = '';
    },
    
    // Update filters
    setFilters: (state, action) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    
    // Reset filters
    resetFilters: (state) => {
      state.activeFilters = {
        subject: '',
        semester: '',
        university: '',
        course: '',
        chapterNumber: '',
        sortBy: 'latest',
      };
    },
  },
  extraReducers: (builder) => {
    // Register Video
    builder
      .addCase(registerVideoLecture.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(registerVideoLecture.fulfilled, (state, action) => {
        state.uploading = false;
        state.successMessage = action.payload.message || 'Video uploaded successfully';
        // Add new video to beginning of list
        state.allVideos.unshift(action.payload.data);
      })
      .addCase(registerVideoLecture.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      });

    // Get All Videos
    builder
      .addCase(getAllVideoLectures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVideoLectures.fulfilled, (state, action) => {
        state.loading = false;
        state.allVideos = action.payload.data || [];
        state.filteredVideos = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getAllVideoLectures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.allVideos = [];
        state.filteredVideos = [];
      });

    // Get Single Video
    builder
      .addCase(getVideoLecture.pending, (state) => {
        state.loadingDetail = true;
        state.errorDetail = null;
      })
      .addCase(getVideoLecture.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.currentVideo = action.payload.data;
      })
      .addCase(getVideoLecture.rejected, (state, action) => {
        state.loadingDetail = false;
        state.errorDetail = action.payload;
      });

    // Add Rating
    builder
      .addCase(addVideoRating.pending, (state) => {
        state.loading = true;
      })
      .addCase(addVideoRating.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentVideo) {
          state.currentVideo = action.payload.data;
        }
        state.successMessage = 'Rating added successfully';
      })
      .addCase(addVideoRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Bookmark Video
    builder
      .addCase(bookmarkVideoLecture.pending, (state) => {
        state.loading = true;
      })
      .addCase(bookmarkVideoLecture.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentVideo) {
          state.currentVideo = action.payload.data;
        }
        state.successMessage = action.payload.message || 'Bookmarked successfully';
      })
      .addCase(bookmarkVideoLecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Increment View
    builder
      .addCase(incrementVideoViewCount.pending, (state) => {
        // Silent operation
      })
      .addCase(incrementVideoViewCount.fulfilled, (state, action) => {
        if (state.currentVideo) {
          state.currentVideo.views = action.payload.data.views;
        }
      })
      .addCase(incrementVideoViewCount.rejected, (state) => {
        // Silent fail - don't disrupt user experience
      });
  },
});

// ✅ Memoized selector for all videos
export const selectAllVideos = (state) => state.videoLecture.allVideos;
export const selectVideoLoading = (state) => state.videoLecture.loading;
export const selectBookmarkedVideos = (state) => state.videoLecture.bookmarkedVideos;

// ✅ Memoized selector combining multiple values
export const selectVideoLectureData = createSelector(
  [selectAllVideos, selectVideoLoading, selectBookmarkedVideos],
  (allVideos, loading, bookmarkedVideos) => ({
    allVideos,
    loading,
    bookmarkedVideos
  })
);

export const {
  clearError,
  clearErrorDetail,
  clearSuccessMessage,
  setFilters,
  resetFilters,
} = videoLectureSlice.actions;

export default videoLectureSlice.reducer;