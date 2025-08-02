import React from 'react'
import StudentHeader from './header'
import { Outlet } from 'react-router-dom'
import Footer from '../landingPage/Footer'
const StudentLayout = () => {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
    {/* common header */}
    <StudentHeader />
    <main className="flex flex-col w-full">
      <Outlet />
    </main>
    <Footer />
  </div>
  )
}

export default StudentLayout
