import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AlignJustify, LogOut, UserCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import { logoutUser } from "@/store/auth-slice";
import Header from "../landingPage/Header";
import confetti from "canvas-confetti"; // 🎊 add this
import { toast } from "react-toastify";

function AdminHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [active, setActive] = useState("/student/"); // track selected tab

  const { isAuthenticated } = useSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logoutUser());
    toast("logged out sucessfully",{theme:"dark"})
    navigate("/");
  }

  function toggleNavbar() {
    setIsNavOpen(!isNavOpen);
  }

  // Confetti function 🎉
  function launchConfetti() {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
    navigate("/student/"); 
  }

  // If not authenticated, show landing header
  if (!isAuthenticated) {
    return <Header />;
  }

  // Nav link helper
  const navItem = (label, path) => (
    <span
      className={`cursor-pointer text-sm font-medium transition-colors duration-200 px-2 py-1 rounded
        ${active === path ? "text-violet-400 font-semibold" : "text-gray-300 hover:text-violet-400"}`}
      onClick={() => {
        setActive(path);
        toggleNavbar();
        navigate(path);
      }}
    >
      {label}
    </span>
  );

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
        {/* 🎊 Logo with confetti effect */}
        <img
          width="80px"
          src="/CyberLink.png"
          className="cursor-pointer hover:scale-110 transition-transform duration-300"
          onClick={launchConfetti}
        />
      </div>

      {/* Mobile Nav Overlay */}
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleNavbar}
        ></div>
      )}

      {/* Mobile Nav Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-950 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="text-2xl font-bold text-white p-0">
            <img
              width="80px"
              height="50px"
              src="/CyberLink.png"
              className="cursor-pointer hover:scale-110 transition-transform duration-300"
              onClick={launchConfetti}
            />
          </div>
          <Button
            onClick={toggleNavbar}
            className="text-white hover:bg-zinc-800 transition-colors p-2 rounded-full"
          >
            <X />
            <span className="sr-only">Close Menu</span>
          </Button>
        </div>
        <ul className="flex flex-col p-4 space-y-4">
          <li>{navItem("Dashboard", "/student/")}</li>
          <li>{navItem("All Courses", "/student/home")}</li>
          <li>{navItem("My Courses", "/student/my-courses")}</li>
          <li>{navItem("Enroll New Course", "/student/new-course")}</li>
          <li>{navItem("Validate Certificate", "/student/validator")}</li>
        </ul>
      </nav>

      {/* Desktop Nav */}
      <div className="flex items-center gap-10">
        <nav className="hidden lg:flex items-center gap-8">
          {navItem("Dashboard", "/student/")}
          {navItem("All Courses", "/student/home")}
          {navItem("My Courses", "/student/my-courses")}
          {navItem("Enroll New Course", "/student/new-course")}
          {navItem("Validate Certificate", "/student/validator")}
        </nav>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              setActive("myprofile");
              navigate("myprofile");
            }}
            className={`flex gap-2 cursor-pointer items-center text-sm font-medium transition-colors px-4 py-2 rounded-full 
              ${active === "myprofile" ? "bg-zinc-800 text-violet-400" : "text-gray-200 hover:bg-zinc-800"}`}
          >
            <UserCircle className="w-5 h-5" />
            <span className="hidden md:inline">Profile</span>
          </Button>
          <Button
            onClick={handleLogout}

            className="flex gap-2 cursor-pointer items-center text-sm font-semibold text-gray-900 bg-white hover:bg-gray-200 transition-colors shadow px-4 py-2 rounded-full"
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
