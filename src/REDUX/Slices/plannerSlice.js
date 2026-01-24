import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

// ============================================
// ASYNC THUNKS
// ============================================

export const fetchTodayPlan = createAsyncThunk(
    "planner/fetchTodayPlan",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/planner/today", {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch today's plan"
            );
        }
    }
);

export const fetchPreferences = createAsyncThunk(
    "planner/fetchPreferences",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/planner/preferences", {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch preferences"
            );
        }
    }
);

export const savePreferences = createAsyncThunk(
    "planner/savePreferences",
    async (preferenceData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/planner/preferences",
                preferenceData,
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to save preferences"
            );
        }
    }
);

export const updatePreferences = createAsyncThunk(
    "planner/updatePreferences",
    async (preferenceData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                "/planner/preferences",
                preferenceData,
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update preferences"
            );
        }
    }
);

export const updateProgress = createAsyncThunk(
    "planner/updateProgress",
    async (progressData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                "/planner/progress",
                progressData,
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update progress"
            );
        }
    }
);

export const fetchProgress = createAsyncThunk(
    "planner/fetchProgress",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams(filters);
            const response = await axiosInstance.get(
                `/planner/progress?${params.toString()}`,
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch progress"
            );
        }
    }
);

export const fetchStats = createAsyncThunk(
    "planner/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/planner/stats", {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch stats"
            );
        }
    }
);

// ============================================
// SLICE
// ============================================

const initialState = {
    // Today's plan
    todayPlan: {
        tasks: [],
        totalMinutes: 0,
        message: ""
    },

    // Preferences
    preferences: {
        _id: null,
        userId: null,
        dailyStudyMinutes: 60,
        preferredStudyTime: "EVENING",
        examDates: [],
        subjectsToFocus: [],
        semester: null,
        branch: null,
        createdAt: null,
        updatedAt: null
    },
    preferencesFetched: false, // ✅ ADD THIS

    // Progress
    progress: [],

    // Stats
    stats: {
        totalUnitsStarted: 0,
        totalUnitsCompleted: 0,
        totalTimeSpent: 0,
        subjectProgress: {},
        streak: {
            current: 0,
            lastStudyDate: null
        },
        lifetime: {
            totalStudyTimeMinutes: 0
        }
    },

    // Loading states
    loading: {
        todayPlan: false,
        preferences: false,
        progress: false,
        stats: false,
        savingPreferences: false,
        updatingProgress: false
    },

    // Error states
    error: {
        todayPlan: null,
        preferences: null,
        progress: null,
        stats: null,
        savingPreferences: null,
        updatingProgress: null
    },

    // UI state
    showPreferenceDrawer: false,
    firstTimeSetup: false,
    isPreferencesSet: false
};

const plannerSlice = createSlice({
    name: "planner",
    initialState,

    reducers: {
        // UI Actions
        openPreferenceDrawer: (state) => {
            state.showPreferenceDrawer = true;
        },

        closePreferenceDrawer: (state) => {
            state.showPreferenceDrawer = false;
        },

        setFirstTimeSetup: (state, action) => {
            state.firstTimeSetup = action.payload;
        },

        // Clear errors
        clearError: (state, action) => {
            const { errorType } = action.payload;
            if (errorType) {
                state.error[errorType] = null;
            } else {
                state.error = {
                    todayPlan: null,
                    preferences: null,
                    progress: null,
                    stats: null,
                    savingPreferences: null,
                    updatingProgress: null
                };
            }
        },

        // Reset planner
        resetPlanner: (state) => {
            return initialState;
        }
    },

    extraReducers: (builder) => {
        // Fetch Today Plan
        builder
            .addCase(fetchTodayPlan.pending, (state) => {
                state.loading.todayPlan = true;
                state.error.todayPlan = null;
            })
            .addCase(fetchTodayPlan.fulfilled, (state, action) => {
                state.loading.todayPlan = false;
                state.todayPlan = action.payload;
            })
            .addCase(fetchTodayPlan.rejected, (state, action) => {
                state.loading.todayPlan = false;
                state.error.todayPlan = action.payload;
            });

        // Fetch Preferences
        builder
            .addCase(fetchPreferences.pending, (state) => {
                state.loading.preferences = true;
                state.error.preferences = null;
            })
            .addCase(fetchPreferences.fulfilled, (state, action) => {
                state.loading.preferences = false;
                state.preferences = action.payload;
                state.isPreferencesSet = !!action.payload._id;
                state.preferencesFetched = true; // ✅ 
            })
            .addCase(fetchPreferences.rejected, (state, action) => {
                state.loading.preferences = false;
                state.error.preferences = action.payload;
                state.isPreferencesSet = false;
                state.preferencesFetched = true; // ✅ 
            });

        // Save Preferences
        builder
            .addCase(savePreferences.pending, (state) => {
                state.loading.savingPreferences = true;
                state.error.savingPreferences = null;
            })
            .addCase(savePreferences.fulfilled, (state, action) => {
                state.loading.savingPreferences = false;
                state.preferences = action.payload;
                state.isPreferencesSet = true;
                state.firstTimeSetup = false;
                state.showPreferenceDrawer = false;
            })
            .addCase(savePreferences.rejected, (state, action) => {
                state.loading.savingPreferences = false;
                state.error.savingPreferences = action.payload;
            });

        // Update Preferences
        builder
            .addCase(updatePreferences.pending, (state) => {
                state.loading.savingPreferences = true;
                state.error.savingPreferences = null;
            })
            .addCase(updatePreferences.fulfilled, (state, action) => {
                state.loading.savingPreferences = false;
                state.preferences = action.payload;
                state.showPreferenceDrawer = false;
            })
            .addCase(updatePreferences.rejected, (state, action) => {
                state.loading.savingPreferences = false;
                state.error.savingPreferences = action.payload;
            });

        // Fetch Progress
        builder
            .addCase(fetchProgress.pending, (state) => {
                state.loading.progress = true;
                state.error.progress = null;
            })
            .addCase(fetchProgress.fulfilled, (state, action) => {
                state.loading.progress = false;
                state.progress = action.payload;
            })
            .addCase(fetchProgress.rejected, (state, action) => {
                state.loading.progress = false;
                state.error.progress = action.payload;
            });

        // Update Progress
        builder
            .addCase(updateProgress.pending, (state) => {
                state.loading.updatingProgress = true;
                state.error.updatingProgress = null;
            })
            .addCase(updateProgress.fulfilled, (state, action) => {
                state.loading.updatingProgress = false;
                // Update the progress in the list
                const index = state.progress.findIndex(
                    (p) =>
                        p.subject === action.payload.subject && p.unit === action.payload.unit
                );
                if (index >= 0) {
                    state.progress[index] = action.payload;
                } else {
                    state.progress.push(action.payload);
                }
            })
            .addCase(updateProgress.rejected, (state, action) => {
                state.loading.updatingProgress = false;
                state.error.updatingProgress = action.payload;
            });

        // Fetch Stats
        builder
            .addCase(fetchStats.pending, (state) => {
                state.loading.stats = true;
                state.error.stats = null;
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.loading.stats = false;
                state.stats = action.payload;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.loading.stats = false;
                state.error.stats = action.payload;
            });
    }
});

export const {
    openPreferenceDrawer,
    closePreferenceDrawer,
    setFirstTimeSetup,
    clearError,
    resetPlanner
} = plannerSlice.actions;

export default plannerSlice.reducer;