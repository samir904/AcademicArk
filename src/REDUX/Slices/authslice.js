import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"
import axiosInstance from "../../HELPERS/axiosInstance.js"
import toast from"react-hot-toast"
import { showToast } from "../../HELPERS/Toaster.jsx"
const initialState={
    isLoggedIn:localStorage.getItem('isLoggedIn') || false,
    role:localStorage.getItem('role') ||"",
    data:(() => {
      try {
        const data = localStorage.getItem("data");
        return data ? JSON.parse(data) : {};
      } catch (e) {
        console.error("Failed to parse localStorage data:", e);
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

export const createAccount=createAsyncThunk("/auth/signup",async(data)=>{
    try{
        const res=axiosInstance.post("user/register",data);
        toast.promise(res,{
            loading:'Wait creating your account!',
            success:(data)=>{
                return data?.data?.message || "Account created successfully"
            },
            error:(error)=>{
                return error?.response?.data?.message || "Failed to create account"
            }
        })
        return (await res).data;

    }catch(e){
        toast.error(e?.response?.data?.message)
    }
})

export const login=createAsyncThunk("/auth/login",async(data)=>{
    try{
        const res=axiosInstance.post("/user/login",data);
        showToast.promise(res,{
            loading:"Signing you in...",
            success:(data)=>{
               return data?.data?.message || "Welcome back! 🎉"
            },
            error:(error)=>{
              return  error?.response?.data?.message || "Login failed. Please try again."
            }
        })
        return (await res).data;
    }catch(error){
        toast.error(error?.response?.data?.message)
    }
})

export const logout=createAsyncThunk("/auth/logout",async()=>{
    try{
        const res=axiosInstance.get("/user/logout");
        showToast.promise(res,{
            loading:"Wait logout in process!",
            success:(data)=>{
               return data?.data?.message ||"Loggedout successfully"
            },
            error:(error)=>{
              return  error?.response?.data?.message || "Failed to loggedout"
            }
        })
        return (await res).data;
    }catch(e){
        toast.error(e?.response?.data?.message||"Failed try again!")
    }
})

export const getProfile=createAsyncThunk("/auth/profile",async()=>{
    try{
        const res=axiosInstance.get("/user/getprofile");
        return (await res).data;
    }catch(e){
        showToast.error(e?.response?.data?.message);
    }
})

export const updateProfile=createAsyncThunk("/auth/updateprofile",async(data)=>{
    try{
        const res=axiosInstance.put("/user/update",data);
        showToast.promise(res,{
            loading:"Updating profile.",
            success:(data)=>{
                 return data?.data?.message ||"Profile updated."
            },
            error:(error)=>{
               return error?.response?.data?.message || "Update failed please try again"
            }
        })
        return (await res).data;
    }catch(e){
        showToast.error(e?.response?.data?.message||"Update failed. please try again!")
    }
})

export const changePassword=createAsyncThunk("/auth/changepassword",async(data)=>{
    try{
        const res=axiosInstance.post("/user/change-password",data);
        showToast.promise(res,{
            loading:"Password changing...",
            success:(data)=>{
               return data?.data?.message || "Password changed."
            },
            error:(error)=>{
              return  error?.response?.data?.message || "Failed please try again!"
            }
        })
        return (await res).data;
    }catch(error){
        showToast.error(e?.response?.data?.message||"Failed please try again")
    }
})

export const forgotPassword=createAsyncThunk("/auth/forgotpassword",async(data)=>{
    try{
        const res=axiosInstance.post("/user/reset",data);
        showToast.promise(res,{
            loading:"Wait sending you email...",
            success:(data)=>{
               return data?.data?.message||"Email sended. please check your email!"
            },
            error:(error)=>{
               return error?.response?.data?.message||"Failed to send email please try again!"
            }
        })
        return (await res).data;

    }catch(e){
        showToast.error(e?.response?.data?.message||"Failed please try again!")
    }
})

export const resetPassword=createAsyncThunk("/auth/resetpassword",async({resetToken,password})=>{
    try{
        const res=axiosInstance.post(`/user/reset-password/${resetToken}`,{password});
        showToast.promise(res,{
            loading:"Updating password..",
            success:(data)=>{
                 return data?.data?.message||"Password updated!"
            },
            error:(error)=>{
               return error?.response?.data?.message || "Failed to update, please try again!"
            }
        })
        return (await res).data;
    }catch(error){
        showToast.error(error?.response?.data?.message||"Failed to update please try again!")
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


const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(createAccount.fulfilled,(state,action)=>{
            const user=action?.payload?.data|| action.payload;
            localStorage.setItem("isLoggedIn",true);
            localStorage.setItem("data",JSON.stringify(user));
            localStorage.setItem("role",user?.role||"USER");
            state.isLoggedIn=true;
            state.data=user;
            state.role=user?.role||"USER";
        })
    builder.addCase(login.fulfilled,(state,action)=>{
        const user=action?.payload?.data||action?.payload;
        localStorage.setItem("data",JSON.stringify(user));
        localStorage.setItem("isLoggedIn",true);
        localStorage.setItem("role",user?.role||"USER");
        state.isLoggedIn=true;
        state.role=user?.role||"USER"
        state.data=user;
    })

    
    builder.addCase(getProfile.fulfilled,(state,action)=>{
        const user=action?.payload?.data||action?.payload;
        localStorage.setItem("isLoggedIn",true);
        localStorage.setItem("data",JSON.stringify(user));
        localStorage.setItem("role",user?.role||"USER");
        state.isLoggedIn = true;
        state.role=user?.role||"";
        state.data=user;
    })
    builder.addCase(logout.fulfilled,(state,action)=>{
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("data");
        localStorage.removeItem("role");
        state.isLoggedIn=false;
        state.data={};
        state.role="";
    })
    builder.addCase(updateProfile.fulfilled,(state,action)=>{
        const user=action?.payload?.data||action?.payload;
        localStorage.setItem("data",JSON.stringify(user));
        state.data=user;
        state.role=user?.role||"USER"
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
            });
    

    }
    
})

export default authSlice.reducer;