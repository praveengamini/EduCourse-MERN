import React from 'react'
import { Toaster } from "sonner";
import { Route,Routes } from 'react-router-dom'
import AuthLayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'
import AdminLayout from './components/admin-view/layout'
import AdminDashboard from './pages/admin-view/dashboard'
import StudentLayout from './components/student-view/layout'
import PageNotFound from './pages/page-not-found'
import CoursesMenu from './pages/student-view/CoursesMenu/CoursesMenu';
import CheckAuth from './components/common/CheckAuth'
import UnAuthPage from './pages/unauth-page/UnAuthPage'
import AddCourse from './pages/add-course/AddCourse';
import AllCourses from './pages/admin-course/AllCourses';
import CourseDetail from './pages/admin-course/CourseDetail';
import EnrollCourse from './pages/admin-course/EnrollStudent';
import { useSelector } from 'react-redux'
import { checkAuth1 } from "./store/auth-slice";
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import MyCourses from './pages/student-view/MyCourses/MyCourses';
import CourseDisplay from './pages/student-view/CourseDisplay/CourseDisplay';
const App = () => {
   const { user ,isAuthenticated, isLoading } = useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
     dispatch(checkAuth1());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Checking authentication...
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path='/auth' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout/>
          </CheckAuth>
        }>
          <Route path='login' element={<AuthLogin/>} />
          <Route path='register' element={<AuthRegister/>}/>
        </Route>
        <Route path='/admin' element={<CheckAuth isAuthenticated={isAuthenticated} user={user} >
          <AdminLayout/>
          </CheckAuth>}>
          <Route path='dashboard' element={<AdminDashboard/>}/>
          <Route path='courseUpload' element={<AdminDashboard/>}/>
        </Route>
        <Route path='/student' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <StudentLayout/>
          </CheckAuth>} >
            <Route path='home' element={<CoursesMenu/>}/>
          <Route path='my-courses' element={<MyCourses/>} >
          </Route>
        </Route>
        <Route path='*' element={<PageNotFound/>} />
        <Route path='/unauth-page'   element={<UnAuthPage/>}/>
        <Route path="/admin/add-course" element={<AddCourse />} />
        <Route path="/admin/courses" element={<AllCourses />} />
        <Route path="/admin/courses/:courseId" element={<CourseDetail />} />
        <Route path="/student/courses/:courseId" element={<CourseDisplay />} />
        <Route path="/admin/enrollcourse" element={<EnrollCourse />} />
      </Routes>
            <Toaster richColors position="bottom-right" />
    </div>
  )
}

export default App
