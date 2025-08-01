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
  }

  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-4 py-3 bg-zinc-950 text-gray-200 border-b border-zinc-800 shadow-md">
      {/* Mobile Menu Button */}
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block text-gray-200 bg-zinc-800 hover:bg-zinc-700">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      {/* EduQuest Logo for Large Screens */}
      <div className="hidden lg:block text-2xl font-bold text-violet-400">EduQuest</div>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex gap-3">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/student/all-courses")}
          className="text-gray-200 hover:bg-zinc-800 hover:text-violet-400"
        >
          All Courses
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/student/my-courses")}
          className="bg-zinc-700 text-gray-200 hover:bg-zinc-600 rounded-md px-4 py-2"
        >
          My Courses
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/student/new-course")}
          className="text-gray-200 hover:bg-zinc-800 hover:text-violet-400"
        >
          Enroll New Course
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/student/validator")}
          className="text-gray-200 hover:bg-zinc-800 hover:text-violet-400"
        >
          Validate your certificate
        </Button>
      </div>

      {/* Profile and Logout Buttons */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => navigate("myprofile")}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow-sm border border-zinc-700 bg-zinc-900 text-gray-200 hover:bg-zinc-800 hover:text-violet-400"
        >
          <UserCircle className="w-5 h-5" />
          Profile
        </Button>

        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow-sm border-violet-600 bg-violet-600 text-white hover:bg-violet-700"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
