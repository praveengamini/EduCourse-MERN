import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Calendar, BookOpen, Award, Clock, CheckCircle, CrossIcon as Progress,  Phone, UserMinus} from 'lucide-react';
import { studentApi } from '../../services/studentApi';

const StudentDetails = ({ studentId, onBack }) => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unenrollingCourse, setUnenrollingCourse] = useState(null);

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentApi.getStudentDetails(studentId);
      if (response.success) {
        setStudentData(response.data);
      } else {
        setError('Failed to fetch student details');
      }
    } catch (error) {
      setError('Error fetching student details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    if (status === 'completed') {
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </span>
      );
    } else {
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </span>
      );
    }
  };

  const handleUnenrollCourse = async (courseId, courseName) => {
    const confirmed = window.confirm(
      `Are you sure you want to unenroll ${studentData.student.userName} from "${courseName}"?\n\nThis action will:\n- Remove the student from the course\n- Delete all progress data\n- Cannot be undone`
    );

    if (!confirmed) return;

    setUnenrollingCourse(courseId);
    try {
      console.log('Attempting to unenroll:', studentId, courseId);
      await studentApi.unenrollStudentFromCourse(studentId, courseId);
      // Refresh student details after successful unenrollment
      await fetchStudentDetails();
      alert('Student successfully unenrolled from the course');
    } catch (error) {
      console.error('Error unenrolling student:', error);
      alert(`Failed to unenroll student: ${error.message || 'Please try again.'}`);
    } finally {
      setUnenrollingCourse(null);
    }
  };

  const ProgressBar = ({ percentage }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={onBack}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return null;
  }

  const { student, enrolledCourses, statistics } = studentData;

  // Filter out enrollments with null or undefined courseId
  const validEnrollments = enrolledCourses?.filter(enrollment => enrollment?.courseId) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center cursor-pointer px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </button>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{student?.userName || 'Unknown Student'}</h1>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {student?.email || 'No email provided'}
              </div>
              {student?.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {student.phone}
                </div>
              )}
              {student?.createdAt && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {formatDate(student.createdAt)}
                </div>
              )}
            </div>
            {student?._id && (
              <div className="mt-3 text-xs text-gray-500 font-mono">
                Student ID: {student._id}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Enrolled</p>
              <p className="text-2xl font-bold text-gray-900">{statistics?.totalEnrolled || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{statistics?.totalCompleted || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Progress className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{statistics?.totalInProgress || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Enrolled Courses</h2>
        </div>

        {validEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses enrolled</h3>
            <p className="mt-1 text-sm text-gray-500">
              {enrolledCourses?.length > validEnrollments.length 
                ? "Some courses may have been deleted or are no longer available."
                : "This student hasn't enrolled in any courses yet."
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {validEnrollments.map((enrollment) => (
              <div key={enrollment._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {enrollment.courseId?.title || 'Course Title Not Available'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 max-w-2xl">
                          {enrollment.courseId?.description || 'No description available'}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                        {getStatusBadge(enrollment.status)}
                        {enrollment.courseId?._id && (
                          <button
                            onClick={() => handleUnenrollCourse(enrollment.courseId._id, enrollment.courseId.title)}
                            disabled={unenrollingCourse === enrollment.courseId._id}
                            className="inline-flex items-center cursor-pointer px-2 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {unenrollingCourse === enrollment.courseId._id ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-red-700 mr-1"></div>
                                Unenrolling...
                              </>
                            ) : (
                              <>
                                <UserMinus className="h-3 w-3 mr-1" />
                                Unenroll
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-2 text-gray-900">{enrollment.courseId?.duration || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Enrolled:</span>
                        <span className="ml-2 text-gray-900">{formatDate(enrollment.enrolledAt)}</span>
                      </div>
                      {enrollment.completedAt && (
                        <div>
                          <span className="text-gray-500">Completed:</span>
                          <span className="ml-2 text-gray-900">{formatDate(enrollment.completedAt)}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {!enrollment.isCompleted && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-900 font-medium">{enrollment.progressPercentage || 0}%</span>
                        </div>
                        <ProgressBar percentage={enrollment.progressPercentage || 0} />
                      </div>
                    )}

                    {/* Certificate Info */}
                    {enrollment.certificateIssued && (
                      <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm text-green-800 font-medium">Certificate Issued</span>
                        </div>
                      </div>
                    )}
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

export default StudentDetails;