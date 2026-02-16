import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slices/authslice.js";
import noteSliceReducer from "./Slices/noteslice.js";
import adminSliceReducer from "./Slices/adminSlice.js";
import searchReducer from "./Slices/searchSlice.js";
import notificationReducer from "./Slices/notificationSlice.js";
import analyticsReducer from "./Slices/analyticsSlice.js";
import attendanceSliceReducer from "./Slices/attendanceSlice.js";
import emailReducer from "./Slices/emailSlice.js";
import academicProfileReducer from "./Slices/academicProfileSlice.js"
 import requestReducer from "./Slices/requestSlice.js"
 import feedbackReducer from './Slices/feedbackSlice.js'
 import loginLogsReducer from './Slices/loginLogsSlice.js'; // ✅ ADD THIS IMPORT
 import logsReducer from './Slices/logsSlice.js'
 import retentionReducer from './Slices/retention.slice.js'
 import mongoDbHealthSlice from './Slices/mongoDbHealthSlice.js'
 import redisHealthSlice from './Slices/redisHealthSlice.js'
 import queryMetricsReducer from './Slices/queryMetricsSlice.js'
 import videoLectureReducer from './Slices/videoLecture.slice.js'
 import leaderboardReducer from './Slices/leaderboard.slice.js'
 import homepageReducer from './Slices/homepageSlice.js'
 import sessionReducer from './Slices/sessionSlice.js'
 import plannerReducer from './Slices/plannerSlice.js'
 import savedFilterReducer from './Slices/savedFilterSlice.js'
 import failedSearchReducer from './Slices/failedSearchSlice.js'
import adminAnalyticsReducer from './Slices/adminAnalyticsSlice.js'
import searchSuggestionReducer from './Slices/searchSuggestionSlice.js'
import searchAdminAnalyticsReducer from './Slices/searchAdminAnalyticsSlice.js'
import searchAdminManageReducer from './Slices/searchAdminManageSlice.js'
import searchAnalyticsReducer from './Slices/searchAnalyticsSlice.js'
import planReducer from './Slices/planSlice.js'
import paymentReducer from './Slices/paymentSlice.js'
import paywallReducer from './Slices/paywallSlice.js'
import paywallTrackingReducer from './Slices/paywallTrackingSlice.js'
import adminPaywallReducer from './Slices/adminPaywallSlice.js'
import filterAnalyticsReducer from './Slices/filterAnalyticsSlice.js'
import seoAdminReducer from './Slices/seoAdminSlice.js'
//  import videoReducer from './Slices/videoSlice.js'
// import logsReducer  from './Slices/logsSlice.js'
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
    logs: logsReducer,
    retention:retentionReducer,
    queryMetrics: queryMetricsReducer, 
    mongodbHealth: mongoDbHealthSlice,
    redisHealth: redisHealthSlice,
    videoLecture: videoLectureReducer,
    leaderboard: leaderboardReducer,  // ✨ NEW
    home:homepageReducer,
    session: sessionReducer,
    planner: plannerReducer,
    savedFilters: savedFilterReducer,
    filterAnalytics: filterAnalyticsReducer,
    // 🔥 ADD THIS
    failedSearch: failedSearchReducer,
    searchSuggestion:searchSuggestionReducer,
    searchAdminAnalytics:searchAdminAnalyticsReducer,
    adminAnalytics:adminAnalyticsReducer,
    searchAdminManage:searchAdminManageReducer,
    searchAnalytics:searchAnalyticsReducer,

    plans: planReducer,
    payment:paymentReducer,
    paywall: paywallReducer,

    paywallTracking: paywallTrackingReducer,
    adminPaywall:adminPaywallReducer,
    seoAdmin: seoAdminReducer, // ✅ ADD THIS
    //  video: videoReducer,
    // studyBuddy: studyBuddySlice,  // ← ADD THIS
    // studyPlanner: studyPlannerSlice,  // ← ADD THIS
  },
  //devToolsa:true //only when you are in dev enviroment ok
});

export default store;
