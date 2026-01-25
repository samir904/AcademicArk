import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';

// ✅ Create study plan
export const createStudyPlan = createAsyncThunk(
  'studyPlanner/createStudyPlan',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/study-planner/create', planData);
      return response.data.studyPlanner;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create study plan');
    }
  }
);

// ✅ Get all study plans
export const getStudyPlans = createAsyncThunk(
  'studyPlanner/getStudyPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/study-planner/all');
      return response.data.studyPlans;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch study plans');
    }
  }
);

// ✅ Get study plan by ID (includes timetable now)
export const getStudyPlanById = createAsyncThunk(
  'studyPlanner/getStudyPlanById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/study-planner/${id}`);
      return response.data.studyPlanner;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch study plan');
    }
  }
);

// ✅ Update chapter progress
export const updateChapterProgress = createAsyncThunk(
  'studyPlanner/updateChapterProgress',
  async ({ planId, subjectId, chapterId, progressType }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/study-planner/${planId}/update-progress`,
        {
          subjectId,
          chapterId,
          progressType
        }
      );
      return response.data.studyPlanner;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update progress');
    }
  }
);

// ✅ Get recommendations
export const getRecommendations = createAsyncThunk(
  'studyPlanner/getRecommendations',
  async ({ planId, subjectId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/study-planner/${planId}/${subjectId}/recommendations`
      );
      return response.data.recommendations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get recommendations');
    }
  }
);

// ✅ Delete study plan
export const deleteStudyPlan = createAsyncThunk(
  'studyPlanner/deleteStudyPlan',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/study-planner/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete study plan');
    }
  }
);

const initialState = {
  studyPlans: [],
  currentPlan: null,
  recommendations: null,
  loading: false,
  error: null,
  isUpdating: false
};

const studyPlannerSlice = createSlice({
  name: 'studyPlanner',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPlan: (state, action) => {
      state.currentPlan = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Create study plan
    builder
      .addCase(createStudyPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStudyPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.studyPlans.push(action.payload);
        state.currentPlan = action.payload;
        state.error = null;
      })
      .addCase(createStudyPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get study plans
    builder
      .addCase(getStudyPlans.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudyPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.studyPlans = action.payload;
        state.error = null;
      })
      .addCase(getStudyPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get study plan by ID
    builder
      .addCase(getStudyPlanById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudyPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
        state.error = null;
      })
      .addCase(getStudyPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update chapter progress
    builder
      .addCase(updateChapterProgress.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateChapterProgress.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentPlan = action.payload;
        state.error = null;
      })
      .addCase(updateChapterProgress.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      });

    // Get recommendations
    builder
      .addCase(getRecommendations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
        state.error = null;
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete study plan
    builder
      .addCase(deleteStudyPlan.fulfilled, (state, action) => {
        state.studyPlans = state.studyPlans.filter(plan => plan._id !== action.payload);
        if (state.currentPlan?._id === action.payload) {
          state.currentPlan = null;
        }
        state.error = null;
      })
      .addCase(deleteStudyPlan.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError, setCurrentPlan } = studyPlannerSlice.actions;
export default studyPlannerSlice.reducer;
