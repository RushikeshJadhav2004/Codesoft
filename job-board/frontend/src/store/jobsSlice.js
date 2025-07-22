import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobsAPI } from '../utils/api';

// Async thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.getJobs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchFeaturedJobs = createAsyncThunk(
  'jobs/fetchFeaturedJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.getFeaturedJobs();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchJobDetails = createAsyncThunk(
  'jobs/fetchJobDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.getJob(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.createJob(jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchEmployerJobs = createAsyncThunk(
  'jobs/fetchEmployerJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await jobsAPI.getEmployerJobs();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    featuredJobs: [],
    currentJob: null,
    employerJobs: [],
    pagination: null,
    isLoading: false,
    error: null,
    searchFilters: {
      search: '',
      location: '',
      category: '',
      type: '',
      experience: '',
      remote: false,
    },
  },
  reducers: {
    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedJobs.fulfilled, (state, action) => {
        state.featuredJobs = action.payload;
      })
      .addCase(fetchJobDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.employerJobs.unshift(action.payload);
      })
      .addCase(fetchEmployerJobs.fulfilled, (state, action) => {
        state.employerJobs = action.payload;
      });
  },
});

export const { setSearchFilters, clearCurrentJob, clearError } = jobsSlice.actions;
export default jobsSlice.reducer;
