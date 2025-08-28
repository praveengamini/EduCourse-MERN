import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  if (location.pathname === "/") {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        // Check if student was created by admin and needs to change password
        if (user?.role === "student" && user?.createdByAdmin === true) {
          return <Navigate to="/student/change-password" />;
        }
        return <Navigate to="/student" />;
      }
    }
  }

  // CRITICAL: Check if authenticated student was created by admin
  if (isAuthenticated && user?.role === "student" && user?.createdByAdmin === true) {
    // Force admin-created students to stay on change-password page only
    if (location.pathname !== "/student/change-password") {
      // Show toast notification
      toast.error("You must change your password before accessing other pages!");
      return <Navigate to="/student/change-password" replace />;
    }
  }

  // Restrict non-admin-created users from accessing change-password page
  if (isAuthenticated && user?.role === "student" && user?.createdByAdmin !== true) {
    if (location.pathname === "/student/change-password") {
      toast.error("Access Denied! This page is only for admin-created accounts.");
      return <Navigate to="/student" replace />;
    }
  }

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/student/courses/",
    "/student/new-course"
  ];

  const isPublicRoute = publicRoutes.some(route => 
    location.pathname === route || 
    (route.endsWith("/") && location.pathname.startsWith(route))
  );

  if (
    !isAuthenticated &&
    !isPublicRoute &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register") ||
      location.pathname === "/"
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      // Check if student was created by admin and needs to change password
      if (user?.role === "student" && user?.createdByAdmin === true) {
        return <Navigate to="/student/change-password" />;
      }
      return <Navigate to="/student" />;
    }
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.startsWith("/student")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;