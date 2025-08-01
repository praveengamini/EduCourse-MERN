import React, { useState, useEffect } from 'react';
import { courseAPI } from '../../services/api';


const StatsCards = () => {
  const [courseCount, setCourseCount] = useState(null);

  useEffect(() => {
    const fetchCourseCount = async () => {
      try {
        const response = await courseAPI.getAllCourses();
        const courses = response.courses || []; // assuming response = { courses: [...] }
        setCourseCount(courses.length);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourseCount(0); // fallback
      }
    };

    fetchCourseCount();
  }, []);

  const stats = [
    { label: "STAFF", number: "10+" },
    { label: "INSTRUCTORS", number: "10+" },
    { label: "USERS", number: "25+" },
    { label: "ENROLMENT", number: "27+" },
    {
      label: "COURSES",
      number: courseCount !== null ? `${courseCount}` : '...',
    },
  ];

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-200 p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
            >
              <br />
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-purple-800 mb-2">{stat.number}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCards;
