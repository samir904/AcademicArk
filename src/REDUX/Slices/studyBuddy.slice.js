import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../HELPERS/axiosInstance';

// Get chat history
export const getChatHistory = createAsyncThunk(
  'studyBuddy/getChatHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/study-buddy/chat/history');
      return response.data.messages;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat history');
    }
  }
);

// Send message
export const sendMessage = createAsyncThunk(
  'studyBuddy/sendMessage',
  async ({ message, context }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/study-buddy/chat/message', {
        message,
        context
      });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

// Clear chat
export const clearChat = createAsyncThunk(
  'studyBuddy/clearChat',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.delete('/study-buddy/chat/clear');
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear chat');
    }
  }
);

const initialState = {
  messages: [],
  loading: false,
  error: null,
  isSending: false
};

const studyBuddySlice = createSlice({
  name: 'studyBuddy',
  initialState,
  reducers: {
    // Add local message before API response
    addUserMessage: (state, action) => {
      state.messages.push({
        role: 'user',
        content: action.payload,
        timestamp: new Date()
      });
    }
  },
  extraReducers: (builder) => {
    // Get chat history
    builder
      .addCase(getChatHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(getChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        state.messages.push({
          role: 'assistant',
          content: action.payload,
          timestamp: new Date()
        });
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      });

    // Clear chat
    builder
      .addCase(clearChat.fulfilled, (state) => {
        state.messages = [];
        state.error = null;
      })
      .addCase(clearChat.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { addUserMessage } = studyBuddySlice.actions;
export default studyBuddySlice.reducer;
