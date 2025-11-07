import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";
import { showToast } from "../../HELPERS/Toaster";

const initialState = {
  currentSemester: localStorage.getItem('currentSemester') || '1',
  attendance: null,
  stats: null,
  subjectDetails: null,  // ✨ NEW
  loading: false,
  marking: false,
  adding: false,
  updating: false,
  deleting: false,
  editing: false,        // ✨ NEW
  error: null
};

// Get attendance for current semester
export const getAttendance = createAsyncThunk(
  '/attendance/get',
  async (semester, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/attendance/${semester}`);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to fetch attendance';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// // Add new subject
// export const addSubject = createAsyncThunk(
//   '/attendance/addSubject',
//   async ({ semester, subject, targetPercentage }, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.post(`/attendance/${semester}/subject`, {
//         subject,
//         targetPercentage
//       });
//       showToast.success(res.data.message);
//       return res.data;
//     } catch (error) {
//       const message = error?.response?.data?.message || 'Failed to add subject';
//       showToast.error(message);
//       return rejectWithValue(message);
//     }
//   }
// );

// // Mark attendance
// export const markAttendance = createAsyncThunk(
//   '/attendance/mark',
//   async ({ semester, subject, date, status, reason }, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.post(`/attendance/${semester}/mark`, {
//         subject,
//         date,
//         status,
//         reason
//       });
//       showToast.success(res.data.message);
//       return res.data;
//     } catch (error) {
//       const message = error?.response?.data?.message || 'Failed to mark attendance';
//       showToast.error(message);
//       return rejectWithValue(message);
//     }
//   }
// );

// Update target percentage
export const updateTarget = createAsyncThunk(
  '/attendance/updateTarget',
  async ({ semester, subject, targetPercentage }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/attendance/${semester}/target`, {
        subject,
        targetPercentage
      });
      showToast.success(res.data.message);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to update target';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Delete subject
export const deleteSubject = createAsyncThunk(
  '/attendance/deleteSubject',
  async ({ semester, subject }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/attendance/${semester}/subject/${encodeURIComponent(subject)}`);
      showToast.success(res.data.message);
      return { subject };
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to delete subject';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Get stats
export const getAttendanceStats = createAsyncThunk(
  '/attendance/stats',
  async (semester, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/attendance/${semester}/stats`);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to fetch stats';
      return rejectWithValue(message);
    }
  }
);
// ✨ ADD: Edit subject action
export const editSubject = createAsyncThunk(
  '/attendance/editSubject',
  async ({ semester, subject, initialTotalClasses, initialPresentClasses, targetPercentage }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/attendance/${semester}/subject/${encodeURIComponent(subject)}/edit`, {
        initialTotalClasses,
        initialPresentClasses,
        targetPercentage
      });
      showToast.success(res.data.message);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to edit subject';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ✨ ADD: Get subject details action
export const getSubjectDetails = createAsyncThunk(
  '/attendance/getSubjectDetails',
  async ({ semester, subject }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/attendance/${semester}/subject/${encodeURIComponent(subject)}`);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to get subject details';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ✨ UPDATE: Mark attendance (remove date)
export const markAttendance = createAsyncThunk(
  '/attendance/mark',
  async ({ semester, subject, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/attendance/${semester}/mark`, {
        subject,
        status  // ✨ REMOVED: date (auto today)
      });
      showToast.success(res.data.message);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to mark attendance';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ✨ UPDATE: Add subject (include initial classes)
export const addSubject = createAsyncThunk(
  '/attendance/addSubject',
  async ({ semester, subject, targetPercentage, initialTotalClasses, initialPresentClasses }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/attendance/${semester}/subject`, {
        subject,
        targetPercentage,
        initialTotalClasses,    // ✨ NEW
        initialPresentClasses   // ✨ NEW
      });
      showToast.success(res.data.message);
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to add subject';
      showToast.error(message);
      return rejectWithValue(message);
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setCurrentSemester: (state, action) => {
      state.currentSemester = action.payload;
      localStorage.setItem('currentSemester', action.payload);
    },
    clearAttendance: (state) => {
      state.attendance = null;
      state.stats = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Attendance
      .addCase(getAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload.data;
      })
      .addCase(getAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Subject
      .addCase(addSubject.pending, (state) => {
        state.adding = true;
        state.error = null;
      })
      .addCase(addSubject.fulfilled, (state, action) => {
        state.adding = false;
        // Refresh will be handled by component
      })
      .addCase(addSubject.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload;
      })

      // Mark Attendance
.addCase(markAttendance.pending, (state) => {
  state.marking = true;
  state.error = null;
})
.addCase(markAttendance.fulfilled, (state, action) => {
  state.marking = false;
  // ✨ FIXED: Update the entire subject object
  if (state.attendance && state.attendance.subjects) {
    const subjectIndex = state.attendance.subjects.findIndex(
      s => s.subject === action.payload.data.subject
    );
    if (subjectIndex !== -1) {
      // ✨ REPLACE entire subject with new data from backend
      state.attendance.subjects[subjectIndex] = action.payload.data;
    }
  }
})
.addCase(markAttendance.rejected, (state, action) => {
  state.marking = false;
  state.error = action.payload;
})


      // Update Target
      .addCase(updateTarget.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateTarget.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateTarget.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Delete Subject
      .addCase(deleteSubject.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.deleting = false;
        if (state.attendance && state.attendance.subjects) {
          state.attendance.subjects = state.attendance.subjects.filter(
            s => s.subject !== action.payload.subject
          );
        }
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })

      // Get Stats
      .addCase(getAttendanceStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAttendanceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(getAttendanceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✨ ADD to extraReducers
      .addCase(editSubject.pending, (state) => {
        state.editing = true;
      })
      .addCase(editSubject.fulfilled, (state) => {
        state.editing = false;
      })
      .addCase(editSubject.rejected, (state, action) => {
        state.editing = false;
        state.error = action.payload;
      })

      .addCase(getSubjectDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubjectDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.subjectDetails = action.payload.data;
      })
      .addCase(getSubjectDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  }
});

export const { setCurrentSemester, clearAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
