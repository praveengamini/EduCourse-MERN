import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, ArrowLeftIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/solid';
import { UsersIcon, CalendarDaysIcon, CurrencyRupeeIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const AllCourses = ({ isLanding = false }) => {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ title: '', cost: '', studentCount: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/courses`, {
        params: filters
      });
      setCourses(res.data.courses);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-indigo-600 hover:text-indigo-800 mb-8 transition-all duration-200 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back</span>
        </button>

        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                All Courses
              </h1>
              <p className="text-gray-600 flex items-center">
                <BookOpenIcon className="h-5 w-5 mr-2" />
                Manage and explore your course catalog
              </p>
            </div>
            
            {/* Filters Section */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="title"
                  placeholder="Search courses..."
                  value={filters.title}
                  onChange={handleFilterChange}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200"
                />
              </div>
              
              <div className="flex items-center gap-2 bg-gray-50/80 backdrop-blur-sm rounded-xl p-1">
                <FunnelIcon className="h-4 w-4 text-gray-500 ml-2" />
                <select
                  name="cost"
                  value={filters.cost}
                  onChange={handleFilterChange}
                  className="bg-transparent border-0 px-3 py-2 focus:outline-none text-sm font-medium text-gray-700"
                >
                  <option value="">All Prices</option>
                  <option value=">1000">{'> ₹1000'}</option>
                  <option value="<2000">{'< ₹2000'}</option>
                  <option value=">1000 and <2000">{'₹1000 - ₹2000'}</option>
                  <option value=">1000 and <3000">{'₹1000 - ₹3000'}</option>
                  <option value=">4000">{'> ₹4000'}</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-gray-50/80 backdrop-blur-sm rounded-xl p-1">
                <UsersIcon className="h-4 w-4 text-gray-500 ml-2" />
                <select
                  name="studentCount"
                  value={filters.studentCount}
                  onChange={handleFilterChange}
                  className="bg-transparent border-0 px-3 py-2 focus:outline-none text-sm font-medium text-gray-700"
                >
                  <option value="">All Students</option>
                  <option value="<=10">{'≤ 10 students'}</option>
                  <option value=">10 and <=20">{'11-20 students'}</option>
                  <option value=">20 and <=30">{'21-30 students'}</option>
                  <option value=">30 and <=40">{'31-40 students'}</option>
                  <option value=">40 and <=50">{'41-50 students'}</option>
                  <option value=">50 and <=60">{'51-60 students'}</option>
                  <option value=">60 and <=70">{'61-70 students'}</option>
                  <option value=">70 and <=80">{'71-80 students'}</option>
                  <option value=">80 and <=90">{'81-90 students'}</option>
                  <option value=">90 and <=100">{'91-100 students'}</option>
                  <option value=">100">{'> 100 students'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-indigo-600">{courses.length}</span> courses
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live updates
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-white/20">
            <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or create a new course</p>
            <button
              onClick={() => navigate('/admin/add-course')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-white/20 hover:scale-105"
                onClick={() => {
                  if (isLanding) {
                    navigate("/auth/login");
                  } else {
                    navigate(`/admin/courses/${course._id}`);
                  }
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowLeftIcon className="h-4 w-4 text-indigo-600 rotate-180" />
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
                    {course.title}
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600 bg-gray-50/80 rounded-full px-3 py-1">
                        <UsersIcon className="h-4 w-4 mr-2 text-indigo-500" />
                        <span className="font-medium">{course.studentCount}</span>
                        <span className="ml-1">students</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 bg-green-50/80 rounded-full px-3 py-1">
                        <CurrencyRupeeIcon className="h-4 w-4 mr-1 text-green-500" />
                        <span className="font-bold text-green-700">₹{course.cost}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-500 bg-gray-50/80 rounded-full px-3 py-2">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      <span>Created {new Date(course.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <button
          // onClick={() => navigate('/admin/add-course')}
          onClick={() => {
            if (isLanding) {
              navigate("/auth/login");
            } else {
              navigate(`/admin/add-course`);
            }
          }}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-110"
        >
          <PlusIcon className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default AllCourses;