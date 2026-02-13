import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../HELPERS/axiosInstance";

/* =====================================================
   ASYNC THUNKS
===================================================== */

// 1️⃣ USER → Create Cashfree order
export const createPaymentOrder = createAsyncThunk(
  "payment/createOrder",
  async ({ planId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/payments/create-order",
        { planId },
        { withCredentials: true }
      );
      return res.data; // { success, paymentSessionId }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create payment order"
      );
    }
  }
);

// 2️⃣ USER → Check payment status (after redirect)
export const fetchPaymentStatus = createAsyncThunk(
  "payment/fetchStatus",
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/payments/status/${orderId}`,
        { withCredentials: true }
      );
      return res.data; // { success, status }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payment status"
      );
    }
  }
);

// 3️⃣ ADMIN → Get all payments (table)
export const fetchAllPaymentsAdmin = createAsyncThunk(
  "payment/fetchAllAdmin",
  async (
    { page = 1, limit = 20, from, to, status },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.get("/payments/admin/all", {
        params: {
          page,
          limit,
          from,
          to,
          status: status === "ALL" ? undefined : status
        },
        withCredentials: true
      });

      return {
        payments: res.data.payments,
        pagination: res.data.pagination
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payments"
      );
    }
  }
);


// 4️⃣ ADMIN → Get payment analytics (cards)
export const fetchPaymentStatsAdmin = createAsyncThunk(
  "payment/fetchStatsAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        "/payments/admin/stats",
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payment stats"
      );
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const initialState = {
  // User payment
  paymentSessionId: null,
  paymentStatus: null, // CREATED | SUCCESS | FAILED
  creatingOrder: false,
  checkingStatus: false,

  // Admin data
  payments: [],
  pagination: null,
  stats: null,
  adminLoading: false,

  // Errors
  error: null
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,

  reducers: {
    resetPaymentState: (state) => {
      state.paymentSessionId = null;
      state.paymentStatus = null;
      state.error = null;
    },
    clearPaymentError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    /* ===== CREATE ORDER ===== */
    builder
      .addCase(createPaymentOrder.pending, (state) => {
        state.creatingOrder = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.creatingOrder = false;
        state.paymentSessionId = action.payload.paymentSessionId;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.creatingOrder = false;
        state.error = action.payload;
      });

    /* ===== PAYMENT STATUS ===== */
    builder
      .addCase(fetchPaymentStatus.pending, (state) => {
        state.checkingStatus = true;
      })
      .addCase(fetchPaymentStatus.fulfilled, (state, action) => {
        state.checkingStatus = false;
        state.paymentStatus = action.payload.status;
      })
      .addCase(fetchPaymentStatus.rejected, (state, action) => {
        state.checkingStatus = false;
        state.error = action.payload;
      });

    /* ===== ADMIN: ALL PAYMENTS ===== */
    builder
      .addCase(fetchAllPaymentsAdmin.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(fetchAllPaymentsAdmin.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.payments = action.payload.payments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllPaymentsAdmin.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload;
      });

    /* ===== ADMIN: STATS ===== */
    builder
      .addCase(fetchPaymentStatsAdmin.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(fetchPaymentStatsAdmin.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchPaymentStatsAdmin.rejected, (state, action) => {
        state.adminLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  resetPaymentState,
  clearPaymentError
} = paymentSlice.actions;

export default paymentSlice.reducer;
