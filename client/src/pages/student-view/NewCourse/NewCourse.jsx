import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function NewCourse() {
    const [courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(false); 
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        async function getCourses() {
            try {
                const response = await axios.get(import.meta.env.VITE_SERVER_URL + "/api/admin/courses")
                setCourses(response.data.courses);
            } catch (error) {
                console.error("Error fetching courses:", error);
                toast.error("Failed to fetch courses.");
            }
        }
        getCourses();
    }, [])

    async function newCourseFormSubmitted(e){
        e.preventDefault();
        setLoading(true); 
        const data = {
            name: e.target.name.value,
            userID: user?.id || null,
            email: e.target.email.value,
            contactNumber: e.target.tel.value,
            courseName: e.target.courseName.value,
            description: e.target.description.value,
        };

        try {
            const response = await axios.post(import.meta.env.VITE_SERVER_URL + "/api/student/sendEmail", data);
            if (response.data.messageSent) {
                toast.success("email send successfully");
                // Clear the form fields after successful submission
                e.target.reset();
            } else {
                toast.error("Error occured in sending mail");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-gray-100 p-4 overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="absolute inset-0 z-0 bg-repeat opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-800 rounded-full blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-800 rounded-full blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
                @keyframes blob {
                    0% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite ease-in-out;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .glow-border {
                    position: relative;
                    padding: 3px;
                }
                .glow-border:before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 12px;
                    padding: 3px;
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(255, 255, 255, 0) 50%, rgba(139, 92, 246, 0.5) 100%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    animation: spin 5s linear infinite;
                    pointer-events: none;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                `}
            </style>
            <div className="relative z-10 w-full max-w-lg">
                <div className="text-center font-bold text-violet-400 text-2xl mb-2">
                    Submit form to request course access
                </div>
                <div className="w-24 h-1 bg-violet-600 mx-auto mb-6 rounded-full"></div>
                <div className='text-red-400 mb-3 text-sm text-center'>
                    * Please ensure the name entered below is accurate and correctly formatted, as it will appear on your official course completion certificate.
                </div>
    
                <div className='w-full bg-zinc-950 p-8 rounded-xl shadow-lg border border-zinc-800 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/50 relative overflow-hidden'>
                    <form onSubmit={newCourseFormSubmitted} className="space-y-6">
                        <div className="relative">
                            <input required
                                type="text"
                                id="name"
                                placeholder=" "
                                className="peer w-full border border-zinc-700 rounded-md px-3 pt-6 pb-2 text-sm bg-zinc-900 text-white
                                    focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-950"
                            />
                            <label
                                htmlFor="name"
                                className="absolute left-3 top-2 text-gray-400 text-sm transition-all
                                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                                    peer-focus:top-2 peer-focus:text-sm peer-focus:text-violet-400"
                            >
                                Enter name (name will be displayed in the certificate)
                            </label>
                        </div>
            
                        <div className="relative">
                            <input 
                                type="email"
                                id="email"
                                defaultValue={user?.email || ""}
                                readOnly={!!user}
                                placeholder=" "
                                className="peer w-full border border-zinc-700 rounded-md px-3 pt-6 pb-2 text-sm bg-zinc-900 text-white
                                    focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-950"
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-3 top-2 text-gray-400 text-sm transition-all
                                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                                    peer-focus:top-2 peer-focus:text-sm peer-focus:text-violet-400"
                            >
                                Enter mail
                            </label>
                        </div>
            
                        <div className="relative">
                            <input required
                                type="tel"
                                id="tel"
                                placeholder=" "
                                className="peer w-full border border-zinc-700 rounded-md px-3 pt-6 pb-2 text-sm bg-zinc-900 text-white
                                    focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-950"
                            />
                            <label
                                htmlFor="tel"
                                className="absolute left-3 top-2 text-gray-400 text-sm transition-all
                                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                                    peer-focus:top-2 peer-focus:text-sm peer-focus:text-violet-400"
                            >
                                Enter contact number
                            </label>
                        </div>
            
                        <div className="relative">
                            <label htmlFor="courseName" className="block mb-1 text-sm text-gray-300">
                                Select Course
                            </label>
                            <select
                                id="courseName"
                                name="courseName"
                                className="w-full border border-zinc-700 rounded-md px-3 py-2 text-sm bg-zinc-900 text-white
                                    focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                                required
                            >
                                <option value="course suggestion opted" className="bg-zinc-900 text-white">-- Suggest a Course --</option>
                                {courses ? courses.map((individual, index) => (
                                    <option key={index} value={individual.title} className="bg-zinc-900 text-white">
                                        {individual.title}
                                    </option>
                                )) : null}
                            </select>
                        </div>
            
                        <div className="relative">
                            <textarea  style={{ height: "200px" }}
                                type="text"
                                id="description"
                                placeholder=" "
                                className="peer w-full border border-zinc-700 rounded-md px-3 pt-6 pb-2 text-sm bg-zinc-900 text-white
                                    focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-950"
                            />
                            <label
                                htmlFor="description"
                                className="absolute left-3 top-2 text-gray-400 text-sm transition-all
                                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                                    peer-focus:top-2 peer-focus:text-sm peer-focus:text-violet-400"
                            >
                                any special requests
                            </label>
                        </div>
                        <input
                            type="submit"
                            value={loading ? "Submitting..." : "Submit"}
                            disabled={loading}
                            className={`w-full border border-violet-600 text-white bg-violet-600 py-3 rounded-md 
                                    transition-all duration-300 hover:bg-violet-700 hover:text-white cursor-pointer hover:scale-105 hover:shadow-lg
                                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}