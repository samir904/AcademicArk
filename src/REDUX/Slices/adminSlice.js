// REDUX/Slices/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';
import { showToast } from '../../HELPERS/Toaster';

// Async thunks
export const getDashboardStats = createAsyncThunk('/admin/getDashboardStats', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/admin/dashboard/stats');
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get dashboard stats';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const getAllUsers = createAsyncThunk('/admin/getAllUsers', async ({ page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get users';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const getAllNotesAdmin = createAsyncThunk('/admin/getAllNotes', async ({ page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/admin/notes?page=${page}&limit=${limit}&search=${search}`);
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get notes';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const deleteUser = createAsyncThunk('/admin/deleteUser', async (userId, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.delete(`/admin/users/${userId}`);
        showToast.success('User deleted successfully');
        return { userId, ...res.data };
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to delete user';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const deleteNoteAdmin = createAsyncThunk('/admin/deleteNote', async (noteId, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.delete(`/admin/notes/${noteId}`);
        showToast.success('Note deleted successfully');
        return { noteId, ...res.data };
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to delete note';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const updateUserRole = createAsyncThunk('/admin/updateUserRole', async ({ userId, role }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.put(`/admin/users/${userId}/role`, { role });
        showToast.success('User role updated successfully');
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to update user role';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const getRecentActivity = createAsyncThunk('/admin/getRecentActivity', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/admin/activity');
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get recent activity';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

const initialState = {
    loading: false,
    error: null,
    dashboardStats: null,
    users: [],
    notes: [],
    usersPagination: null,
    notesPagination: null,
    recentActivity: null
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearUsers: (state) => {
            state.users = [];
            state.usersPagination = null;
        },
        clearNotes: (state) => {
            state.notes = [];
            state.notesPagination = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Dashboard Stats
            .addCase(getDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardStats = action.payload.data;
            })
            .addCase(getDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get All Users
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data.users;
                state.usersPagination = action.payload.data.pagination;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get All Notes
            .addCase(getAllNotesAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllNotesAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = action.payload.data.notes;
                state.notesPagination = action.payload.data.pagination;
            })
            .addCase(getAllNotesAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user._id !== action.payload.userId);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Note
            .addCase(deleteNoteAdmin.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteNoteAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = state.notes.filter(note => note._id !== action.payload.noteId);
            })
            .addCase(deleteNoteAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update User Role
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload.data;
                state.users = state.users.map(user => 
                    user._id === updatedUser._id ? updatedUser : user
                );
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Recent Activity
            .addCase(getRecentActivity.pending, (state) => {
                state.loading = true;
            })
            .addCase(getRecentActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.recentActivity = action.payload.data;
            })
            .addCase(getRecentActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearUsers, clearNotes } = adminSlice.actions;
export default adminSlice.reducer;
