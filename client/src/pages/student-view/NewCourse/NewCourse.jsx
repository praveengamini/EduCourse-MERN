import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function NewCourse() {
    const [courses,setCourses] = useState(null);
    const user = useSelector((state)=>state.auth.user);
    console.log(user);
    useEffect(()=>{
        async function getCourses (){
            const response = await axios.get(import.meta.env.VITE_SERVER_URL+"/api/admin/courses")
            console.log(response.data.courses);
            setCourses(response.data.courses);
        }
        getCourses();
    },[])
    async function newCourseFormSubmitted(e){
        e.preventDefault();                
        const data = {
        name: e.target.name.value,
        userID:user.id,
        email: e.target.email.value,
        contactNumber: e.target.tel.value,
        courseName: e.target.courseName.value,
        description: e.target.description.value,
        };
        console.log(data);
        const response = await axios.post(import.meta.env.VITE_SERVER_URL+"/api/student/sendEmail",data);
        console.log(response);
        if(response.data.messageSent){
            toast.success("email send successfully",{theme:"dark"});
        }
        else{
            toast.error("error occured in sending mail");
        }
    }
  return (
    <div className="p-4 flex flex-col items-center">
      <div className=" text-center font-bold text-violet-600 text-2xl mb-6">
        Submit form to request course access
      </div>
      <div className=' text-red-500 mb-3'>* Please ensure the name entered below is accurate and correctly formatted, as it will appear on your official course completion certificate.</div>
        <div className='items-center lg:w-5xl w-full'>
            <form onSubmit={(event)=>newCourseFormSubmitted(event)} className="space-y-6" action="">
                {/* Name */}
                <div className="relative">
                <input required
                    type="text"
                    id="name"
                    placeholder=" "
                    className="peer w-full  border border-gray-300 rounded-md px-3 pt-6 pb-2 text-sm 
                            focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-gray-600"
                />
                <label
                    htmlFor="name"
                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                    peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-600"
                >
                    Enter name (name will be displayed in the certificate)
                </label>
                </div>

                {/* Email */}
                <div className="relative">
                <input readOnly
                    type="email"
                    id="email"
                    value={user.email}
                    placeholder=" "
                    className="peer w-full border border-gray-300 rounded-md px-3 pt-6 pb-2 text-sm 
                            focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-gray-600"
                />
                <label
                    htmlFor="email"
                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                    peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-600"
                >
                    Enter mail
                </label>
                </div>

                {/* Contact Number */}
                <div className="relative">
                <input required
                    type="tel"
                    id="tel"
                    placeholder=" "
                    className="peer w-full border border-gray-300 rounded-md px-3 pt-6 pb-2 text-sm 
                            focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-gray-600"
                />
                <label
                    htmlFor="tel"
                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                    peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-600"
                >
                    Enter contact number
                </label>
                </div>

                {/* Course Name */}
               <div className="relative">
                    <label htmlFor="courseName" className="block mb-1 text-sm text-gray-600">
                        Select Course
                    </label>
                    <select
                        id="courseName"
                        name="courseName"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        required
                    >
                        <option value="no courses selected">--recommend a course--</option>
                        {courses ? courses.map((individual, index) => (
                        <option key={index} value={individual.title}>
                            {individual.title}
                        </option>
                        )) : null}
                    </select>
                </div>

                <div className="relative">
                <textarea required style={{height:"200px"}}
                    type="text"
                    id="description"
                    placeholder=" "
                    className="peer w-full border border-gray-300 rounded-md px-3 pt-6 pb-2 text-sm 
                            focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-gray-600"
                />
                <label
                    htmlFor="description"
                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                    peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-600"
                >
                    any special requests
                </label>
                </div>

                {/* Submit Button */}
                <input
                type="submit"
                value="Submit"
                className="w-full border border-violet-600 text-violet-600 bg-white py-2 rounded-md 
                            transition hover:bg-violet-600 hover:text-white"
                />
            </form>
        </div>
    </div>
  )
}
