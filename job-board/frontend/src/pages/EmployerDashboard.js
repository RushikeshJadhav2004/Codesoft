import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEmployerJobs } from '../store/jobsSlice';
import { jobsAPI, applicationsAPI } from '../utils/api';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  BriefcaseIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const EmployerDashboard = () => {
  const dispatch = useDispatch();
  const { employerJobs } = useSelector((state) => state.jobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployerJobs());
  }, [dispatch]);

  const handleViewApplications = async (job) => {
    setSelectedJob(job);
    setIsLoadingApplications(true);
    try {
      const response = await applicationsAPI.getJobApplications(job._id);
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await jobsAPI.deleteJob(jobId);
        dispatch(fetchEmployerJobs());
      } catch (error) {
        alert('Failed to delete job posting');
      }
    }
  };

  const handleApplicationStatusUpdate = async (applicationId, status) => {
    try {
      await applicationsAPI.updateApplicationStatus(applicationId, { status });
      // Refresh applications
      const response = await applicationsAPI.getJobApplications(selectedJob._id);
      setApplications(response.data);
    } catch (error) {
      alert('Failed to update application status');
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

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <Link
            to="/post-job"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Post New Job
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employerJobs.filter(job => job.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employerJobs.reduce((total, job) => total + (job.applicationsCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Draft Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employerJobs.filter(job => job.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Jobs List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Job Postings</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {employerJobs.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No job postings yet.</p>
                  <Link
                    to="/post-job"
                    className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create your first job posting
                  </Link>
                </div>
              ) : (
                employerJobs.map((job) => (
                  <div key={job._id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {job.location} • {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                        </p>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.status === 'active' ? 'bg-green-100 text-green-800' :
                            job.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {job.status}
                          </span>
                          <span>{job.applicationsCount || 0} applications</span>
                          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleViewApplications(job)}
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="View Applications"
                        >
                          <UsersIcon className="h-5 w-5" />
                        </button>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="View Job"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete Job"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Applications Panel */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedJob ? `Applications for ${selectedJob.title}` : 'Select a job to view applications'}
              </h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {!selectedJob ? (
                <div className="p-6 text-center text-gray-500">
                  Click on the users icon next to a job to view its applications
                </div>
              ) : isLoadingApplications ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : applications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No applications yet for this job
                </div>
              ) : (
                applications.map((application) => (
                  <div key={application._id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">
                          {application.applicant.name}
                        </h4>
                        <p className="text-sm text-gray-600">{application.applicant.email}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Applied {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {application.coverLetter.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="ml-4 space-y-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                        <div className="flex flex-col space-y-1">
                          <select
                            value={application.status}
                            onChange={(e) => handleApplicationStatusUpdate(application._id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                          </select>
                          {application.resume && (
                            <a
                              href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${application.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              View Resume
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
