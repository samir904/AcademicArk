import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

/* =====================================================
   🔧 ADMIN: MANAGE SEARCH DATA (WRITE ACTIONS)
===================================================== */

/* -------------------- SYNONYMS -------------------- */

/**
 * ➕ Create synonym
 */
export const createSearchSynonym = createAsyncThunk(
  "searchAdmin/createSynonym",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/search/admin/manage/synonym",
        payload,
        { withCredentials: true }
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue("Failed to create synonym");
    }
  }
);

/**
 * ✏️ Update synonym
 */
export const updateSearchSynonym = createAsyncThunk(
  "searchAdmin/updateSynonym",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/search/admin/manage/synonym/${id}`,
        data,
        { withCredentials: true }
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue("Failed to update synonym");
    }
  }
);

/**
 * 🔁 Enable / Disable synonym
 */
export const toggleSearchSynonym = createAsyncThunk(
  "searchAdmin/toggleSynonym",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/search/admin/manage/synonym/${id}/toggle`,
        {},
        { withCredentials: true }
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue("Failed to toggle synonym");
    }
  }
);

/* -------------------- CORRECTIONS -------------------- */

/**
 * ➕ Create correction
 */
export const createSearchCorrection = createAsyncThunk(
  "searchAdmin/createCorrection",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/search/admin/manage/correction",
        payload,
        { withCredentials: true }
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue("Failed to create correction");
    }
  }
);

/**
 * ✏️ Update correction
 */
export const updateSearchCorrection = createAsyncThunk(
  "searchAdmin/updateCorrection",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/search/admin/manage/correction/${id}`,
        data,
        { withCredentials: true }
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue("Failed to update correction");
    }
  }
);

/**
 * 🔁 Enable / Disable correction
 */
export const toggleSearchCorrection = createAsyncThunk(
  "searchAdmin/toggleCorrection",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/search/admin/manage/correction/${id}/toggle`,
        {},
        { withCredentials: true }
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue("Failed to toggle correction");
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const initialState = {
  loading: false,
  error: null,
  lastAction: null // success / failed
};

const searchAdminManageSlice = createSlice({
  name: "searchAdminManage",
  initialState,
  reducers: {
    resetSearchAdminManageState: () => initialState
  },
  extraReducers: (builder) => {
    builder

      /* Generic loading handler */
      .addMatcher(
        (action) => action.type.startsWith("searchAdmin/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      /* Generic success handler */
      .addMatcher(
        (action) => action.type.startsWith("searchAdmin/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
          state.lastAction = "success";
        }
      )

      /* Generic error handler */
      .addMatcher(
        (action) => action.type.startsWith("searchAdmin/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.lastAction = "failed";
          state.error = action.payload;
        }
      );
  }
});

export const { resetSearchAdminManageState } =
  searchAdminManageSlice.actions;

export default searchAdminManageSlice.reducer;
