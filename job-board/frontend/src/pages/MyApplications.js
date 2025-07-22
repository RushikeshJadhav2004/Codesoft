import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI } from '../utils/api';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  ClockIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationsAPI.getMyApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">Track the status of your job applications</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-6">Start applying to jobs to see your applications here</p>
            <Link
              to="/jobs"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <Link
                          to={`/jobs/${application.job._id}`}
                          className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {application.job.title}
                        </Link>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          <span>{application.job.company}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>{application.job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Your Cover Letter:</h4>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {application.coverLetter}
                        </p>
                      </div>
                      
                      {application.notes && (
                        <div className="mt-4 bg-blue-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">Employer Notes:</h4>
                          <p className="text-sm text-blue-800">
                            {application.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Job status: <span className="capitalize">{application.job.status}</span>
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        to={`/jobs/${application.job._id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Job
                      </Link>
                      {application.resume && (
                        <a
                          href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${application.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Submitted Resume
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Status Timeline */}
                <div className="bg-gray-50 px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].includes(application.status) 
                        ? 'bg-blue-600' : 'bg-gray-300'
                    }`}></div>
                    <div className={`w-3 h-3 rounded-full ${
                      ['reviewed', 'shortlisted', 'rejected', 'hired'].includes(application.status) 
                        ? 'bg-blue-600' : 'bg-gray-300'
                    }`}></div>
                    <div className={`w-3 h-3 rounded-full ${
                      ['shortlisted', 'hired'].includes(application.status) 
                        ? 'bg-green-600' : application.status === 'rejected' ? 'bg-red-600' : 'bg-gray-300'
                    }`}></div>
                    <div className={`w-3 h-3 rounded-full ${
                      application.status === 'hired' ? 'bg-purple-600' : 'bg-gray-300'
                    }`}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <span>Applied</span>
                    <span>Under Review</span>
                    <span>Decision</span>
                    <span>Final</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
