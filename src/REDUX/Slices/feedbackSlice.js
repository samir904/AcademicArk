import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance.js";
import { showToast } from "../../HELPERS/Toaster.jsx";
import ReactGA from "react-ga4";

// ✅ Initial State
const initialState = {
    // User feedback
    myFeedbacks: [],
    myFeedbacksPagination: null,
    currentFeedback: null,
    
    // Admin - All feedbacks
    allFeedbacks: [],
    allFeedbacksPagination: null,
    
    // Analytics
    feedbackAnalytics: null,
    
    // Loading & Error
    loading: false,
    error: null,
    submitLoading: false,
};

// ✅ THUNKS - USER ACTIONS

/**
 * Submit new feedback
 * POST /api/v1/feedback/submit
 */
export const submitFeedback = createAsyncThunk(
    'feedback/submit',
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            const httpPromise = axiosInstance.post(
                '/feedback/submit',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const res = await showToast.promise(httpPromise, {
                loading: 'Submitting your feedback...',
                success: (data) => {
                    // Track event
                    ReactGA.event({
                        category: 'feedback',
                        action: 'submit',
                        label: formData.get('feedbackType'),
                    });
                    return data?.data?.message || 'Thank you for your feedback!';
                },
                error: (error) => {
                    return error?.response?.data?.message || 'Failed to submit feedback';
                }
            });

            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to submit feedback';
            return rejectWithValue({
                success: false,
                message: message
            });
        }
    }
);

/**
 * Get user's feedback history
 * GET /api/v1/feedback/my-feedback
 */
export const getMyFeedback = createAsyncThunk(
    'feedback/getMyFeedback',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(
                `/feedback/my-feedback?page=${page}&limit=${limit}`
            );
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to fetch feedback';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

/**
 * Get single feedback by ID
 * GET /api/v1/feedback/:id
 */
export const getFeedbackById = createAsyncThunk(
    'feedback/getFeedbackById',
    async (feedbackId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/feedback/${feedbackId}`);
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to fetch feedback';
            return rejectWithValue(message);
        }
    }
);

/**
 * Delete feedback (user or admin)
 * DELETE /api/v1/feedback/:id
 */
export const deleteFeedback = createAsyncThunk(
    'feedback/delete',
    async (feedbackId, { rejectWithValue }) => {
        try {
            const httpPromise = axiosInstance.delete(`/feedback/${feedbackId}`);

            const res = await showToast.promise(httpPromise, {
                loading: 'Deleting feedback...',
                success: (data) => {
                    ReactGA.event({
                        category: 'feedback',
                        action: 'delete',
                        label: feedbackId,
                    });
                    return data?.data?.message || 'Feedback deleted successfully';
                },
                error: (error) => {
                    return error?.response?.data?.message || 'Failed to delete feedback';
                }
            });

            return res.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

// ✅ THUNKS - ADMIN ACTIONS

/**
 * Get all feedbacks (admin only)
 * GET /api/v1/feedback
 */
export const getAllFeedbacks = createAsyncThunk(
    'feedback/getAllFeedbacks',
    async (
        {
            page = 1,
            limit = 20,
            feedbackType = '',
            status = '',
            rating = '',
            sortBy = 'createdAt'
        },
        { rejectWithValue }
    ) => {
        try {
            let url = `/feedback?page=${page}&limit=${limit}&sortBy=${sortBy}`;

            if (feedbackType) url += `&feedbackType=${feedbackType}`;
            if (status) url += `&status=${status}`;
            if (rating) url += `&rating=${rating}`;

            const res = await axiosInstance.get(url);
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to fetch feedbacks';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

/**
 * Update feedback status (admin only)
 * PUT /api/v1/feedback/:id/status
 */
export const updateFeedbackStatus = createAsyncThunk(
    'feedback/updateStatus',
    async (
        { feedbackId, status, adminResponse },
        { rejectWithValue }
    ) => {
        try {
            const httpPromise = axiosInstance.put(
                `/feedback/${feedbackId}/status`,
                {
                    status,
                    adminResponse
                }
            );

            const res = await showToast.promise(httpPromise, {
                loading: 'Updating feedback status...',
                success: (data) => {
                    ReactGA.event({
                        category: 'feedback',
                        action: 'update_status',
                        label: status,
                    });
                    return data?.data?.message || 'Feedback updated successfully';
                },
                error: (error) => {
                    return error?.response?.data?.message || 'Failed to update';
                }
            });

            return res.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

/**
 * Get feedback analytics (admin only)
 * GET /api/v1/feedback/analytics/overview
 */
export const getFeedbackAnalytics = createAsyncThunk(
    'feedback/getAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/feedback/analytics/overview');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to fetch analytics';
            return rejectWithValue(message);
        }
    }
);

// ✅ SLICE
const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    extraReducers: (builder) => {
        // ============ SUBMIT FEEDBACK ============
        builder
            .addCase(submitFeedback.pending, (state) => {
                state.submitLoading = true;
                state.error = null;
            })
            .addCase(submitFeedback.fulfilled, (state, action) => {
                state.submitLoading = false;
                // Add new feedback to list
                if (state.myFeedbacks) {
                    state.myFeedbacks.unshift(action.payload.data);
                }
            })
            .addCase(submitFeedback.rejected, (state, action) => {
                state.submitLoading = false;
                state.error = action.payload?.message || 'Failed to submit feedback';
            });

        // ============ GET MY FEEDBACK ============
        builder
            .addCase(getMyFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.myFeedbacks = action.payload.data;
                state.myFeedbacksPagination = action.payload.pagination;
            })
            .addCase(getMyFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET FEEDBACK BY ID ============
        builder
            .addCase(getFeedbackById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeedbackById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentFeedback = action.payload.data;
            })
            .addCase(getFeedbackById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ DELETE FEEDBACK ============
        builder
            .addCase(deleteFeedback.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteFeedback.fulfilled, (state, action) => {
                state.loading = false;
                // Remove from myFeedbacks if it exists
                if (state.currentFeedback) {
                    state.myFeedbacks = state.myFeedbacks.filter(
                        fb => fb._id !== action.payload.data?._id
                    );
                    state.currentFeedback = null;
                }
            })
            .addCase(deleteFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET ALL FEEDBACKS (ADMIN) ============
        builder
            .addCase(getAllFeedbacks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFeedbacks.fulfilled, (state, action) => {
                state.loading = false;
                state.allFeedbacks = action.payload.data;
                state.allFeedbacksPagination = action.payload.pagination;
            })
            .addCase(getAllFeedbacks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ UPDATE FEEDBACK STATUS (ADMIN) ============
        builder
            .addCase(updateFeedbackStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
                state.loading = false;
                // Update in allFeedbacks list
                const index = state.allFeedbacks.findIndex(
                    fb => fb._id === action.payload.data._id
                );
                if (index !== -1) {
                    state.allFeedbacks[index] = action.payload.data;
                }
                // Update current feedback if viewing it
                if (state.currentFeedback?._id === action.payload.data._id) {
                    state.currentFeedback = action.payload.data;
                }
            })
            .addCase(updateFeedbackStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ============ GET FEEDBACK ANALYTICS (ADMIN) ============
        builder
            .addCase(getFeedbackAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFeedbackAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.feedbackAnalytics = action.payload.data;
            })
            .addCase(getFeedbackAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default feedbackSlice.reducer;
