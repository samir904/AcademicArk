import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../HELPERS/axiosInstance'

export const getAnalyticsOverview = createAsyncThunk(
  '/analytics/getOverview',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/analytics/overview')
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const getTopPages = createAsyncThunk(
  '/analytics/getTopPages',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/analytics/top-pages')
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const getTrafficSources = createAsyncThunk(
  '/analytics/getTrafficSources',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/analytics/traffic-sources')
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

const initialState = {
  loading: false,
  error: null,
  overview: null,
  topPages: [],
  trafficSources: [],
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Overview
    builder
      .addCase(getAnalyticsOverview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAnalyticsOverview.fulfilled, (state, action) => {
        state.loading = false
        state.overview = action.payload
      })
      .addCase(getAnalyticsOverview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Top Pages
    builder
      .addCase(getTopPages.pending, (state) => {
        state.loading = true
      })
      .addCase(getTopPages.fulfilled, (state, action) => {
        state.loading = false
        state.topPages = action.payload
      })
      .addCase(getTopPages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Traffic Sources
    builder
      .addCase(getTrafficSources.pending, (state) => {
        state.loading = true
      })
      .addCase(getTrafficSources.fulfilled, (state, action) => {
        state.loading = false
        state.trafficSources = action.payload
      })
      .addCase(getTrafficSources.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError } = analyticsSlice.actions
export default analyticsSlice.reducer
