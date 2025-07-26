import React from 'react' 
import { useSelector } from 'react-redux';
export default function MyCourses() {
  const name = useSelector((state)=>state.auth.user);
  console.log(name)
  return (
    <div>MyCourses</div>
    
  )
}
