// 🎪 FILE: FRONTEND/src/REDUX/Slices/academicProfileSlice.js - UPDATED
// ✨ UPDATED: Add college list fetching

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance.js';
import { showToast } from '../../HELPERS/Toaster.jsx';

// ✨ THUNK: Update Academic Profile - UPDATED
export const updateAcademicProfile = createAsyncThunk(
    'academicProfile/update',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            // ✨ data now has: { semester, college, customCollege, branch }
            const httpPromise = axiosInstance.put('/user/academic-profile', data);
            const res = await showToast.promise(httpPromise, {
                loading: 'Updating academic profile...',
                success: (data) => data?.data?.message || 'Profile updated successfully',
                error: (error) => error?.response?.data?.message || 'Failed to update profile'
            });
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to update academic profile';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);

// ✨ NEW THUNK: Get College List
export const getCollegeList = createAsyncThunk(
    'academicProfile/getCollegeList',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/user/colleges/list');
            return res.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to fetch colleges');
        }
    }
);

// ✨ THUNK: Get Academic Profile
export const getAcademicProfile = createAsyncThunk(
    'academicProfile/get',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/user/academic-profile');
            return res.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to fetch profile');
        }
    }
);
// ✨ NEW THUNK: Approve Custom College (Admin only)
export const approveCustomCollege = createAsyncThunk(
    'academicProfile/approveCustomCollege',
    async (collegeName, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(
                '/user/colleges/approve',
                { collegeName }
            );
            showToast.success(`College "${collegeName}" approved!`);
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to approve college';
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);


// ✨ THUNK: Check Profile Completion Status
export const checkProfileCompletion = createAsyncThunk(
    'academicProfile/checkCompletion',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/user/academic-profile/check');
            return res.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to check profile');
        }
    }
);

// ✨ THUNK: Get Analytics (Admin only)
export const getAcademicAnalytics = createAsyncThunk(
    'academicProfile/getAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/user/academic-analytics');
            return res.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to fetch analytics');
        }
    }
);

const initialState = {
    profile: null,
    isCompleted: false,
    analytics: null,
    collegeList: [],     // ✨ NEW
    loading: false,
    error: null,
    showProfileModal: false,
};

const academicProfileSlice = createSlice({
    name: 'academicProfile',
    initialState,
    reducers: {
        setShowProfileModal: (state, action) => {
            state.showProfileModal = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // ✨ Get College List
        builder
            .addCase(getCollegeList.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCollegeList.fulfilled, (state, action) => {
                state.loading = false;
                state.collegeList = action.payload.data;
            })
            .addCase(getCollegeList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Set default colleges if fetch fails
                state.collegeList = [
                    { value: "KCC Institute of Technology and Management", label: "KCC Institute of Technology and Management", isPredefined: true },
                    { value: "GL Bajaj Institute of Technology and Management", label: "GL Bajaj Institute of Technology and Management", isPredefined: true },
                    { value: "GNIOT (Greater Noida Institute of Technology)", label: "GNIOT (Greater Noida Institute of Technology)", isPredefined: true },
                    { value: "NIET (Noida Institute of Engineering and Technology)", label: "NIET (Noida Institute of Engineering and Technology)", isPredefined: true },
                    { value: "ABESIT (ABESIT GROUP OF INSTITUTIONS)", label: "ABESIT (ABESIT GROUP OF INSTITUTIONS)", isPredefined: true },
                    { value: "Other", label: "Other", isPredefined: false }
                ];
            });

        // ✨ Update Academic Profile
        builder
            .addCase(updateAcademicProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAcademicProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.data.academicProfile;
                state.isCompleted = action.payload.data.academicProfile?.isCompleted || false;
                state.showProfileModal = false;
                
                const userData = JSON.parse(localStorage.getItem('data') || '{}');
                userData.academicProfile = state.profile;
                localStorage.setItem('data', JSON.stringify(userData));
            })
            .addCase(updateAcademicProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ✨ Get Academic Profile
        builder
            .addCase(getAcademicProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAcademicProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.data;
                state.isCompleted = action.payload.data?.isCompleted || false;
            })
            .addCase(getAcademicProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ✨ Check Profile Completion
        builder
            .addCase(checkProfileCompletion.fulfilled, (state, action) => {
                state.isCompleted = action.payload.data.isCompleted;
                state.profile = action.payload.data.academicProfile;
                state.showProfileModal = !action.payload.data.isCompleted;
            })
            .addCase(checkProfileCompletion.rejected, (state) => {
                state.showProfileModal = true;
            });

        // ✨ Get Analytics
        builder
            .addCase(getAcademicAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAcademicAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.analytics = action.payload.data;
            })
            .addCase(getAcademicAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
            // ✨ Approve Custom College
builder
    .addCase(approveCustomCollege.pending, (state) => {
        state.loading = true;
    })
    .addCase(approveCustomCollege.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally refresh analytics
    })
    .addCase(approveCustomCollege.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    });

    }
});

export const { setShowProfileModal, clearError } = academicProfileSlice.actions;
export default academicProfileSlice.reducer;