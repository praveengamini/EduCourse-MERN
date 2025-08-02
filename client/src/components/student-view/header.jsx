// import { AlignJustify, LogOut, UserCircle } from "lucide-react";
// import { Button } from "../ui/button";
// import { useDispatch } from "react-redux";
// import { logoutUser } from "@/store/auth-slice";
// import { useNavigate } from "react-router-dom";

// function AdminHeader({ setOpen }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   function handleLogout() {
//     dispatch(logoutUser());
//   }

//   return (
//     <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
//       <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
//         <AlignJustify />
//         <span className="sr-only">Toggle Menu</span>
//       </Button>

//       <div className="hidden lg:flex gap-3 ml-4">
//         <Button variant="ghost" onClick={() => navigate("/student/home")}>
//           All Courses
//         </Button>
//         <Button variant="ghost" onClick={() => navigate("/student/my-courses")}>
//           My Courses
//         </Button>
//         <Button variant="ghost" onClick={() => navigate("/student/new-course")}>
//           Enroll New Course
//         </Button>
//         <Button variant="ghost" onClick={() => navigate("/student/validator")}>Validate your certificate</Button>
//         <Button variant="ghost" onClick={() => navigate("/student/generate")}>Validate your certificate</Button>
//       </div>

//       <div className="flex items-center gap-2">
//         {/* Profile Button */}
//         <Button
//           onClick={() => navigate("myprofile")}
//           className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
//           variant="outline"
//         >
//           <UserCircle className="w-5 h-5" />
//           Profile
//         </Button>

//         {/* Logout Button */}
//         <Button
//           onClick={handleLogout}
//           className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
//         >
//           <LogOut className="w-5 h-5" />
//           Logout
//         </Button>
//       </div>
//     </header>
//   );
// }

// export default AdminHeader;
import { AlignJustify, LogOut, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle the user logout process.
  // It dispatches the logout action and navigates to the home page.
  function handleLogout() {
    dispatch(logoutUser());
    navigate("/");
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-black text-white rounded-b-lg shadow-xl">
      {/* Container for the logo and mobile menu toggle */}
      <div className="flex items-center gap-4">
        <Button onClick={() => setOpen(true)} className="lg:hidden text-white hover:bg-gray-700 transition-colors">
          <AlignJustify />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* The main logo/brand name for the application */}
        <div className="text-2xl font-extrabold text-purple-600">
          EduQuest
        </div>
      </div>

      {/* Container for user-related actions on the right */}
      <div className="flex items-center gap-19">
        {/* This div contains the navigation links that are only visible on larger screens */}
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
