import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

// ============================================
// 🎯 ASYNC THUNKS
// ============================================

// Fetch all SEO pages (admin list view)
export const fetchAllSeoPages = createAsyncThunk(
  "seoAdmin/fetchAll",
  async ({ pageType, published, search, sortBy }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (pageType && pageType !== "all") params.append("pageType", pageType);
      if (published && published !== "all") params.append("published", published);
      if (search) params.append("search", search);
      if (sortBy) params.append("sortBy", sortBy);

      const response = await axiosInstance.get(
        `/seo/admin/all?${params.toString()}`,
        { withCredentials: true }
      );
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch SEO pages"
      );
    }
  }
);

// Get single SEO page by ID (for editing)
export const fetchSeoPageById = createAsyncThunk(
  "seoAdmin/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/seo/admin/page/${id}`,
        { withCredentials: true }
      );
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch SEO page"
      );
    }
  }
);

// Create new SEO page
export const createSeoPage = createAsyncThunk(
  "seoAdmin/create",
  async (pageData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/seo/admin/create",
        pageData,
        { withCredentials: true }
      );
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create SEO page"
      );
    }
  }
);

// Update existing SEO page
export const updateSeoPage = createAsyncThunk(
  "seoAdmin/update",
  async ({ id, pageData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/seo/admin/update/${id}`,
        pageData,
        { withCredentials: true }
      );
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update SEO page"
      );
    }
  }
);

// Delete SEO page
export const deleteSeoPage = createAsyncThunk(
  "seoAdmin/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `/seo/admin/delete/${id}`,
        { withCredentials: true }
      );
      
      return id; // Return ID to remove from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete SEO page"
      );
    }
  }
);

// Preview SEO page (test filters)
export const previewSeoPage = createAsyncThunk(
  "seoAdmin/preview",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/seo/admin/preview",
        { filters },
        { withCredentials: true }
      );
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to preview page"
      );
    }
  }
);

// Bulk update status (publish/unpublish)
export const bulkUpdateStatus = createAsyncThunk(
  "seoAdmin/bulkStatus",
  async ({ ids, published }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/seo/admin/bulk-status",
        { ids, published },
        { withCredentials: true }
      );
      
      return { ids, published };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// ============================================
// 🎯 SLICE
// ============================================

const initialState = {
  // SEO pages list
  pages: [],
  totalPages: 0,

  // Current page being edited
  currentPage: null,

  // Preview data
  previewData: null,

  // Filters
  filters: {
    pageType: "all",
    published: "all",
    search: "",
    sortBy: "-createdAt"
  },

  // Selected pages for bulk operations
  selectedIds: [],

  // Loading states
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  previewing: false,
  bulkUpdating: false,

  // Error states
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  previewError: null,

  // Success messages
  successMessage: null
};

const seoAdminSlice = createSlice({
  name: "seoAdmin",
  initialState,

  reducers: {
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Toggle selected page
    toggleSelectedPage: (state, action) => {
      const id = action.payload;
      const index = state.selectedIds.indexOf(id);
      
      if (index > -1) {
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedIds.push(id);
      }
    },

    // Select all pages
    selectAllPages: (state) => {
      state.selectedIds = state.pages.map(page => page._id);
    },

    // Deselect all pages
    deselectAllPages: (state) => {
      state.selectedIds = [];
    },

    // Clear current page
    clearCurrentPage: (state) => {
      state.currentPage = null;
    },

    // Clear preview data
    clearPreview: (state) => {
      state.previewData = null;
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.previewError = null;
    },

    // Clear success message
    clearSuccess: (state) => {
      state.successMessage = null;
    }
  },

  extraReducers: (builder) => {
    // ========================================
    // FETCH ALL SEO PAGES
    // ========================================
    builder
      .addCase(fetchAllSeoPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSeoPages.fulfilled, (state, action) => {
        state.loading = false;
        state.pages = action.payload;
        state.totalPages = action.payload.length;
      })
      .addCase(fetchAllSeoPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ========================================
    // FETCH SINGLE SEO PAGE
    // ========================================
    builder
      .addCase(fetchSeoPageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeoPageById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPage = action.payload;
      })
      .addCase(fetchSeoPageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ========================================
    // CREATE SEO PAGE
    // ========================================
    builder
      .addCase(createSeoPage.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createSeoPage.fulfilled, (state, action) => {
        state.creating = false;
        state.pages.unshift(action.payload); // Add to beginning
        state.totalPages += 1;
        state.successMessage = "SEO page created successfully";
      })
      .addCase(createSeoPage.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      });

    // ========================================
    // UPDATE SEO PAGE
    // ========================================
    builder
      .addCase(updateSeoPage.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateSeoPage.fulfilled, (state, action) => {
        state.updating = false;
        
        // Update in list
        const index = state.pages.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.pages[index] = action.payload;
        }
        
        // Update current page if it's the one being edited
        if (state.currentPage?._id === action.payload._id) {
          state.currentPage = action.payload;
        }
        
        state.successMessage = "SEO page updated successfully";
      })
      .addCase(updateSeoPage.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      });

    // ========================================
    // DELETE SEO PAGE
    // ========================================
    builder
      .addCase(deleteSeoPage.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteSeoPage.fulfilled, (state, action) => {
        state.deleting = false;
        
        // Remove from list
        state.pages = state.pages.filter(p => p._id !== action.payload);
        state.totalPages -= 1;
        
        // Remove from selected if present
        state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
        
        state.successMessage = "SEO page deleted successfully";
      })
      .addCase(deleteSeoPage.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload;
      });

    // ========================================
    // PREVIEW SEO PAGE
    // ========================================
    builder
      .addCase(previewSeoPage.pending, (state) => {
        state.previewing = true;
        state.previewError = null;
      })
      .addCase(previewSeoPage.fulfilled, (state, action) => {
        state.previewing = false;
        state.previewData = action.payload;
      })
      .addCase(previewSeoPage.rejected, (state, action) => {
        state.previewing = false;
        state.previewError = action.payload;
      });

    // ========================================
    // BULK UPDATE STATUS
    // ========================================
    builder
      .addCase(bulkUpdateStatus.pending, (state) => {
        state.bulkUpdating = true;
        state.error = null;
      })
      .addCase(bulkUpdateStatus.fulfilled, (state, action) => {
        state.bulkUpdating = false;
        
        const { ids, published } = action.payload;
        
        // Update status for all affected pages
        state.pages = state.pages.map(page => 
          ids.includes(page._id) 
            ? { ...page, published }
            : page
        );
        
        // Clear selection
        state.selectedIds = [];
        
        state.successMessage = `${ids.length} pages ${published ? 'published' : 'unpublished'}`;
      })
      .addCase(bulkUpdateStatus.rejected, (state, action) => {
        state.bulkUpdating = false;
        state.error = action.payload;
      });
  }
});

export const {
  setFilters,
  resetFilters,
  toggleSelectedPage,
  selectAllPages,
  deselectAllPages,
  clearCurrentPage,
  clearPreview,
  clearError,
  clearSuccess
} = seoAdminSlice.actions;

export default seoAdminSlice.reducer;
