import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../REDUX/Slices/authslice.js"
import noteSliceReducer from "../REDUX/Slices/noteslice.js"
import adminSliceReducer from "../REDUX/Slices/adminSlice.js"
import searchReducer from "../REDUX/Slices/searchSlice.js"
import notificationReducer from './Slices/notificationSlice.js'
import analyticsReducer from "./Slices/analyticsSlice.js"
import attendanceSliceReducer from "./Slices/attendanceSlice.js"
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
        // studyBuddy: studyBuddySlice,  // ← ADD THIS
        // studyPlanner: studyPlannerSlice,  // ← ADD THIS
    },
    //devTools:true //only when you are in dev enviroment ok 
})

export default store;