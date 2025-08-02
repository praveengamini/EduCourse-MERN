import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setUser } from '@/store/auth-slice';
import { useSelector } from 'react-redux';
import {
  User, Mail, Phone, Calendar, BookOpen, Award, Edit2, Save, X, Eye, EyeOff
} from 'lucide-react';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  console.log(user);

  useEffect(() => {
    if (user?.id) {
      fetchEnrolledCourses(user.id);
      setEditForm({
        userName: user.userName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const fetchEnrolledCourses = async (studentId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/student/enrolledcourses?studentId=${studentId}`);
      setEnrolledCourses(res.data.enrolledCourses || []);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load enrolled courses' });
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        userName: user.userName || '',
        phone: user.phone || '',
      });
      setMessage({ type: '', text: '' });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatePayload = {
        userName: editForm.userName,
        phone: editForm.phone,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/student?id=${user.id}`,
        updatePayload
      );

      if (res.data?.success && res.data?.user) {
        dispatch(setUser(res.data.user));
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile" });
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return 'from-green-400 to-green-500';
    if (percentage >= 50) return 'from-yellow-400 to-orange-500';
    if (percentage >= 25) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-red-500';
  };

  const completedCourses = enrolledCourses.filter(course => course.isCompleted).length;
  const totalProgress = enrolledCourses.reduce((sum, course) => sum + course.progressPercentage, 0);
  const averageProgress = enrolledCourses.length > 0 ? Math.round(totalProgress / enrolledCourses.length) : 0;

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and track your learning progress</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-700' 
              : 'bg-red-50 border-red-400 text-red-700'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <div className="w-5 h-5 text-green-400">✓</div>
                ) : (
                  <div className="w-5 h-5 text-red-400">✗</div>
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium">{message.text}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl font-bold text-blue-600">
                    {user.userName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{user.userName}</h2>
                <p className="text-blue-100 capitalize font-medium">{user.role}</p>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="userName"
                          value={editForm.userName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white"
                          placeholder="Enter your username"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">
                          {user.userName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <p className="text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 italic">
                        📧 Email cannot be changed for security reasons
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">
                          {user.phone || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>

                  
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Member Since</label>
                      <p className="text-gray-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {!isEditing ? (
                    <button
                      onClick={handleEditToggle}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Edit2 className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleEditToggle}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <X className="w-5 h-5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📊</span>
                </div>
                <span>Learning Stats</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Total Courses</span>
                  <span className="font-bold text-2xl text-blue-600">{enrolledCourses.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Completed</span>
                  <span className="font-bold text-2xl text-green-600">{completedCourses}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700 font-medium">In Progress</span>
                  <span className="font-bold text-2xl text-orange-600">{enrolledCourses.length - completedCourses}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Average Progress</span>
                  <span className="font-bold text-2xl text-purple-600">{averageProgress}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-6 bg-gradient-to-r from-indigo-600 to-purple-600">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <BookOpen className="w-7 h-7" />
                  <span>My Learning Journey</span>
                </h2>
                <p className="text-indigo-100 mt-1">Track your progress across all enrolled courses</p>
              </div>

              <div className="p-6">
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-gray-300 text-8xl mb-6">📚</div>
                    <h3 className="text-2xl font-bold text-gray-500 mb-2">No courses enrolled yet</h3>
                    <p className="text-gray-400 mb-6">Start your learning journey by enrolling in a course</p>
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg">
                      Browse Courses
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {enrolledCourses.map((course) => (
                      <div
                        key={course._id}
                        className="border-2 border-gray-100 rounded-xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
                      >
                        <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                          {/* Course Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={course.courseId.coverImage || 'https://via.placeholder.com/300x200?text=Course+Image'}
                              alt={course.courseId.title}
                              className="w-full md:w-40 h-28 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                  {course.courseId.title}
                                </h3>
                                <p className="text-gray-600 mb-3 line-clamp-2">
                                  {course.courseId.description}
                                </p>
                              </div>

                              <div className="flex flex-col items-end space-y-2 mt-2 md:mt-0">
                                <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                                  course.isCompleted
                                    ? 'bg-green-100 text-green-800 border-2 border-green-200'
                                    : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-200'
                                }`}>
                                  {course.isCompleted ? '✅ Completed' : '⏳ In Progress'}
                                </span>

                                {course.isCompleted && course.certificateIssued && (
                                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-800 border-2 border-blue-200">
                                    <Award className="w-4 h-4 mr-2" />
                                    Certificate Earned
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-700">Course Progress</span>
                                <span className="text-sm font-bold text-gray-800">
                                  {course.progressPercentage}% Complete
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                                <div
                                  className={`h-4 rounded-full bg-gradient-to-r ${getProgressColor(course.progressPercentage)} transition-all duration-500 shadow-sm`}
                                  style={{ width: `${course.progressPercentage}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Course Meta Information */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}</span>
                              </span>
                              {course.completedAt && (
                                <span className="flex items-center space-x-1">
                                  <Award className="w-4 h-4" />
                                  <span>Completed: {new Date(course.completedAt).toLocaleDateString()}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;