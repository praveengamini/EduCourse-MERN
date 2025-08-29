import React from 'react'
import { Toaster } from "sonner";
import { ToastContainer } from 'react-toastify';
import { Route,Routes, useNavigate } from 'react-router-dom'
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
import LandingPageValidator from "./components/LandingPageValidator"
import { useSelector } from 'react-redux'
import { checkAuth1 } from "./store/auth-slice";
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import StudentManagement from './components/StudentManagement/StudentManagement'
import WeeklyStats from './components/admin-view/WeeklyStats';
import MyCourses from './pages/student-view/MyCourses/MyCourses';
import CourseDisplay from './pages/student-view/CourseDisplay/CourseDisplay';
import NewCourse from './pages/student-view/NewCourse/NewCourse';
import LandingPage from './pages/landingpage/LandingPage';
import CourseWiseStudentDashboard from './pages/admin-view/CourseWiseStudentDashboard';
import UserProfile from './pages/student-view/UserProfile/UserProfile';
import CertificateValidator from './components/CertificateValidator';
import CertificateGeneratorPanel from './components/CertificateGeneratorPanel';
import StudentDashboard from './pages/student-view/StudentDashboard/StudentDashboard';
import AllCoursesPage from './components/landingPage/AllCoursesPage';
import AddNewStudent from './pages/admin-view/AddNewStudent';
import ChangePassword from './pages/student-view/ChangePassword/ChangePassword';
import LoadingComponent from './utils/LoadingComponent';
const App = () => {
   const { user ,isAuthenticated, isLoading } = useSelector((state)=>state.auth)   
   const dispatch = useDispatch();
   useEffect(() => {
     dispatch(checkAuth1());
    }, [dispatch]);
    
    if (isLoading) {
      return (
      <LoadingComponent />
    );
  }

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
              <LandingPage isAuthenticated={isAuthenticated} />
          }
        />
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
          <Route path='add-course' element={<AddCourse/>}/>
          <Route path="courses" element={<AllCourses />} />
          <Route path="courses/:courseId" element={<CourseDetail />} />
          <Route path="enrollcourse" element={<EnrollCourse />} />
          <Route path="weekly-stats" element={<WeeklyStats />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path = "coursewisestudent" element = {<CourseWiseStudentDashboard />} />
          <Route path = "add-student" element = {<AddNewStudent />} />
        </Route>
        <Route path='/student' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <StudentLayout/>
          </CheckAuth>} >
             <Route path="" element={<StudentDashboard />} />
            <Route path='home' element={<CoursesMenu/>}/>
            <Route path='my-courses' element={<MyCourses/>}/>
            <Route path='new-course' element={<NewCourse/>}/>
            <Route path = 'myprofile' element = {<UserProfile />} />
            <Route path="generate" element={<CertificateGeneratorPanel />} />
            <Route path="all-courses" element={<CoursesMenu/>}/>
            <Route path="courses/:courseId" element={<CourseDisplay />} />
            <Route path="validator" element={<CertificateValidator />} />
            <Route path='change-password' element={<ChangePassword/>} />
        </Route>
          <Route path="/validator" element={<LandingPageValidator />} />
        <Route path='*' element={<PageNotFound/>} />
        <Route path='/unauth-page'   element={<UnAuthPage/>}/>
        <Route path="/landing/courses" element={<AllCoursesPage />} />
      </Routes>
          <Toaster richColors position="bottom-right" />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            draggable
            theme="dark"
          />

    </div>
    
  )
}

export default App
