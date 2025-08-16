import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../REDUX/Slices/authslice.js"
import noteSliceReducer from "../REDUX/Slices/noteslice.js"
import adminSliceReducer from "../REDUX/Slices/adminSlice.js"
import searchReducer from "../REDUX/Slices/searchSlice.js"
const store=configureStore({
    reducer:{
        auth:authSliceReducer,
        note:noteSliceReducer,
        admin:adminSliceReducer,
        search: searchReducer,
    },
    devTools:true
})

export default store;