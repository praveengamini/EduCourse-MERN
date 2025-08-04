import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import CourseCard from './CourseCard';
import { courseAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const HeadingBlock = () => {
  const navigate = useNavigate();

  const handleBrowseAll = () => {
    navigate('landing/courses');
  };


  return (
    <div className="mb-12 pl-4">
      <div className="flex items-center justify-between w-full">
        {/* Left: Heading */}
        <h2 className="text-6xl font-bold text-[#C1BFFF] relative whitespace-nowrap">
          Latest Courses
          <img
            src="/assets/thread_ltc2.png"
            alt="underline"
            className="absolute left-20 bottom-[-8px] w-[120px]"
          />
        </h2>

        {/* Center: Divider with graphic (hidden on mobile) */}
        <div className="hidden md:flex items-center flex-grow mx-4">
          <div className="mx-4 shrink-0">
            <img
              src="/assets/thread_latestcourse.png"
              alt="center design"
              className="w-150 h-25"
            />
          </div>
        </div>

        {/* Right: Browse All */}
        <button
          onClick={handleBrowseAll}
          className="flex items-center space-x-2 text-[#C1BFFF] hover:text-purple-300 whitespace-nowrap cursor-pointer"
        >
          <span>Browse All</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

const CoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchCourses();
  }, []);

  const filterAndSortCourses = (courses) => {
    const currentYear = new Date().getFullYear();
    return courses
      .filter(course => new Date(course.createdAt).getFullYear() === currentYear)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAllCourses();
      const allCourses = response.courses || [];
      const filtered = filterAndSortCourses(allCourses);
      setCourses(filtered);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await courseAPI.enrollCourse(courseId);
      alert('Successfully enrolled!');
    } catch (err) {
      console.error('Error enrolling:', err);
      alert('Something went wrong. Try again.');
    }
  };

  return (
    <section id="courses" className="py-20 bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeadingBlock />

        {loading ? (
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#1c1c1c] rounded-lg border border-gray-800 p-6 animate-pulse min-w-[320px]">
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex space-x-6 overflow-x-auto pb-4 no-scrollbar" >
            {courses.map(course => (
              <CourseCard
                key={course._id}
                course={course}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;
