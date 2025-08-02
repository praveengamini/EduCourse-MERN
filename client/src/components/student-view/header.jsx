import { AlignJustify, LogOut, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  function handleLogout() {
    dispatch(logoutUser());
    navigate("/");
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-black text-white shadow-xl">
      <div className="flex items-center gap-4">
        <Button onClick={() => setOpen(true)} className="lg:hidden text-white hover:bg-gray-700 transition-colors">
          <AlignJustify />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="text-2xl font-extrabold text-purple-600">
          EduQuest
        </div>
      </div>

      <div className="flex items-center gap-19">
        <div className="hidden lg:flex gap-9">
          <span className="text-white hover:text-purple-600 transition-colors duration-200 cursor-pointer" onClick={() => navigate("/student/")}>
            Dashboard
          </span>
          <span className="text-white hover:text-purple-600 transition-colors duration-200 cursor-pointer" onClick={() => navigate("/student/home")}>
            All Courses
          </span>
          <span className="text-white hover:text-purple-600 transition-colors duration-200 cursor-pointer" onClick={() => navigate("/student/my-courses")}>
            My Courses
          </span>
          <span className="text-white hover:text-purple-600 transition-colors duration-200 cursor-pointer" onClick={() => navigate("/student/new-course")}>
            Enroll New Course
          </span>
          <span className="text-white hover:text-purple-600 transition-colors duration-200 cursor-pointer" onClick={() => navigate("/student/validator")}>
            Validate Certificate
          </span>
        </div>

        {/* User profile and logout buttons */}
        <div className="flex items-center gap-5">
          {/* Profile Button - styled as text to match the image's "Username dashboard" style */}
          <Button
            onClick={() => navigate("myprofile")}
            className="inline-flex gap-2 items-center text-sm font-medium text-gray-200 hover:bg-gray-900 cursor-pointer"
          >
            <UserCircle className="w-5 h-5" />
            <span className="hidden md:inline">Profile</span>
          </Button>

          {/* Logout Button - styled with a rounded, white background to match the image */}
          <Button
            onClick={handleLogout}
            className="inline-flex gap-2 items-center text-sm font-semibold text-gray-900 bg-white hover:bg-gray-200 transition-colors shadow cursor-pointer"
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