import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';
import { showToast } from '../../HELPERS/Toaster';

const initialState = {
loading: false,
error: null,
emailStats: null,
broadcastResult: null
};

export const sendBroadcastEmail = createAsyncThunk(
'/admin/sendBroadcastEmail',
async (data, { rejectWithValue }) => {
try {
const httpPromise = axiosInstance.post('/admin/email/broadcast-email', data);
const res = await showToast.promise(httpPromise, {
loading: 'Sending emails...',
success: (data) => data?.data?.message || 'Emails sent successfully!',
error: (error) => error?.response?.data?.message || 'Failed to send emails'
});
return res.data;
} catch (error) {
return rejectWithValue(error?.response?.data?.message || 'Failed to send emails');
}
}
);

export const getEmailStats = createAsyncThunk(
'/admin/getEmailStats',
async (_, { rejectWithValue }) => {
try {
const res = await axiosInstance.get('/admin/email/email-stats');
return res.data;
} catch (error) {
return rejectWithValue(error?.response?.data?.message || 'Failed to fetch stats');
}
}
);

const emailSlice = createSlice({
name: 'email',
initialState,
reducers: {
clearBroadcastResult: (state) => {
state.broadcastResult = null;
}
},
extraReducers: (builder) => {
builder
.addCase(sendBroadcastEmail.pending, (state) => {
state.loading = true;
state.error = null;
})
.addCase(sendBroadcastEmail.fulfilled, (state, action) => {
state.loading = false;
state.broadcastResult = action.payload.data;
})
.addCase(sendBroadcastEmail.rejected, (state, action) => {
state.loading = false;
state.error = action.payload;
})
.addCase(getEmailStats.fulfilled, (state, action) => {
state.emailStats = action.payload.data;
});
}
});

export const { clearBroadcastResult } = emailSlice.actions;
export default emailSlice.reducer;