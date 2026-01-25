import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";
import { showToast } from "../../HELPERS/Toaster";

const initialState = {
    videos: [],
    currentVideo: null,
    loading: false,
    uploading: false,
    updating: false,
    deleting: false,
    rating: false,
    bookmarkingVideos: [],
    downloadingVideos: [],
    error: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 12,
        pages: 0
    },
    filters: {
        subject: '',
        semester: '',
        chapter: '',
        sortBy: 'newest'
    }
};

// ============================================================================
// THUNKS
// ============================================================================

export const uploadVideo = createAsyncThunk(
    'video/upload',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/videos/upload", formData, {
                // headers: { 'Content-Type': 'multipart/form-data' }
            });
            showToast.success(res?.data?.message || "Video uploaded successfully");
            return res.data;
        } catch (e) {
            const message = e?.response?.data?.message || "Failed to upload video!";
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const getAllVideos = createAsyncThunk(
    'video/getAllVideos',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const queryparams = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    queryparams.append(key, value);
                }
            });

            const res = await axiosInstance.get(`/videos?${queryparams.toString()}`);
            return res.data;
        } catch (e) {
            const message = e?.response?.data?.message || "Failed to fetch videos!";
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const getVideo = createAsyncThunk(
    'video/getVideo',
    async (videoId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/videos/watch/${videoId}`);
            return res.data;
        } catch (e) {
            const message = e?.response?.data?.message || "Failed to fetch video!";
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const getVideosBySubjectChapter = createAsyncThunk(
    'video/getBySubjectChapter',
    async ({ subject, semester, chapter }, { rejectWithValue }) => {
        try {
            const url = chapter
                ? `/videos/subject/${subject}/semester/${semester}/chapter/${chapter}`
                : `/videos/subject/${subject}/semester/${semester}`;

            const res = await axiosInstance.get(url);
            return res.data;
        } catch (e) {
            const message = e?.response?.data?.message || "Failed to fetch videos!";
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const getRecommendedVideos = createAsyncThunk(
    'video/getRecommended',
    async (videoId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/videos/recommended/${videoId}`);
            return res.data;
        } catch (e) {
            console.error('Error fetching recommendations:', e);
            return rejectWithValue(e?.response?.data?.message);
        }
    }
);

export const rateVideo = createAsyncThunk(
    'video/rate',
    async ({ videoId, rating, review }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/videos/${videoId}/rate`, {
                rating,
                review
            });
            showToast.success(res?.data?.message || "Rating added successfully!");
            return res.data;
        } catch (e) {
            const message = e?.response?.data?.message || "Failed to add rating!";
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const toggleBookmarkVideo = createAsyncThunk(
    'video/toggleBookmark',
    async (videoId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/videos/${videoId}/bookmark`);
            showToast.success(res?.data?.message);
            return res.data;
        } catch (e) {
            const message = e?.response?.data?.message || "Failed to toggle bookmark!";
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const getBookmarkedVideos = createAsyncThunk(
    'video/getBookmarked',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/videos/bookmarks/my-bookmarks`);
            return res.data;
        } catch (e) {
            const message = e?.response?.data?.message || "Failed to fetch bookmarks!";
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const getWatchHistory = createAsyncThunk(
    'video/getHistory',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/videos/history/my-history`);
            return res.data;
        } catch (e) {
            const message = e?.response?.data?.message || "Failed to fetch history!";
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const updateWatchProgress = createAsyncThunk(
    'video/updateProgress',
    async ({ videoId, watchTimeSeconds, watchPercentage, completed }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/videos/${videoId}/watch-progress`, {
                watchTimeSeconds,
                watchPercentage,
                completed
            });
            return res.data;
        } catch (e) {
            console.error('Error updating watch progress:', e);
            return rejectWithValue(e?.response?.data?.message);
        }
    }
);

export const deleteVideo = createAsyncThunk(
    'video/delete',
    async (videoId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/videos/${videoId}`);
            showToast.success(res?.data?.message || "Video deleted successfully!");
            return res.data;
        } catch (e) {
            const message = e?.response?.data?.message || "Failed to delete video!";
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

// ============================================================================
// SLICE
// ============================================================================

const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        clearCurrentVideo: (state) => {
            state.currentVideo = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        }
    },
    extraReducers: (builder) => {
        // Upload video
        builder
            .addCase(uploadVideo.pending, (state) => {
                state.uploading = true;
                state.error = null;
            })
            .addCase(uploadVideo.fulfilled, (state, action) => {
                state.uploading = false;
                state.videos.unshift(action.payload.data);
            })
            .addCase(uploadVideo.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload;
            });

        // Get all videos
        builder
            .addCase(getAllVideos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllVideos.fulfilled, (state, action) => {
                state.loading = false;
                state.videos = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(getAllVideos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get single video
        builder
            .addCase(getVideo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVideo.fulfilled, (state, action) => {
                state.loading = false;
                state.currentVideo = action.payload.data;
                const index = state.videos.findIndex(v => v._id === action.payload.data._id);
                if (index !== -1) {
                    state.videos[index] = action.payload.data;
                }
            })
            .addCase(getVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get by subject chapter
        builder
            .addCase(getVideosBySubjectChapter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVideosBySubjectChapter.fulfilled, (state, action) => {
                state.loading = false;
                state.videos = action.payload.data;
            })
            .addCase(getVideosBySubjectChapter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Rate video
        builder
            .addCase(rateVideo.pending, (state) => {
                state.rating = true;
                state.error = null;
            })
            .addCase(rateVideo.fulfilled, (state, action) => {
                state.rating = false;
                const updatedVideo = action.payload.data;
                const index = state.videos.findIndex(v => v._id === updatedVideo._id);
                if (index !== -1) {
                    state.videos[index] = updatedVideo;
                }
                if (state.currentVideo?._id === updatedVideo._id) {
                    state.currentVideo = updatedVideo;
                }
            })
            .addCase(rateVideo.rejected, (state, action) => {
                state.rating = false;
                state.error = action.payload;
            });

        // Toggle bookmark
        builder
            .addCase(toggleBookmarkVideo.pending, (state, action) => {
                const videoId = action.meta.arg;
                if (!state.bookmarkingVideos.includes(videoId)) {
                    state.bookmarkingVideos.push(videoId);
                }
                state.error = null;
            })
            .addCase(toggleBookmarkVideo.fulfilled, (state, action) => {
                const updatedVideo = action.payload.data;
                const videoId = updatedVideo._id;

                state.bookmarkingVideos = state.bookmarkingVideos.filter(id => id !== videoId);

                const index = state.videos.findIndex(v => v._id === videoId);
                if (index !== -1) {
                    state.videos[index] = updatedVideo;
                }
                if (state.currentVideo?._id === videoId) {
                    state.currentVideo = updatedVideo;
                }
            })
            .addCase(toggleBookmarkVideo.rejected, (state, action) => {
                const videoId = action.meta.arg;
                state.bookmarkingVideos = state.bookmarkingVideos.filter(id => id !== videoId);
                state.error = action.payload;
            });

        // Get bookmarked videos
        builder
            .addCase(getBookmarkedVideos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBookmarkedVideos.fulfilled, (state, action) => {
                state.loading = false;
                state.videos = action.payload.data;
            })
            .addCase(getBookmarkedVideos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get watch history
        builder
            .addCase(getWatchHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWatchHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.videos = action.payload.data;
            })
            .addCase(getWatchHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update watch progress
        builder
            .addCase(updateWatchProgress.fulfilled, (state, action) => {
                const updatedVideo = action.payload.data;
                const index = state.videos.findIndex(v => v._id === updatedVideo._id);
                if (index !== -1) {
                    state.videos[index] = updatedVideo;
                }
                if (state.currentVideo?._id === updatedVideo._id) {
                    state.currentVideo = updatedVideo;
                }
            });

        // Delete video
        builder
            .addCase(deleteVideo.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })
            .addCase(deleteVideo.fulfilled, (state, action) => {
                state.deleting = false;
                state.videos = state.videos.filter(v => v._id !== action.payload.data._id);
                if (state.currentVideo?._id === action.payload.data._id) {
                    state.currentVideo = null;
                }
            })
            .addCase(deleteVideo.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentVideo, setFilters, clearFilters } = videoSlice.actions;
export default videoSlice.reducer;
