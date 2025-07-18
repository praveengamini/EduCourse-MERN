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
import StudentHome from './pages/student-view/home'
import CheckAuth from './components/common/CheckAuth'
import UnAuthPage from './pages/unauth-page/UnAuthPage'
import StudentDashboard from './pages/student-view/StudentDashboard/StudentDashboard';
import { useSelector } from 'react-redux'
import { checkAuth1 } from "./store/auth-slice";
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
const App = () => {
  const { user ,isAuthenticated} = useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth1());
  }, [dispatch]);
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
          <Route path='dashboard' element={<AdminDashboard/>} />
        </Route>
        <Route path='/student' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <StudentLayout/>
          </CheckAuth>} >
          <Route path='home' element={<StudentHome/>} >
            <Route path='' element={<StudentDashboard/>}/>
            
          </Route>
        </Route>
        <Route path='*' element={<PageNotFound/>} />
        <Route path='/unauth-page'   element={<UnAuthPage/>}/>
      </Routes>
            <Toaster richColors position="bottom-right" />
    </div>
  )
}

export default App
