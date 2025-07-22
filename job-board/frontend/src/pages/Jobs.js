import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchJobs, setSearchFilters } from '../store/jobsSlice';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  BuildingOfficeIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const Jobs = () => {
  const dispatch = useDispatch();
  const { jobs, pagination, isLoading, searchFilters } = useSelector((state) => state.jobs);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs({ ...searchFilters, page: currentPage }));
  }, [dispatch, searchFilters, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(fetchJobs({ ...searchFilters, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setSearchFilters({ [key]: value }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
  const experienceLevels = ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'];
  const categories = [
    'Technology', 'Marketing', 'Sales', 'Design', 'Finance', 'Healthcare',
    'Education', 'Engineering', 'Customer Service', 'Operations'
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchFilters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1 relative">
                <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={searchFilters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold transition duration-200 flex items-center"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              
              {/* Job Type */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Job Type</h4>
                <select
                  value={searchFilters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Experience Level</h4>
                <select
                  value={searchFilters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Levels</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
                <select
                  value={searchFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remote Work */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={searchFilters.remote}
                    onChange={(e) => handleFilterChange('remote', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900">Remote work</span>
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  dispatch(setSearchFilters({
                    search: '',
                    location: '',
                    category: '',
                    type: '',
                    experience: '',
                    remote: false,
                  }));
                  setCurrentPage(1);
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium transition duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3 mt-6 lg:mt-0">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading jobs...</p>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {pagination?.total || 0} Jobs Found
                  </h2>
                  <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option>Most Recent</option>
                    <option>Salary High to Low</option>
                    <option>Salary Low to High</option>
                  </select>
                </div>

                {/* Jobs Grid */}
                <div className="space-y-6">
                  {jobs.map((job) => (
                    <div key={job._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                              <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                            </h3>
                            {job.featured && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                            <div className="flex items-center">
                              <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                              <span>{job.company}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center">
                              <BriefcaseIcon className="h-4 w-4 mr-1" />
                              <span className="capitalize">{job.type}</span>
                            </div>
                            {job.salary && (
                              <div className="flex items-center">
                                <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                                <span>
                                  ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {job.description.substring(0, 200)}...
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {job.skills?.slice(0, 3).map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.skills?.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{job.skills.length - 3} more
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-500">
                                {new Date(job.createdAt).toLocaleDateString()}
                              </span>
                              <Link
                                to={`/jobs/${job._id}`}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition duration-200"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="mt-8 flex items-center justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {/* Previous button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      {/* Next button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= pagination.pages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
