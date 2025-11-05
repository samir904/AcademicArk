import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../REDUX/Slices/authslice.js"
import noteSliceReducer from "../REDUX/Slices/noteslice.js"
import adminSliceReducer from "../REDUX/Slices/adminSlice.js"
import searchReducer from "../REDUX/Slices/searchSlice.js"
import notificationReducer from './Slices/notificationSlice.js'
import analyticsReducer from "./Slices/analyticsSlice.js"
const store=configureStore({
    reducer:{
        auth:authSliceReducer,
        note:noteSliceReducer,
        admin:adminSliceReducer,
        search: searchReducer,
        notification: notificationReducer, // ← Add this
        analytics: analyticsReducer,
    },
    //devTools:true //only when you are in dev enviroment ok 
})

export default store;