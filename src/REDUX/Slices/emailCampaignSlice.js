// REDUX/Slices/emailCampaignSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance.js';

// ✅ Send personal email
export const sendPersonalEmail = createAsyncThunk(
  'emailCampaign/sendPersonal',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        '/admin/campaign/send-personal',
        payload
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send email');
    }
  }
);

const emailCampaignSlice = createSlice({
  name: 'emailCampaign',
  initialState: {
    sending: false,
    error:   null,
    success: null,
  },
  reducers: {
    clearEmailState: (state) => {
      state.sending = false;
      state.error   = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendPersonalEmail.pending, (state) => {
        state.sending = true;
        state.error   = null;
        state.success = null;
      })
      .addCase(sendPersonalEmail.fulfilled, (state, action) => {
        state.sending = false;
        state.success = action.payload.message;
      })
      .addCase(sendPersonalEmail.rejected, (state, action) => {
        state.sending = false;
        state.error   = action.payload;
      });
  },
});

export const { clearEmailState } = emailCampaignSlice.actions;
export default emailCampaignSlice.reducer;
