import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

// Jobs API
export const jobsAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getFeaturedJobs: () => api.get('/jobs/featured'),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getEmployerJobs: () => api.get('/jobs/employer/me'),
};

// Applications API
export const applicationsAPI = {
  applyForJob: (formData) => api.post('/applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  getMyApplications: () => api.get('/applications/my-applications'),
  updateApplicationStatus: (id, statusData) => api.patch(`/applications/${id}/status`, statusData),
  getApplication: (id) => api.get(`/applications/${id}`),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  uploadResume: (formData) => api.post('/users/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
};

export default api;
