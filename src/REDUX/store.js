import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../REDUX/Slices/authslice.js";
import noteSliceReducer from "../REDUX/Slices/noteslice.js";
import adminSliceReducer from "../REDUX/Slices/adminSlice.js";
import searchReducer from "../REDUX/Slices/searchSlice.js";
import notificationReducer from "./Slices/notificationSlice.js";
import analyticsReducer from "./Slices/analyticsSlice.js";
import attendanceSliceReducer from "./Slices/attendanceSlice.js";
import emailReducer from "./Slices/emailSlice.js";
import academicProfileReducer from "./Slices/academicProfileSlice.js"
 import requestReducer from "./Slices/requestSlice.js"
 import feedbackReducer from './Slices/feedbackSlice.js'
 import loginLogsReducer from './Slices/loginLogsSlice.js'; // ✅ ADD THIS IMPORT
import logsReducer  from './Slices/logsSlice.js'
// import studyBuddySlice from "./Slices/studyBuddy.slice.js"
// import studyPlannerSlice from "./Slices/studyPlanner.slice.js"
const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    note: noteSliceReducer,
    admin: adminSliceReducer,
    search: searchReducer,
    notification: notificationReducer, // ← Add this
    analytics: analyticsReducer,
    attendance: attendanceSliceReducer,
    email: emailReducer,
    academicProfile: academicProfileReducer, // ✨ NEW - Add this line
    request: requestReducer,
    feedback: feedbackReducer,
    loginLogs: loginLogsReducer,
    logs: logsReducer
    // studyBuddy: studyBuddySlice,  // ← ADD THIS
    // studyPlanner: studyPlannerSlice,  // ← ADD THIS
  },
  //devToolsa:true //only when you are in dev enviroment ok
});

export default store;
