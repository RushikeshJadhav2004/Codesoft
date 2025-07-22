import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { getCurrentUser } from './store/authSlice';

// Lazy load dashboard components
const EmployerDashboard = React.lazy(() => import('./pages/EmployerDashboard'));
const JobSeekerDashboard = React.lazy(() => import('./pages/JobSeekerDashboard'));
const PostJob = React.lazy(() => import('./pages/PostJob'));
const Profile = React.lazy(() => import('./pages/Profile'));
const MyApplications = React.lazy(() => import('./pages/MyApplications'));

function AppContent() {
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      store.dispatch(getCurrentUser());
    }
  }, [token]);

  return (
    <Router>
      <Layout>
        <React.Suspense fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-applications" 
              element={
                <ProtectedRoute requiredRole="jobseeker">
                  <MyApplications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/post-job" 
              element={
                <ProtectedRoute requiredRole="employer">
                  <PostJob />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employer-dashboard" 
              element={
                <ProtectedRoute requiredRole="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobseeker-dashboard" 
              element={
                <ProtectedRoute requiredRole="jobseeker">
                  <JobSeekerDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900">404</h1>
                  <p className="text-gray-600 mt-2">Page not found</p>
                </div>
              </div>
            } />
          </Routes>
        </React.Suspense>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
