import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, ArrowLeftIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/solid';
import { UsersIcon, CalendarDaysIcon, CurrencyRupeeIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const AllCourses = () => {
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
        <div className="min-h-screen bg-black text-gray-100 py-15 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-800 rounded-full blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-800 rounded-full blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

            <style>
                {`
                @keyframes blob {
                    0% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0, 0) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite ease-in-out; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                `}
            </style>
            
            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center text-violet-400 hover:text-violet-200 mb-8 transition-all duration-200 bg-zinc-900/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="font-medium">Back</span>
                </button>

                {/* Header Section */}
                <div className="bg-zinc-900/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-zinc-800">
                    <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-500 to-blue-400 bg-clip-text text-transparent mb-2">
                                All Courses
                            </h1>
                            <p className="text-gray-400 flex items-center">
                                <BookOpenIcon className="h-5 w-5 mr-2" />
                                Explore your course catalog.
                            </p>
                        </div>
                        
                        {/* Filters Section */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Search courses..."
                                    value={filters.title}
                                    onChange={handleFilterChange}
                                    className="pl-10 pr-4 py-3 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent bg-zinc-800/80 backdrop-blur-sm shadow-sm transition-all duration-200 text-gray-200 placeholder-gray-500"
                                />
                            </div>
                            
                            <div className="flex items-center gap-2 bg-zinc-800/80 backdrop-blur-sm rounded-xl p-1 border border-zinc-700">
                                <FunnelIcon className="h-4 w-4 text-gray-500 ml-2" />
                               <select
                                    name="cost"
                                    value={filters.cost}
                                    onChange={handleFilterChange}
                                    className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm font-medium text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
                                    >
                                    <option className='bg-zinc-900' value="">All Prices</option>
                                    <option className='bg-zinc-900' value=">1000">{'> ₹1000'}</option>
                                    <option className='bg-zinc-900' value="<2000">{'< ₹2000'}</option>
                                    <option className='bg-zinc-900' value=">1000 and <2000">{'₹1000 - ₹2000'}</option>
                                    <option className='bg-zinc-900' value=">1000 and <3000">{'₹1000 - ₹3000'}</option>
                                    <option className='bg-zinc-900' value=">4000">{'> ₹4000'}</option>
                                    </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            Showing <span className="font-semibold text-violet-400">{courses.length}</span> courses
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            Live updates
                        </div>
                    </div>
                </div>

                {/* Courses Grid */}
                {courses.length === 0 ? (
                    <div className="bg-zinc-900/70 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-zinc-800">
                        <BookOpenIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No courses found</h3>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">please wait for the admin to upload..</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                onClick={()=>navigate(`/student/courses/${course._id}`)}
                                className="group bg-zinc-900/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-zinc-800 hover:scale-105 cursor-pointer"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={course.coverImage}
                                        alt={course.title}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-4 right-4 bg-zinc-900/70 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <ArrowLeftIcon className="h-4 w-4 text-violet-400 rotate-180" />
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h2 className="text-lg font-bold text-gray-200 mb-3 group-hover:text-violet-400 transition-colors duration-200 line-clamp-2">
                                        {course.title}
                                    </h2>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-sm text-gray-400 bg-zinc-800 rounded-full px-3 py-1">
                                                <UsersIcon className="h-4 w-4 mr-2 text-violet-400" />
                                                <span className="font-medium">{course.studentCount}</span>
                                                <span className="ml-1">students</span>
                                            </div>
                                            
                                            <div className="flex items-center text-sm text-gray-400 bg-green-900/40 rounded-full px-3 py-1">
                                                <CurrencyRupeeIcon className="h-4 w-4 mr-1 text-green-400" />
                                                <span className="font-bold text-green-400">₹{course.cost}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center text-xs text-gray-500 bg-zinc-800 rounded-full px-3 py-2">
                                            <CalendarDaysIcon className="h-4 w-4 mr-2" />
                                            <span>Created {new Date(course.createdAt).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}</span>
                                        </div>
                                        <button onClick={()=>navigate(`/student/courses/${course._id}`)} className="w-full py-2 cursor-pointer text-violet-400 border border-violet-600 hover:bg-violet-600 hover:text-white transition rounded-2xl mt-4">
                                            View Course
                                        </button>
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

export default AllCourses;
