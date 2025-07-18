import React from 'react'
import { Outlet } from 'react-router-dom'

const StudentHome = () => {
  return (
    <div>
      student home
      <Outlet/>
    </div>
  )
}

export default StudentHome
