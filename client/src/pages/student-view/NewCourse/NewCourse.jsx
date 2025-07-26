import React from 'react'

export default function NewCourse() {
    function newCourseFormSubmitted(event){
        event.preventDefault();
    }
  return (
    <div className="p-4 flex flex-col items-center">
      <div className=" text-center font-bold text-violet-600 text-2xl mb-6">
        Submit form to request course access
      </div>
        <div className='items-center lg:w-5xl w-full'>
            <form onSubmit={newCourseFormSubmitted} className="space-y-6" action="">
                {/* Name */}
                <div className="relative">
                <input
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
                <input
                    type="email"
                    id="email"
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
                <input
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
                <input
                    type="text"
                    id="courseName"
                    placeholder=" "
                    className="peer w-full border border-gray-300 rounded-md px-3 pt-6 pb-2 text-sm 
                            focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-gray-600"
                />
                <label
                    htmlFor="courseName"
                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                    peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-600"
                >
                    Enter course name
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
