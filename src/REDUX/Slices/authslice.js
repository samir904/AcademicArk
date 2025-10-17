import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../HELPERS/axiosInstance.js"
import toast from "react-hot-toast"
import { showToast } from "../../HELPERS/Toaster.jsx"
const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    role: localStorage.getItem('role') || "",
    data: (() => {
        try {
            const data = localStorage.getItem("data");
            // Check if data exists and is not "undefined" string
            if (!data || data === 'undefined' || data === 'null') {
                return {};
            }
            const parsed = JSON.parse(data);
            // Ensure avatar exists with default structure
            if (parsed && !parsed.avatar) {
                parsed.avatar = { secure_url: '' };
            }
            return parsed;
        } catch (e) {
            console.error("Failed to parse localStorage data:", e);
            // Clear corrupted data
            localStorage.removeItem("data");
            return {};
        }
    })(),
    loading: false,
    error: null,
    analytics: null,
    myNotes: [],
    myBookmarks: [],
    myNotesPagination: null,
    bookmarksPagination: null
}

export const createAccount = createAsyncThunk("/auth/signup", async (data, { rejectWithValue }) => {
    try {
        const httpPromise = axiosInstance.post("user/register", data);
        const res = await showToast.promise(httpPromise, {
            loading: 'Wait creating your account!',
            success: (data) => {
                return data?.data?.message || "Account created successfully"
            },
            error: (error) => {
                return error?.response?.data?.message || "Failed to create account"
            }
        })
        return res.data;

    } catch (e) {
        toast.error(e?.response?.data?.message)
        return rejectWithValue(e?.response?.data || { message: "Signup failed" }); // ✅
    }
})

export const login = createAsyncThunk("/auth/login", async (data, { rejectWithValue }) => {
    try {
        const httpPromise = axiosInstance.post("/user/login", data);
        const res = await showToast.promise(httpPromise, {
            loading: "Signing you in...",
            success: (data) => {
                return data?.data?.message || "Welcome back! 🎉"
            },
            error: (error) => {
                return error?.response?.data?.message || "Login failed. Please try again."
            }
        })
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message)
        return rejectWithValue(error?.response?.data || { message: "Login failed" }); // ✅
    }
})

// authslice.js - Fixed Google Login
export const googleLogin = createAsyncThunk(
    '/auth/google',
    async (_, { rejectWithValue }) => {
        try {
            // Show toast for better UX
            showToast.loading('Redirecting to Google...', { id: 'google-auth' });
            
            // Small delay to show the loading state
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Store timestamp to track Google auth flow
            sessionStorage.setItem('googleAuthStarted', Date.now().toString());
            
            // ✅ Use production URL directly (since you can't use env vars)
            const apiUrl = 'https://academicark.onrender.com';
            
            // Redirect to backend OAuth route
            window.location.href = `${apiUrl}/api/v1/oauth/google`;
            
            return null;
        } catch (error) {
            toast.dismiss('google-auth');
            const message = error?.response?.data?.message || 'Google login failed';
            showToast.error(message);
            sessionStorage.removeItem('googleAuthStarted');
            return rejectWithValue(message);
        }
    }
);

// ✅ Enhanced checkAuth
export const checkAuth = createAsyncThunk(
    '/auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/user/getprofile');
            
            // Check if this was a Google auth callback
            const googleAuthStarted = sessionStorage.getItem('googleAuthStarted');
            if (googleAuthStarted) {
                sessionStorage.removeItem('googleAuthStarted');
                showToast.success('Successfully signed in with Google! 🎉');
            }
            
            return res.data;
        } catch (error) {
            sessionStorage.removeItem('googleAuthStarted');
            return rejectWithValue(error?.response?.data?.message || 'Not authenticated');
        }
    }
);


export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            // 1. Fire the request
            const resPromise = axiosInstance.get('/user/logout');

            // 2. Wrap it in your toast and await it
            const res = await showToast.promise(
                resPromise,
                {
                    loading: 'Logging out…',
                    success: (data) => data?.data?.message || 'Logged out successfully',
                    error: (error) =>
                        error?.response?.data?.message || 'Failed to log out',
                }
            );

            // 3. Return the data
            return res.data;
        } catch (err) {
            // Return a rejected value so your thunk goes to .rejected
            return rejectWithValue(
                err?.response?.data?.message || 'Logout failed, please try again'
            );
        }
    }
);


export const getProfile = createAsyncThunk("/auth/profile", async () => {
    try {
        const res = axiosInstance.get("/user/getprofile");
        return (await res).data;
    } catch (e) {
        showToast.error(e?.response?.data?.message);
    }
})

export const updateProfile = createAsyncThunk("/auth/updateprofile", async (data) => {
    try {
        const httpPromise = axiosInstance.put("/user/update", data);
        const res = await showToast.promise(httpPromise, {
            loading: "Updating profile.",
            success: (data) => {
                return data?.data?.message || "Profile updated."
            },
            error: (error) => {
                return error?.response?.data?.message || "Update failed please try again"
            }
        })
        return res.data;
    } catch (e) {
        showToast.error(e?.response?.data?.message || "Update failed. please try again!")
    }
})

export const changePassword = createAsyncThunk("/auth/changepassword", async (data) => {
    try {
        const httpPromise = axiosInstance.post("/user/change-password", data);
        const res = await showToast.promise(httpPromise, {
            loading: "Password changing...",
            success: (data) => {
                return data?.data?.message || "Password changed."
            },
            error: (error) => {
                return error?.response?.data?.message || "Failed please try again!"
            }
        })
        return res.data;
    } catch (error) {
        showToast.error(e?.response?.data?.message || "Failed please try again")
    }
})

export const forgotPassword = createAsyncThunk("/auth/forgotpassword", async (data) => {
    try {
        const httpPromise = axiosInstance.post("/user/reset", data);
        const res = await showToast.promise(httpPromise, {
            loading: "Wait sending you email...",
            success: (data) => {
                return data?.data?.message || "Email sended. please check your email!"
            },
            error: (error) => {
                return error?.response?.data?.message || "Failed to send email please try again!"
            }
        })
        return (await res).data;

    } catch (e) {
        showToast.error(e?.response?.data?.message || "Failed please try again!")
    }
})

export const resetPassword = createAsyncThunk("/auth/resetpassword", async ({ resetToken, password }) => {
    try {
        const httpPromise = axiosInstance.post(`/user/reset-password/${resetToken}`, { password });
        const res = await showToast.promise(httpPromise, {
            loading: "Updating password..",
            success: (data) => {
                return data?.data?.message || "Password updated!"
            },
            error: (error) => {
                return error?.response?.data?.message || "Failed to update, please try again!"
            }
        })
        return res.data;
    } catch (error) {
        showToast.error(error?.response?.data?.message || "Failed to update please try again!")
    }
})

export const getMyAnalytics = createAsyncThunk('/user/getMyAnalytics', async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/user/my-analytics');
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get analytics';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const getMyNotes = createAsyncThunk('/user/getMyNotes', async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/user/my-notes?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get my notes';
        showToast.error(message);
        return rejectWithValue(message);
    }
});

export const getMyBookmarks = createAsyncThunk('/user/getMyBookmarks', async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get(`/user/my-bookmarks?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || 'Failed to get bookmarks';
        showToast.error(message);
        return rejectWithValue(message);
    }
});


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createAccount.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(createAccount.fulfilled, (state, action) => {
            const user = action?.payload?.data || action.payload;
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("data", JSON.stringify(user));
            localStorage.setItem("role", user?.role || "USER");
            state.isLoggedIn = true;
            state.data = user;
            state.role = user?.role || "USER";
            state.loading = false;
        })
        builder.addCase(createAccount.rejected, (state, action) => {
            state.loading = false;
            state.error = action?.payload?.message || "Failed to create account. Please try again!";
        });

        builder.addCase(login.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(login.fulfilled, (state, action) => {
            const user = action?.payload?.data || action?.payload;
            localStorage.setItem("data", JSON.stringify(user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", user?.role || "USER");
            state.isLoggedIn = true;
            state.role = user?.role || "USER"
            state.data = user;
            state.loading = false;
        })
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action?.payload?.message || "Failed to login please try again!"
        })
            .addCase(checkAuth.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                const user = action?.payload?.data || action?.payload;
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("data", JSON.stringify(user));
                localStorage.setItem("role", user?.role || "USER");
                state.isLoggedIn = true;
                state.role = user?.role || "";
                state.data = user;
                state.loading = false;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
            })

        builder.addCase(getProfile.fulfilled, (state, action) => {
            const user = action?.payload?.data || action?.payload;
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("data", JSON.stringify(user));
            localStorage.setItem("role", user?.role || "USER");
            state.isLoggedIn = true;
            state.role = user?.role || "";
            state.data = user;
        })
        builder.addCase(logout.fulfilled, (state, action) => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("data");
            localStorage.removeItem("role");
            state.isLoggedIn = false;
            state.data = {};
            state.role = "";
        })
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            const user = action?.payload?.data || action?.payload;
            localStorage.setItem("data", JSON.stringify(user));
            state.data = user;
            state.role = user?.role || "USER"
        })
            // Get My Analytics
            .addCase(getMyAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.analytics = action.payload.data;
            })
            .addCase(getMyAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get My Notes
            .addCase(getMyNotes.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.myNotes = action.payload.data.notes;
                state.myNotesPagination = action.payload.data.pagination;
            })
            .addCase(getMyNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get My Bookmarks
            .addCase(getMyBookmarks.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyBookmarks.fulfilled, (state, action) => {
                state.loading = false;
                state.myBookmarks = action.payload.data.notes;
                state.bookmarksPagination = action.payload.data.pagination;
            })
            .addCase(getMyBookmarks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        // Add these cases to your existing extraReducers in authSlice




    }

})

export default authSlice.reducer;