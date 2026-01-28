import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

/* ===========================
   THUNKS
=========================== */

// 📥 Fetch all saved presets
export const fetchSavedFilters = createAsyncThunk(
    "savedFilters/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/saved-filters");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch saved filters"
            );
        }
    }
);

// ➕ Create new preset
export const createSavedFilter = createAsyncThunk(
    "savedFilters/create",
    async ({ name, filters }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/saved-filters", {
                name,
                filters
            });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to save filter"
            );
        }
    }
);

// ❌ Delete preset
export const deleteSavedFilter = createAsyncThunk(
    "savedFilters/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/saved-filters/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to delete preset"
            );
        }
    }
);

// ⭐ Set default preset
export const setDefaultSavedFilter = createAsyncThunk(
    "savedFilters/setDefault",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/saved-filters/${id}/default`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to set default preset"
            );
        }
    }
);

// 📊 Track preset usage (silent)
export const trackPresetUsage = createAsyncThunk(
    "savedFilters/trackUsage",
    async (id) => {
        try {
            await axiosInstance.post(`/saved-filters/${id}/use`);
            return id;
        } catch {
            // ❌ intentionally silent – analytics should never break UX
            return null;
        }
    }
);

/* ===========================
   SLICE
=========================== */

const savedFilterSlice = createSlice({
    name: "savedFilters",
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        clearSavedFilterError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder

            // 🔄 FETCH
            .addCase(fetchSavedFilters.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSavedFilters.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchSavedFilters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ➕ CREATE
            .addCase(createSavedFilter.pending, (state) => {
                state.loading = true;
            })
            .addCase(createSavedFilter.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(createSavedFilter.rejected, (state, action) => {
                state.error = action.payload;
            })

            // ❌ DELETE
            .addCase(deleteSavedFilter.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    (item) => item._id !== action.payload
                );
            })


            // ⭐ DEFAULT
            .addCase(setDefaultSavedFilter.fulfilled, (state, action) => {
                state.items = state.items.map((item) => ({
                    ...item,
                    isDefault: item._id === action.payload._id
                }));
            });
    }
});

export const { clearSavedFilterError } = savedFilterSlice.actions;

export default savedFilterSlice.reducer;