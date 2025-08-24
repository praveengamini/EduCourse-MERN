import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, UsersIcon, CalendarDaysIcon, AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const EnrollCourse = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/students`);
      setStudents(res.data.students);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/courses`);
      setCourses(res.data.courses);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleStudentSelect = async (e) => {
    const studentId = e.target.value;
    if (!studentId) {
      setSelectedStudent(null);
      setEnrolledCourses([]);
      return;
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/student/${studentId}`);
      setSelectedStudent(res.data.student);

      const enrolledRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/student/enrolledcourses?studentId=${studentId}`);
      setEnrolledCourses(enrolledRes.data.enrolledCourses);
    } catch (err) {
      console.error("Error fetching student details:", err);
    }
  };

  const handleCourseSelect = async (e) => {
    const courseId = e.target.value;
    if (!courseId) {
      setSelectedCourse(null);
      return;
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/course/${courseId}`);
      setSelectedCourse(res.data.course);
    } catch (err) {
      console.error("Error fetching course:", err);
    }
  };

  const handleEnroll = async () => {
    if (!selectedStudent || !selectedCourse) {
      toast.error("Select both student and course");
      return;
    }

    setLoading(true);
    try {
      // console.log(selectedStudent._id , selectedCourse._id)
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/admin/enroll-student`, {
        studentId: selectedStudent._id,
        courseId: selectedCourse._id
      });

      toast.success("Student enrolled successfully!");
      const enrolledRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/student/enrolledcourses?studentId=${selectedStudent._id}`);
      setEnrolledCourses(enrolledRes.data.enrolledCourses);
    } catch (err) {
      console.error("Enrollment error:", err);
      toast.error(err.response?.data?.message || "Error enrolling student");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ToastContainer />
      {/* Header Section */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors duration-200 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Course Enrollment</h1>
              <p className="text-slate-600">Manage student course enrollments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Student Selection Card */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Select Student</h2>
            </div>
            <select
              onChange={handleStudentSelect}
              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-slate-700"
            >
              <option value="">Choose a student...</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.userName} - {s.email}</option>
              ))}
            </select>
          </div>

          {/* Course Selection Card */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Select Course</h2>
            </div>
            <select
              onChange={handleCourseSelect}
              className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-slate-700"
            >
              <option value="">Choose a course...</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Details Card */}
        {selectedStudent && (
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-indigo-200/30 p-6 mb-8 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800">Student Profile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-sm text-slate-600 mb-1">Full Name</p>
                <p className="font-semibold text-slate-800">{selectedStudent.userName}</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-sm text-slate-600 mb-1">Email Address</p>
                <p className="font-semibold text-slate-800">{selectedStudent.email}</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-sm text-slate-600 mb-1">Role</p>
                <p className="font-semibold text-slate-800 capitalize">{selectedStudent.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enrolled Courses Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800">Current Enrollments</h2>
          </div>
          
          {enrolledCourses.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 p-12 text-center">
              <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AcademicCapIcon className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600 text-lg">No course enrollments found</p>
              <p className="text-slate-500 text-sm mt-2">This student hasn't enrolled in any courses yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((ec, index) => (
                <div key={index} className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={ec.courseId.coverImage}
                      alt={ec.courseId.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      {ec.isCompleted ? (
                        <div className="flex items-center space-x-1 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          <CheckCircleIcon className="h-4 w-4" />
                          <span>Completed</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span>In Progress</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 line-clamp-2">{ec.courseId.title}</h3>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <div className="flex items-center space-x-2">
                        <CalendarDaysIcon className="h-4 w-4" />
                        <span>Enrolled {new Date(ec.enrolledAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enroll Button */}
        <div className="flex justify-center">
          <button
            onClick={handleEnroll}
            disabled={loading || !selectedStudent || !selectedCourse}
            className={`
              relative px-8 py-4 rounded-2xl font-semibold text-lg cursor-pointer transition-all duration-300 transform
              ${(loading || !selectedStudent || !selectedCourse) 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95'
              }
            `}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <span className={loading ? 'opacity-0' : 'opacity-100'}>
              {loading ? 'Enrolling...' : 'Enroll Student in Course'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollCourse;