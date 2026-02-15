import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../HELPERS/axiosInstance"
import { showToast } from "../../HELPERS/Toaster";
import {  trackNoteView } from "./filterAnalyticsSlice";



const initialState = {
    notes: [],
    currentNote: null,
    // ✨ NEW: Pagination state
    pagination: {
        nextCursor: null,
        hasMore: true,
        isLoadingMore: false
    },
    viewers: {
        data: [],
        pagination: {
            current_page: 1,
            total_pages: 0,
            total_viewers: 0,
            viewers_per_page: 20
        },
        loading: false,
        error: null
    },
    totalNotes: 0,
    loading: false,
    uplodaing: false,
    updating: false,
    deleting: false,
    rating: false,
    bookmarkingNotes: [],//new array of note ids being bookmarked
    downloadingNotes: [],//new array of note ids being downloading
    // ✅ NEW: Recommendations State
    recommendedNotes: [],
    adminNotes: [],
    recommendationsLoading: false,
    toggleRecommendLoading: false,
    recommendationsError: null,
    lockToggleLoading: false,
    lockToggleError: null,
    stats: {
        total: 0,
        categories: {},
        loading: false,
        error: null
    },
    error: null,
    filters: {
        subject: '',
        semester: '',
        unit: '', // ✅ NEW: For chapter/unit filter
        university: '',
        course: '',
        category: ''
    },

}

export const registerNote = createAsyncThunk('/note/register', async (data) => {
    try {
        const res = await axiosInstance.post("/notes", data);

        showToast.success(res?.data?.message || "Note uploded succesfully");
        return res.data;
    } catch (e) {
        showToast.error(e?.response?.data?.message || "Failed to upload note!")
    }
})

// ✨ NEW: Thunk for fetching next page
export const getNextNotesPage = createAsyncThunk(
    'note/getNextPage',
    async (params, { rejectWithValue }) => {
        try {
            // params = { cursor, filters }
            const queryParams = new URLSearchParams();

            // Add cursor
            if (params.cursor) {
                queryParams.append('cursor', params.cursor);
            }

            // Add filters
            if (params.filters) {
                Object.entries(params.filters).forEach(([key, value]) => {
                    if (value && value !== '') {
                        queryParams.append(key, value);
                    }
                });
            }

            const response = await axiosInstance.get(
                `/api/v1/notes?${queryParams.toString()}`
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch notes');
        }
    }
);

export const getAllNotes = createAsyncThunk(
    "note/getAllNotes",
    async ({ filters = {}, cursor = null }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== "") {
                    params.append(key, value);
                }
            });

            if (cursor) {
                params.append("cursor", cursor);
            }

            const res = await axiosInstance.get(`/notes?${params.toString()}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch notes"
            );
        }
    }
);

export const getSemesterPreviewNotes = createAsyncThunk(
    "note/getSemesterPreviewNotes",
    async (semester, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(
                `/notes/preview?semester=${semester}`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to load semester preview"
            );
        }
    }
);
export const getNote = createAsyncThunk("/note/notedetails", async (noteId, { dispatch, rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/notes/${noteId}`);
        
    //   console.log('✅ [NOTE] Details received');

      // 🔥 Track view (fire-and-forget, don't await)
      dispatch(trackNoteView(noteId))
        // .unwrap()
        // .then(() => console.log('✅ [NOTE] View tracked'))
        // .catch(() => console.warn('⚠️ [NOTE] View tracking failed (non-critical)'));

        return res.data;
    } catch (e) {
        showToast.error(e?.response?.data?.message || "Failed to fetch note!")
    }
})

export const updateNote = createAsyncThunk("/note/updatenote", async ({ noteId, data }) => {
    try {
        const res = await axiosInstance.put(`/notes/${noteId}`, data);
        showToast.success(res?.data?.message || "Note updated successfully!");
        return res.data;
    } catch (e) {
        showToast.error(e?.response?.data?.message || "Failed to update notes")
    }
})

export const deleteNote = createAsyncThunk("/note/deleteNote", async (noteId) => {
    try {
        const res = await axiosInstance.delete(`/notes/${noteId}`);
        showToast.success(res?.data?.message || "Note deleted successfully!");
        return res.data;
    } catch (e) {
        showToast.error(e?.response?.data?.message || "Failed to delete note");
    }
})

export const addRating = createAsyncThunk("/note/addrating", async ({ noteId, rating, review }) => {
    try {
        const res = await axiosInstance.post(`/notes/${noteId}/rate`, { rating, review })
        showToast.success(res?.data?.message || "Rating added successfully!");
        return res.data;
    } catch (e) {
        showToast.error(e?.response?.data?.message || "Failed to add rating!")
    }
})

// Fix your toggleBookmark thunk - the issue is in error handling
export const toggleBookmark = createAsyncThunk("/note/togglebookmark", async (noteId, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/notes/${noteId}/bookmark`);
        showToast.success(res?.data?.message);
        return res.data; // Make sure this returns the correct structure
    } catch (e) {
        const message = e?.response?.data?.message || "Failed to toggle bookmark!";
        showToast.error(message);
        return rejectWithValue(message);
    }
});


// Fix downloadnote thunk
// Frontend - Handle download properly
// export const downloadnote = createAsyncThunk("/note/downloadNote", async ({ noteId, title }, { rejectWithValue }) => {
//     try {
//         // Get the download URL from backend
//         const res = await axiosInstance.get(`/notes/${noteId}/download`);

//         if (res.data.success) {
//             const { downloadUrl, filename } = res.data.data;

//             // SIMPLE DIRECT DOWNLOAD - This will work 100%
//             const link = document.createElement('a');
//             link.href = downloadUrl;
//             link.download = filename;
//             link.target = '_blank';
//             link.rel = 'noopener noreferrer';

//             // Trigger download
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);

//             showToast.success(`Note downloaded successfully!`);
//             return { noteId };
//         }

//     } catch (e) {
//         console.error('Download error:', e);
//         const message = e?.response?.data?.message || "Failed to download note!";
//         showToast.error(message);
//         return rejectWithValue(message);
//     }
// });
export const downloadnote = createAsyncThunk("/note/downloadNote", async ({ noteId, title }, { rejectWithValue }) => {
    try {
        // Get the file blob directly from backend
        const res = await axiosInstance.get(`/notes/${noteId}/download`, {
            responseType: 'blob' // Expect binary blob response
        });
        console.log('Downloaded blob size:', res.data.size, 'bytes'); // Check size here
        // Create object URL from blob
        const blob = res.data;
        const blobUrl = window.URL.createObjectURL(blob);

        // Create link for download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${title}.pdf`; // Use title from params

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        window.URL.revokeObjectURL(blobUrl);

         // 🔥 IMPORTANT — mark conversion
      // 🔥 Mark conversion (with error handling)
     // 🔥 DIRECT NETWORK REQUEST (fire-and-forget)
     
      console.log('🔥 STARTING ANALYTICS BLOCK'); // ← Should see this!

      try {
        console.log('🎯 Marking download in analytics...');
        
        const sessionId = localStorage.getItem("sessionId");
        
        if (sessionId) {
          const analyticsRes = await axiosInstance.post(
            "/filter-analytics/mark-download",
            {},
            {
              headers: {
                "x-session-id": sessionId
              }
            }
          );
          
          console.log('✅ Analytics: Download marked successfully', analyticsRes.data);
        } else {
          console.warn('⚠️ No session ID found, skipping analytics');
        }
      } catch (analyticsError) {
        // Don't fail the download if analytics fails
        console.warn('⚠️ Analytics failed (non-critical):', analyticsError.message);
      }
        showToast.success(`Note downloaded successfully!`);
        return { noteId };

    } catch (e) {
        console.error('Download error:', e);
        const message = e?.response?.data?.message || "Failed to download note!";
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const incrementViewCount = createAsyncThunk("/note/incrementView", async (noteId) => {
    try {
        const res = await axiosInstance.get(`/notes/${noteId}/view`);
        return res.data;
    } catch (e) {
        console.error('View increment error:', e);
    }
});
// ✅ THUNK - Define ONCE only!
export const getNoteViewers = createAsyncThunk(
    "note/getNoteViewers",
    async ({ noteId, page = 1, limit = 20 }, { rejectWithValue }) => {
        try {
            console.log('📤 THUNK: Fetching viewers for noteId:', noteId);
            const res = await axiosInstance.get(
                `/notes/${noteId}/viewers?page=${page}&limit=${limit}`
            );
            console.log('✅ THUNK: Response received:', res.data);
            return res.data;
        } catch (error) {
            console.error('❌ THUNK: Error:', error.message);
            return rejectWithValue(error?.response?.data?.message || "Failed to fetch viewers");
        }
    }
);

export const toggleRecommendNote = createAsyncThunk(
    "/note/toggleRecommend",
    async ({ noteId, recommended, rank }) => {
        try {
            const res = await axiosInstance.patch(
                `/notes/admin/recommend/${noteId}`,
                {
                    recommended,
                    rank: recommended ? rank || 1 : 0
                }
            );
            showToast.success(res?.data?.message || "Recommendation updated");
            return res.data;
        } catch (e) {
            showToast.error(e?.response?.data?.message || "Failed to update recommendation");
            throw e;
        }
    }
);

export const getRecommendedNotes = createAsyncThunk(
    "/note/getRecommended",
    async () => {
        try {
            const res = await axiosInstance.get("/notes/admin/recommendations");
            return res.data;
        } catch (e) {
            showToast.error(e?.response?.data?.message || "Failed to fetch recommended notes");
            throw e;
        }
    }
);

export const getAllNotesForAdmin = createAsyncThunk(
    "/note/getAllAdmin",
    async (filters = {}) => {
        try {
            const queryparams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryparams.append(key, value);
            });
            const res = await axiosInstance.get(`/notes/admin/all?${queryparams.toString()}`);
            return res.data;
        } catch (e) {
            showToast.error(e?.response?.data?.message || "Failed to fetch notes");
            throw e;
        }
    }
);

export const getNoteStats = createAsyncThunk(
    "note/getStats",
    async (filters, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();

            Object.entries(filters).forEach(([k, v]) => {
                if (v) params.append(k, v);
            });

            const res = await axiosInstance.get(`/notes/stats?${params.toString()}`);
            return res.data;
        } catch (err) {
            return rejectWithValue("Failed to fetch stats");
        }
    }
);

// 🔒 Toggle Lock / Unlock Note (Admin)
export const toggleLockNote = createAsyncThunk(
    "/note/toggleLock",
    async ({ noteId, isLocked, previewPages }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch(
                `/notes/admin/lock/${noteId}`,
                {
                    isLocked,
                    previewPages
                }
            );

            showToast.success(
                res?.data?.message || `Note ${isLocked ? "locked" : "unlocked"} successfully`
            );

            return res.data;
        } catch (e) {
            const message =
                e?.response?.data?.message || "Failed to update lock status";
            showToast.error(message);
            return rejectWithValue(message);
        }
    }
);


const noteSlice = createSlice({
    name: "note",
    initialState,
    reducers: {
        clearCurrentNote: (state) => {
            state.currentNote = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        // ✨ NEW: Reset pagination when filters change
        resetPagination: (state) => {
            state.notes = [];
            state.pagination = {
                nextCursor: null,
                hasMore: true,
                isLoadingMore: false
            };
        },
        // ✨ NEW: Clear notes for fresh load
        clearNotes: (state) => {
            state.notes = [];
            state.currentNote = null;
            state.totalNotes = 0;
            state.error = null;
            state.pagination = {
                nextCursor: null,
                hasMore: true,
                isLoadingMore: false
            };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },

        // ✅ ADD THIS REDUCER
        updateNoteViews: (state, action) => {
            const { noteId, views } = action.payload;

            // Update in notes array (for NoteCard display)
            const index = state.notes.findIndex(note => note._id === noteId);
            if (index !== -1) {
                state.notes[index] = {
                    ...state.notes[index],
                    views: views
                };
            }

            // Update currentNote if same
            if (state.currentNote?._id === noteId) {
                state.currentNote = {
                    ...state.currentNote,
                    views: views
                };
            }
        },
        // ✅ NEW: Clear viewers
        clearViewers: (state) => {
            state.viewers = {
                data: [],
                pagination: initialState.viewers.pagination,
                loading: false,
                error: null
            };
        },
        // ✅ NEW: Recommendations Reducers
        clearRecommendedNotes: (state) => {
            state.recommendedNotes = [];
            state.adminNotes = [];
            state.recommendationsError = null;
        },
        clearRecommendationError: (state) => {
            state.recommendationsError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ============================================
            // ✅ NEW: GET NOTE VIEWERS
            // ============================================
            .addCase(getNoteViewers.pending, (state) => {
                state.viewers.loading = true;
                state.viewers.error = null;
            })
            .addCase(getNoteViewers.fulfilled, (state, action) => {
                state.viewers.loading = false;
                state.viewers.data = action.payload.data.viewers;
                state.viewers.pagination = action.payload.data.pagination;
            })
            .addCase(getNoteViewers.rejected, (state, action) => {
                state.viewers.loading = false;
                state.viewers.error = action.payload || "Failed to fetch viewers";
                state.viewers.data = [];
            })

            //register note
            .addCase(registerNote.pending, (state) => {
                state.uplodaing = true;
                state.error = null;
            })
            .addCase(registerNote.fulfilled, (state, action) => {
                state.uplodaing = false;
                state.notes.unshift(action?.payload?.data);
                state.totalNotes += 1;
            })
            .addCase(registerNote.rejected, (state, action) => {
                state.uplodaing = false;
                state.error = action?.payload?.message || "Failed to upload note"
            })

            .addCase(getAllNotes.pending, (state, action) => {
                const isPagination = Boolean(action.meta.arg?.cursor);

                if (isPagination) {
                    state.pagination.isLoadingMore = true;
                } else {
                    state.loading = true;
                }

                state.error = null;
            })
            .addCase(getAllNotes.fulfilled, (state, action) => {
                const isPagination = Boolean(action.meta.arg?.cursor);
                const { notes, nextCursor, hasMore } = action.payload.data;

                if (!isPagination) {
                    state.notes = notes;
                } else {
                    state.notes.push(...notes);
                }

                state.pagination.nextCursor = nextCursor;
                state.pagination.hasMore = hasMore;
                state.pagination.isLoadingMore = false;
                state.loading = false;
            })
            .addCase(getAllNotes.rejected, (state, action) => {
                state.loading = false;
                state.pagination.isLoadingMore = false;
                state.error = action.payload || "Failed to fetch notes";
            })
            .addCase(getSemesterPreviewNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getSemesterPreviewNotes.fulfilled, (state, action) => {
                state.loading = false;

                // 🔥 treat preview as fresh load
                state.notes = action.payload.data.notes;

                state.pagination.nextCursor = action.payload.data.nextCursor;
                state.pagination.hasMore = action.payload.data.hasMore;
            })

            .addCase(getSemesterPreviewNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getNoteStats.pending, (state) => {
                state.stats.loading = true;
            })
            .addCase(getNoteStats.fulfilled, (state, action) => {
                state.stats.loading = false;
                state.stats.total = action.payload.data.total;
                state.stats.categories = action.payload.data.categories;
            })
            .addCase(getNoteStats.rejected, (state, action) => {
                state.stats.loading = false;
                state.stats.error = action.payload;
            });
        // ===== GET NEXT PAGE (Infinite scroll) =====
        builder
            .addCase(getNextNotesPage.pending, (state) => {
                state.pagination.isLoadingMore = true;
            })
            .addCase(getNextNotesPage.fulfilled, (state, action) => {
                state.pagination.isLoadingMore = false;
                // ✨ APPEND new notes to existing array
                state.notes = [...state.notes, ...action.payload.data];
                state.totalNotes += action.payload.count;
                // ✨ Update pagination for next fetch
                state.pagination.nextCursor = action.payload.nextCursor;
                state.pagination.hasMore = action.payload.hasMore;
            })
            .addCase(getNextNotesPage.rejected, (state, action) => {
                state.pagination.isLoadingMore = false;
                state.error = action.payload || "Failed to load more notes";
            })

            //get single note
            .addCase(getNote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getNote.fulfilled, (state, action) => {
                state.loading = false;
                state.currentNote = action?.payload?.data;
            })
            .addCase(getNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action?.payload || "Failed to fetch note!";
                state.currentNote = null; // Clear current note on error
                // ✅ Also update in notes array
                const index = state.notes.findIndex(n => n._id === action?.payload?.data?._id);
                if (index !== -1) {
                    state.notes[index] = action?.payload?.data;
                }
            })

            // In your noteSlice.js - fix the updateNote extraReducer
            .addCase(updateNote.fulfilled, (state, action) => {
                state.updating = false;
                const updatedNote = action?.payload?.data;

                // Update in notes array
                const index = state.notes?.findIndex(note => note._id === updatedNote._id);
                if (index !== -1) {
                    state.notes[index] = updatedNote;
                }

                // Update current note if it's the same
                if (state.currentNote?._id === updatedNote._id) {
                    state.currentNote = updatedNote;
                }
            })
            .addCase(updateNote.rejected, (state, action) => {
                state.updating = false; // Fixed: was state.deleting
                state.error = action?.payload?.message || "Failed to update note";
            })


            //add rating
            .addCase(addRating.pending, (state) => {
                state.rating = true;
                state.error = null;
            })
            .addCase(addRating.fulfilled, (state, action) => {
                state.rating = false;
                const updateNote = action.payload.data;
                const index = state.notes.findIndex(note => note._id === updateNote._id);
                if (index !== -1) {
                    state.notes[index] = updateNote;
                }
                if (state.currentNote?._id === updateNote._id) {
                    state.currentNote = updateNote
                }
            })
            .addCase(addRating.rejected, (state, action) => {
                state.rating = false;
                state.error = action?.payload?.message || "Failed to add rating!"
            })

            //toggle bookmark
            // .addCase(addRating.rejected,(state,action)=>{
            //     state.rating=false;
            //     state.error=action.payload?.message||"Failed to add rating";
            // })

            // In your noteSlice.js - Fix the toggleBookmark.fulfilled
            // Update the reducer

            .addCase(toggleBookmark.pending, (state, action) => {
                const noteId = action.meta.arg;
                if (!state.bookmarkingNotes.includes(noteId)) {
                    state.bookmarkingNotes.push(noteId);
                }
                state.error = null;
            })

            .addCase(toggleBookmark.fulfilled, (state, action) => {
                //state.bookmarking = false;
                const updatedNote = action.payload.data; // Make sure backend returns { data: updatedNote }
                const noteId = updatedNote._id;

                //remove from bookmarking array
                state.bookmarkingNotes = state.bookmarkingNotes.filter(id => id !== noteId);

                // Update in notes array
                const index = state.notes.findIndex(n => n._id === updatedNote._id);
                if (index !== -1) {
                    state.notes[index] = updatedNote;
                }

                // Update current note
                if (state.currentNote?._id === updatedNote._id) {
                    state.currentNote = updatedNote;
                }
            })

            .addCase(toggleBookmark.rejected, (state, action) => {
                //state.bookmarking = false;
                const noteId = action.meta.arg;

                //remove from bookmarking array
                state.bookmarkingNotes = state.bookmarkingNotes.filter(id => id !== noteId);

                state.error = action?.payload?.message || "Failed to toggle bookmark"
            })

            //download note
            .addCase(downloadnote.pending, (state, action) => {
                const noteId = action.meta.arg.noteId;
                if (!state.downloadingNotes.includes(noteId)) {
                    state.downloadingNotes.push(noteId);
                }
                state.error = null;
            })
            .addCase(downloadnote.fulfilled, (state, action) => {
                //optionally increment download count in local state
                const noteId = action?.payload?.noteId;

                //remove from downloading array
                state.downloadingNotes = state.downloadingNotes.filter(id => id !== noteId);

                const index = state.notes.findIndex(note => note._id === noteId);
                if (index !== -1) {
                    state.notes[index].downloads += 1;
                }
                if (state.currentNote?._id === noteId) {
                    state.currentNote.downloads += 1;
                }
            })
            .addCase(downloadnote.rejected, (state, action) => {

                const noteId = action.meta.arg.noteId;

                //remove from downloading array
                state.downloadingNotes = state.downloadingNotes.filter(id => id !== noteId);

                state.error = action?.payload?.message || "Failed to download note"
            })
            // Add to extraReducers
            .addCase(deleteNote.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.deleting = false;
                const noteId = action.payload.noteId;

                // Remove from notes array
                state.notes = state.notes.filter(note => note._id !== noteId);
                state.totalNotes = Math.max(0, state.totalNotes - 1);

                // Clear current note if it's the deleted one
                if (state.currentNote?._id === noteId) {
                    state.currentNote = null;
                }
            })
            .addCase(deleteNote.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.error.message;
            })
            // Inside your .addCase() chain, add these:

            // ============================================
            // ✅ NEW: TOGGLE RECOMMENDATION
            // ============================================
            .addCase(toggleRecommendNote.pending, (state) => {
                state.toggleRecommendLoading = true;
                state.recommendationsError = null;
            })
            .addCase(toggleRecommendNote.fulfilled, (state, action) => {
                state.toggleRecommendLoading = false;
                const updatedNote = action.payload.data;

                // Update in notes array
                const noteIndex = state.notes.findIndex(n => n._id === updatedNote._id);
                if (noteIndex !== -1) {
                    state.notes[noteIndex] = updatedNote;
                }

                // Update in admin notes array
                const adminIndex = state.adminNotes.findIndex(n => n._id === updatedNote._id);
                if (adminIndex !== -1) {
                    state.adminNotes[adminIndex] = updatedNote;
                }

                // Update in recommended notes
                if (updatedNote.recommended) {
                    const recIndex = state.recommendedNotes.findIndex(n => n._id === updatedNote._id);
                    if (recIndex !== -1) {
                        state.recommendedNotes[recIndex] = updatedNote;
                    } else {
                        state.recommendedNotes.push(updatedNote);
                    }
                } else {
                    state.recommendedNotes = state.recommendedNotes.filter(n => n._id !== updatedNote._id);
                }

                // Update current note
                if (state.currentNote?._id === updatedNote._id) {
                    state.currentNote = updatedNote;
                }
            })
            .addCase(toggleRecommendNote.rejected, (state, action) => {
                state.toggleRecommendLoading = false;
                state.recommendationsError = action.error.message || "Failed to update recommendation";
            })

            // ============================================
            // ✅ NEW: GET RECOMMENDED NOTES
            // ============================================
            .addCase(getRecommendedNotes.pending, (state) => {
                state.recommendationsLoading = true;
                state.recommendationsError = null;
            })
            .addCase(getRecommendedNotes.fulfilled, (state, action) => {
                state.recommendationsLoading = false;
                state.recommendedNotes = action.payload.data;
            })
            .addCase(getRecommendedNotes.rejected, (state, action) => {
                state.recommendationsLoading = false;
                state.recommendationsError = action.error.message || "Failed to fetch recommended notes";
                state.recommendedNotes = [];
            })

            // ============================================
            // ✅ NEW: GET ALL NOTES FOR ADMIN
            // ============================================
            .addCase(getAllNotesForAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllNotesForAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.adminNotes = action.payload.data;
                state.totalNotes = action.payload.count;
            })
            .addCase(getAllNotesForAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch notes";
                state.adminNotes = [];
            })
            // ============================================
            // 🔒 TOGGLE NOTE LOCK / UNLOCK
            // ============================================
            .addCase(toggleLockNote.pending, (state) => {
                state.lockToggleLoading = true;
                state.lockToggleError = null;
            })

            .addCase(toggleLockNote.fulfilled, (state, action) => {
                state.lockToggleLoading = false;

                const { id, isLocked, previewPages } = action.payload.data;

                const update = (note) => ({
                    ...note,
                    isLocked,
                    previewPages
                });

                const i = state.notes.findIndex(n => n._id === id);
                if (i !== -1) state.notes[i] = update(state.notes[i]);

                if (state.currentNote?._id === id) {
                    state.currentNote = update(state.currentNote);
                }

                const ai = state.adminNotes.findIndex(n => n._id === id);
                if (ai !== -1) state.adminNotes[ai] = update(state.adminNotes[ai]);
            })
            
            .addCase(toggleLockNote.rejected, (state, action) => {
                state.lockToggleLoading = false;
                state.lockToggleError = action.payload || "Failed to toggle lock";
            })
    }

});

//export acrtion
export const {
    clearCurrentNote,
    setFilters,
    clearFilters,
    resetPagination,
    clearError,
    clearNotes,
    updateNoteViews, // ✅ EXPORT THIS
    clearViewers, // ✅ NEW
    // ✅ NEW EXPORTS
    clearRecommendedNotes,
    clearRecommendationError
} = noteSlice.actions;

//export reducer
export default noteSlice.reducer;