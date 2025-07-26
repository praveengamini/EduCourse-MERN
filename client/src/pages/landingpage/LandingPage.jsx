import React from "react";
import { useNavigate } from "react-router-dom";
import AllCourses from "../admin-course/AllCourses"; // adjust path if needed

const LandingPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex justify-between items-center px-6 py-4 bg-white/80 shadow backdrop-blur-md">
        <h1 className="text-xl font-bold text-indigo-600">CourseHub</h1>
        {!isAuthenticated && (
          <button
            onClick={() => navigate("/auth/login")}
            className="text-white bg-indigo-600 px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Login
          </button>
        )}
      </div>

      <div className="p-4 md:p-8">
        <AllCourses isLanding={true} />
      </div>
    </div>
  );
};

export default LandingPage;
