import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../HELPERS/axiosInstance"
import { showToast } from "../../HELPERS/Toaster";



const initialState = {
    notes: [],
    currentNote: null,
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
    error: null,
    filters: {
        subject: '',
        semester: '',
        university: '',
        course: '',
        category: ''
    }
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

export const getAllNotes = createAsyncThunk("/note/getallnotes", async (filters = {}) => {
    try {
        const queryparams = new URLSearchParams();

        //add filter to query params
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                queryparams.append(key, value)
            }
        });

        const res = await axiosInstance.get(`/notes?${queryparams.toString()}`);
        return res.data;
    } catch (e) {
        showToast.error(e?.response?.data?.message || "Failed to fetch notes!")
    }
})

export const getNote = createAsyncThunk("/note/notedetails", async (noteId) => {
    try {
        const res = await axiosInstance.get(`/notes/${noteId}`);
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

export const addRating = createAsyncThunk("/note/addrating", async ({noteId, rating, review}) => {
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
        clearFilters: (state) => {
            state.filters = {
                subject: "",
                semester: "",
                university: "",
                course: "",
                category: ""
            };
        },
        clearError: (state) => {
            state.error = null;
        },
        clearNotes: (state) => {
            state.notes = [];
            state.currentNote = null;
            state.totalNotes = 0;
            state.error = null;
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

            //get all notes
            .addCase(getAllNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = action?.payload?.data;
                state.totalNotes = action?.payload?.count;
            })
            .addCase(getAllNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action?.payload?.message || "Failed to fetch notes!";
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

            .addCase(toggleBookmark.pending,(state,action)=>{
                const noteId=action.meta.arg;
                if(!state.bookmarkingNotes.includes(noteId)){
                    state.bookmarkingNotes.push(noteId);
                }
                state.error=null;
            })

            .addCase(toggleBookmark.fulfilled, (state, action) => {
                //state.bookmarking = false;
                const updatedNote = action.payload.data; // Make sure backend returns { data: updatedNote }
                const noteId=updatedNote._id;

                //remove from bookmarking array
                state.bookmarkingNotes=state.bookmarkingNotes.filter(id=>id!==noteId);

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
                const noteId=action.meta.arg;

                //remove from bookmarking array
                state.bookmarkingNotes=state.bookmarkingNotes.filter(id=>id!==noteId);

                state.error = action?.payload?.message || "Failed to toggle bookmark"
            })

            //download note
            .addCase(downloadnote.pending, (state, action) => {
                const noteId=action.meta.arg.noteId;
                if(!state.downloadingNotes.includes(noteId)){
                    state.downloadingNotes.push(noteId);
                }
                state.error=null;
            })
            .addCase(downloadnote.fulfilled, (state, action) => {
             //optionally increment download count in local state
                const noteId = action?.payload?.noteId;

                //remove from downloading array
                state.downloadingNotes=state.downloadingNotes.filter(id=>id!==noteId);

                const index = state.notes.findIndex(note => note._id === noteId);
                if (index !== -1) {
                    state.notes[index].downloads += 1;
                }
                if (state.currentNote?._id === noteId) {
                    state.currentNote.downloads += 1;
                }
            })
            .addCase(downloadnote.rejected, (state, action) => {
                
                const noteId=action.meta.arg.noteId;

                //remove from downloading array
                state.downloadingNotes=state.downloadingNotes.filter(id=>id!==noteId);

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

    }

});

//export acrtion
export const {
    clearCurrentNote,
    setFilters,
    clearFilters,
    clearError,
    clearNotes,
    updateNoteViews , // ✅ EXPORT THIS
    clearViewers  // ✅ NEW
} = noteSlice.actions;

//export reducer
export default noteSlice.reducer;