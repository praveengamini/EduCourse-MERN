import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AlignJustify, LogOut, UserCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import { logoutUser } from "@/store/auth-slice";

function AdminHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  function handleLogout() {
    dispatch(logoutUser());
    navigate("/");
  }

  function toggleNavbar() {
    setIsNavOpen(!isNavOpen);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 bg-zinc-950 text-white shadow-xl border-b border-zinc-800">
      <div className="flex items-center gap-4">
        <Button 
          onClick={toggleNavbar}
          className="lg:hidden text-white hover:bg-zinc-800 transition-colors p-3 rounded-md"
        >
          <AlignJustify />
          <span className="sr-only">Toggle Menu</span>
        </Button>
          <div className="text-2xl font-bold p-0 text-white"><img  width="80px" src="/CyberLink.png"/></div>

      </div>
      
      {/* Mobile Navigation Menu - Overlay */}
      {isNavOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleNavbar}
        ></div>
      )}

      {/* Mobile Navigation Menu - Sidebar */}
      <nav className={`fixed top-0 left-0 h-full w-64 bg-zinc-950 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="text-2xl font-bold text-white p-0"><img  width="80px" height="50px" src="/CyberLink.png"/></div>

          <Button onClick={toggleNavbar} className="text-white hover:bg-zinc-800 transition-colors p-2 rounded-full">
            <X />
            <span className="sr-only">Close Menu</span>
          </Button>
        </div>
        <ul className="flex flex-col p-4 space-y-4">
          <li>
            <span className="block text-gray-300 hover:text-violet-400 transition-colors duration-200 cursor-pointer text-base font-medium px-2 py-1 rounded" 
              onClick={() => { toggleNavbar(); navigate("/student/"); }}>
              Dashboard
            </span>
          </li>
          <li>
            <span className="block text-gray-300 hover:text-violet-400 transition-colors duration-200 cursor-pointer text-base font-medium px-2 py-1 rounded" 
              onClick={() => { toggleNavbar(); navigate("/student/home"); }}>
              All Courses
            </span>
          </li>
          <li>
            <span className="block text-gray-300 hover:text-violet-400 transition-colors duration-200 cursor-pointer text-base font-medium px-2 py-1 rounded" 
              onClick={() => { toggleNavbar(); navigate("/student/my-courses"); }}>
              My Courses
            </span>
          </li>
          <li>
            <span className="block text-gray-300 hover:text-violet-400 transition-colors duration-200 cursor-pointer text-base font-medium px-2 py-1 rounded" 
              onClick={() => { toggleNavbar(); navigate("/student/new-course"); }}>
              Enroll New Course
            </span>
          </li>
          <li>
            <span className="block text-gray-300 hover:text-violet-400 transition-colors duration-200 cursor-pointer text-base font-medium px-2 py-1 rounded" 
              onClick={() => { toggleNavbar(); navigate("/student/validator"); }}>
              Validate Certificate
            </span>
          </li>
        </ul>
      </nav>

      {/* Desktop navigation links and user buttons */}
      <div className="flex items-center gap-10">
        <nav className="hidden lg:flex items-center gap-8">
          <span className="text-gray-300 hover:text-violet-400 transition-colors duration-200 cursor-pointer text-sm font-medium" 
            onClick={() => navigate("/student/")}>
            Dashboard
          </span>
          <span className="text-gray-300 hover:text-violet-400 transition-colors duration-200 cursor-pointer text-sm font-medium" 
            onClick={() => navigate("/student/home")}>
            All Courses
          </span>
          <span className="text-gray-300 hover:text-violet-400 transition-colors duration-200 cursor-pointer text-sm font-medium" 
            onClick={() => navigate("/student/my-courses")}>
            My Courses
          </span>
          <span className="text-gray-300 hover:text-violet-400 transition-colors duration-200 cursor-pointer text-sm font-medium" 
            onClick={() => navigate("/student/new-course")}>
            Enroll New Course
          </span>
          <span className="text-gray-300 hover:text-violet-400 transition-colors duration-200 cursor-pointer text-sm font-medium" 
            onClick={() => navigate("/student/validator")}>
            Validate Certificate
          </span>
        </nav>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("myprofile")}
            className="flex gap-2 items-center text-sm font-medium text-gray-200 hover:bg-zinc-800 transition-colors px-4 py-2 rounded-full"
          >
            <UserCircle className="w-5 h-5" />
            <span className="hidden md:inline">Profile</span>
          </Button>
          <Button
            onClick={handleLogout}
            className="flex gap-2 items-center text-sm font-semibold text-gray-900 bg-white hover:bg-gray-200 transition-colors shadow px-4 py-2 rounded-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
