import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobDetails } from '../store/jobsSlice';
import { applicationsAPI } from '../utils/api';
import {
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserIcon,
  BriefcaseIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentJob, isLoading } = useSelector((state) => state.jobs);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null,
  });
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobDetails(id));
    }
  }, [dispatch, id]);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'jobseeker') {
      alert('Only job seekers can apply for jobs');
      return;
    }
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setIsApplying(true);

    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('coverLetter', applicationData.coverLetter);
      formData.append('resume', applicationData.resume);

      await applicationsAPI.applyForJob(formData);
      setApplicationSuccess(true);
      setShowApplicationModal(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
          <p className="text-gray-600 mt-2">The job you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {applicationSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Application submitted successfully!
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  We'll notify you if there are any updates.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentJob.title}
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    <span className="text-lg">{currentJob.company}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>{currentJob.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <BriefcaseIcon className="h-5 w-5 mr-2" />
                    <span className="capitalize">{currentJob.type}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UserIcon className="h-5 w-5 mr-2" />
                    <span className="capitalize">{currentJob.experience} level</span>
                  </div>
                  {currentJob.salary && (
                    <div className="flex items-center text-gray-600">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                      <span>
                        ${currentJob.salary.min?.toLocaleString()} - ${currentJob.salary.max?.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span>Posted {new Date(currentJob.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {currentJob.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {currentJob.remote && (
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      Remote
                    </span>
                  )}
                </div>
              </div>
              
              <div className="ml-6">
                <button
                  onClick={handleApply}
                  disabled={applicationSuccess}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
                >
                  {applicationSuccess ? 'Applied' : 'Apply Now'}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Job Description */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                  <div className="prose prose-blue max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">
                      {currentJob.description}
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                  <div className="prose prose-blue max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">
                      {currentJob.requirements}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500 block">Category</span>
                      <span className="text-gray-900">{currentJob.category}</span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-500 block">Applications</span>
                      <span className="text-gray-900">{currentJob.applicationsCount || 0} applications</span>
                    </div>
                    
                    {currentJob.applicationDeadline && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 block">Application Deadline</span>
                        <span className="text-gray-900">
                          {new Date(currentJob.applicationDeadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h4>
                    <div className="space-y-3">
                      <p className="text-gray-700">
                        {currentJob.employer?.profile?.company || currentJob.company}
                      </p>
                      {currentJob.employer?.profile?.website && (
                        <a
                          href={currentJob.employer.profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Visit website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Apply for {currentJob.title}</h3>
            
            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter
                </label>
                <textarea
                  required
                  rows={6}
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us why you're a good fit for this role..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume (PDF only)
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf"
                  onChange={(e) => setApplicationData({ ...applicationData, resume: e.target.files[0] })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium"
                >
                  {isApplying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
