import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import StudentDetails from '@/components/StudentManagement/StudentDetails';

const CourseWiseStudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, completed, in-progress
  const [certificateFilter, setCertificateFilter] = useState('all'); // all, issued, not-issued
  const [progressFilter, setProgressFilter] = useState('all'); // all, high, medium, low
  const [sortBy, setSortBy] = useState('name'); // name, progress, enrolled-date

  useEffect(() => {
    // Fetch all courses
    axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/courses`)
      .then(res => {
        setCourses(res.data.courses || []);
      })
      .catch(err => console.error('Error fetching courses:', err));
  }, []);

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    setSelectedStudentId(null);
    // Reset filters when course changes
    setSearchTerm('');
    setStatusFilter('all');
    setCertificateFilter('all');
    setProgressFilter('all');

    if (courseId) {
      setLoading(true);
      axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/courses/${courseId}/enrollments`)
        .then(res => {
          setStudents(res.data.data || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching students:', err);
          setStudents([]);
          setLoading(false);
        });
    } else {
      setStudents([]);
    }
  };

  // Filtered and sorted students
  const filteredStudents = useMemo(() => {
    let filtered = students.filter(student => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'completed' && student.isCompleted) ||
        (statusFilter === 'in-progress' && !student.isCompleted);

      // Certificate filter
      const matchesCertificate = certificateFilter === 'all' ||
        (certificateFilter === 'issued' && student.certificateIssued) ||
        (certificateFilter === 'not-issued' && !student.certificateIssued);

      // Progress filter
      const matchesProgress = progressFilter === 'all' ||
        (progressFilter === 'high' && (student.progressPercentage || 0) >= 75) ||
        (progressFilter === 'medium' && (student.progressPercentage || 0) >= 25 && (student.progressPercentage || 0) < 75) ||
        (progressFilter === 'low' && (student.progressPercentage || 0) < 25);

      return matchesSearch && matchesStatus && matchesCertificate && matchesProgress;
    });

    // Sort students
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'progress':
          return (b.progressPercentage || 0) - (a.progressPercentage || 0);
        case 'enrolled-date':
          return new Date(b.enrolledAt) - new Date(a.enrolledAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [students, searchTerm, statusFilter, certificateFilter, progressFilter, sortBy]);

  const handleStudentClick = (studentId) => {
    setSelectedStudentId(studentId);
  };

  const handleBack = () => {
    setSelectedStudentId(null);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCertificateFilter('all');
    setProgressFilter('all');
    setSortBy('name');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {!selectedStudentId ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Course Management</h1>
              <p className="text-gray-600">Manage students enrolled in your courses</p>
            </div>

            {/* Course Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="mb-6">
                <label className="block text-xl font-semibold text-gray-700 mb-3">
                  Select Course:
                </label>
                <select
                  className="w-full max-w-md px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-white text-gray-700"
                  value={selectedCourseId}
                  onChange={handleCourseChange}
                >
                  <option value="" className="text-gray-500">-- Choose a Course --</option>
                  {courses.map(course => (
                    <option key={course._id || course.id} value={course._id || course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filters Section */}
            {selectedCourseId && students.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Filters & Search</h3>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 cursor-pointer text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {/* Search */}
                  <div className="xl:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                    </select>
                  </div>

                  {/* Certificate Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certificate</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      value={certificateFilter}
                      onChange={(e) => setCertificateFilter(e.target.value)}
                    >
                      <option value="all">All Certificates</option>
                      <option value="issued">Issued</option>
                      <option value="not-issued">Not Issued</option>
                    </select>
                  </div>

                  {/* Progress Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Progress</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      value={progressFilter}
                      onChange={(e) => setProgressFilter(e.target.value)}
                    >
                      <option value="all">All Progress</option>
                      <option value="high">High (75%+)</option>
                      <option value="medium">Medium (25-74%)</option>
                      <option value="low">Low (&lt;25%)</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Name</option>
                      <option value="progress">Progress</option>
                      <option value="enrolled-date">Enrolled Date</option>
                    </select>
                  </div>
                </div>

                {/* Filter Results Summary */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>
                    Showing {filteredStudents.length} of {students.length} students
                  </span>
                  {(searchTerm || statusFilter !== 'all' || certificateFilter !== 'all' || progressFilter !== 'all') && (
                    <span className="text-blue-600">Filters applied</span>
                  )}
                </div>
              </div>
            )}

            {/* Students Table */}
            {selectedCourseId && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                  <h2 className="text-2xl font-bold text-white">Enrolled Students</h2>
                </div>
                
                <div className="p-6">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      <span className="ml-4 text-gray-600">Loading students...</span>
                    </div>
                  ) : students.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">📚</div>
                      <p className="text-xl text-gray-500">No students enrolled in this course</p>
                      <p className="text-gray-400 mt-2">Students will appear here once they enroll</p>
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">🔍</div>
                      <p className="text-xl text-gray-500">No students match your filters</p>
                      <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
                      <button
                        onClick={clearAllFilters}
                        className="cursor-pointer mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                              Student
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                              Contact
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                              Progress
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                              Certificate
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                              Enrolled
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredStudents.map((student, index) => (
                            <tr
                              key={student.studentId || index}
                              className="hover:bg-blue-50 cursor-pointer transition-colors duration-150 group"
                              onClick={() => handleStudentClick(student.studentId)}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {student.name?.charAt(0).toUpperCase() || 'U'}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                                      {student.name || 'Unknown'}
                                    </div>
                                    <div className="text-sm text-gray-500">ID: {student.studentId}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{student.email || 'N/A'}</div>
                                <div className="text-sm text-gray-500">{student.phone || 'No phone'}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full transition-all duration-300 ${
                                        (student.progressPercentage || 0) >= 75 
                                          ? 'bg-gradient-to-r from-green-400 to-green-500'
                                          : (student.progressPercentage || 0) >= 25
                                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                                          : 'bg-gradient-to-r from-red-400 to-red-500'
                                      }`}
                                      style={{ width: `${student.progressPercentage || 0}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 min-w-12">
                                    {student.progressPercentage || 0}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                  student.isCompleted 
                                    ? 'bg-green-100 text-green-800 border border-green-200' 
                                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                }`}>
                                  {student.isCompleted ? '✅ Completed' : '⏳ In Progress'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  student.certificateIssued 
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                  {student.certificateIssued ? '🏆 Issued' : '⭕ Not Issued'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                }) : 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Student Details</h2>
              <button
                onClick={handleBack}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to List</span>
              </button>
            </div>
            <StudentDetails 
              studentId={selectedStudentId} 
              onBack={handleBack}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseWiseStudentDashboard;