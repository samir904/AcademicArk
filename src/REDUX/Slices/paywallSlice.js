import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  reason: null,   // LIMIT_REACHED | PLAN_EXPIRED
  noteId: null
};

const paywallSlice = createSlice({
  name: "paywall",
  initialState,
  reducers: {
    openPaywall: (state, action) => {
      state.isOpen = true;
      state.reason = action.payload.reason;
      state.noteId = action.payload.noteId || null;
    },
    closePaywall: (state) => {
      state.isOpen = false;
      state.reason = null;
      state.noteId = null;
    }
  }
});

export const { openPaywall, closePaywall } = paywallSlice.actions;
export default paywallSlice.reducer;
