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
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="hidden lg:flex gap-3 ml-4">
        <Button variant="ghost" onClick={() => navigate("/student/home")}>
          All Courses
        </Button>
        <Button variant="ghost" onClick={() => navigate("/student/my-courses")}>
          My Courses
        </Button>
        <Button variant="ghost" onClick={() => navigate("/student/new-course")}>
          Enroll New Course
        </Button>
        <Button variant="ghost" onClick={() => navigate("/student/validator")}>Button 5</Button>
      </div>

      <div className="flex items-center gap-2">
        {/* Profile Button */}
        <Button
          onClick={() => navigate("myprofile")}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
          variant="outline"
        >
          <UserCircle className="w-5 h-5" />
          Profile
        </Button>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
