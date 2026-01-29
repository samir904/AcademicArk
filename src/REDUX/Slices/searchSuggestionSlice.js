import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

/**
 * 🔍 Fetch search suggestions
 * Triggered while typing or after failed search
 */
export const fetchSearchSuggestions = createAsyncThunk(
  "searchSuggestion/fetch",
  async (query, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/search/suggestions?q=${encodeURIComponent(query)}`
      );

      return res.data.suggestions || [];
    } catch (error) {
      // Silent fail – suggestions must not break UX
      return rejectWithValue([]);
    }
  }
);

const initialState = {
  loading: false,
  suggestions: [],
  lastQuery: ""
};

const searchSuggestionSlice = createSlice({
  name: "searchSuggestion",
  initialState,
  reducers: {
    clearSuggestions: (state) => {
      state.suggestions = [];
      state.lastQuery = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchSuggestions.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchSearchSuggestions.rejected, (state) => {
        state.loading = false;
        state.suggestions = [];
      });
  }
});

export const { clearSuggestions } = searchSuggestionSlice.actions;
export default searchSuggestionSlice.reducer;
