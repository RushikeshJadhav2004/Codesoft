import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { applicationsAPI, jobsAPI } from '../utils/api';
import {
  BriefcaseIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const JobSeekerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedApplications: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch applications
      const applicationsResponse = await applicationsAPI.getMyApplications();
      const userApplications = applicationsResponse.data;
      setApplications(userApplications.slice(0, 5)); // Recent 5 applications

      // Calculate stats
      setStats({
        totalApplications: userApplications.length,
        pendingApplications: userApplications.filter(app => app.status === 'pending').length,
        shortlistedApplications: userApplications.filter(app => app.status === 'shortlisted').length,
      });

      // Fetch recent jobs
      const jobsResponse = await jobsAPI.getJobs({ limit: 6 });
      setRecentJobs(jobsResponse.data.jobs);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Here's an overview of your job search activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shortlistedApplications}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
              <Link
                to="/my-applications"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {applications.length === 0 ? (
                <div className="p-6 text-center">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No applications yet</p>
                  <Link
                    to="/jobs"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Start applying to jobs
                  </Link>
                </div>
              ) : (
                applications.map((application) => (
                  <div key={application._id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {application.job.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {application.job.company} • {application.job.location}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Applied {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recommended Jobs</h2>
              <Link
                to="/jobs"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {recentJobs.length === 0 ? (
                <div className="p-6 text-center">
                  <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No jobs available</p>
                </div>
              ) : (
                recentJobs.map((job) => (
                  <div key={job._id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="text-lg font-medium text-gray-900 hover:text-blue-600"
                        >
                          {job.title}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          {job.company} • {job.location}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-sm text-gray-500 capitalize">{job.type}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500 capitalize">{job.experience}</span>
                          {job.remote && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-green-600">Remote</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/jobs"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <BriefcaseIcon className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Browse Jobs</p>
                <p className="text-sm text-gray-600">Find your next opportunity</p>
              </div>
            </Link>
            
            <Link
              to="/profile"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <UserIcon className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Update Profile</p>
                <p className="text-sm text-gray-600">Keep your info current</p>
              </div>
            </Link>
            
            <Link
              to="/my-applications"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <DocumentTextIcon className="h-6 w-6 text-orange-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Track Applications</p>
                <p className="text-sm text-gray-600">Monitor your progress</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
