import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, GraduationCap, Clock, DollarSign, ArrowLeft, X, Loader2, FileText, Lock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { generateCertificateCanvas } from "../../../utils/certificateUtils";

const CourseDisplay = () => {
    const videoRef = useRef(null);
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedPDF, setSelectedPDF] = useState(null);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
    const [courseToStudentExists, setCourseToStudentExists] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const [completedVideos, setCompletedVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (course?.videos && completedVideos.length === course.videos.length && course.videos.length > 0) {
            toast.success("Certificate unlocked! You can now download it.");
        }
    }, [completedVideos, course]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/course/${courseId}`);
                setCourse(courseRes.data.course);

                const enrollmentRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/student/courseToStudent`, {
                    params: { courseId: courseId, userId: user.id }
                });
                setCourseToStudentExists(enrollmentRes.data.courseToStudentExists);

                const completedRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/student/progress/completed`, {
                    params: { userId: user.id, courseId }
                });
                setCompletedVideos(completedRes.data.completedVideoIds);
            } catch (err) {
                console.error("Error fetching data:", err);
                toast.error("Failed to load course data.");
            }
        };
        fetchData();
    }, [courseId, user]);

    useEffect(() => {
        const video = videoRef.current;

        const handleTimeUpdate = async () => {
            if (!selectedVideo || !user) return;
            const watched = Math.floor(video.currentTime);
            const total = Math.floor(video.duration);
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/student/progress`, {
                userId: user.id,
                courseId,
                videoId: selectedVideo._id,
                watchedDuration: watched,
                totalDuration: total
            });
        };

        const handleEnded = async () => {
            if (!selectedVideo || !user) return;
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/student/complete`, {
                userId: user.id,
                courseId,
                videoId: selectedVideo._id
            });

            setCompletedVideos((prev) => {
                if (!prev.includes(selectedVideo._id)) {
                    return [...prev, selectedVideo._id];
                }
                return prev;
            });
        };

        if (video) {
            video.addEventListener('timeupdate', handleTimeUpdate);
            video.addEventListener('ended', handleEnded);
        }

        return () => {
            if (video) {
                video.removeEventListener('timeupdate', handleTimeUpdate);
                video.removeEventListener('ended', handleEnded);
            }
        };
    }, [selectedVideo, courseId, user]);

    useEffect(() => {
        const fetchProgress = async () => {
            if (!selectedVideo || !user) return;
            try {
                const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/student/progress`, {
                    params: {
                        userId: user.id,
                        courseId,
                        videoId: selectedVideo._id
                    }
                });
                const lastTime = res.data?.watchedDuration || 0;
                if (videoRef.current) {
                    videoRef.current.currentTime = lastTime;
                }
            } catch (error) {
                console.error("Error fetching video progress:", error);
            }
        };

        if (selectedVideo) fetchProgress();
    }, [selectedVideo, courseId, user]);

    const openVideoModal = (video) => {
        setSelectedVideo(video);
        setIsVideoModalOpen(true);
    };

    const closeVideoModal = () => {
        setIsVideoModalOpen(false);
        setSelectedVideo(null);
    };

    const openPDFModal = (pdf) => {
        setSelectedPDF(pdf);
        setIsPDFModalOpen(true);
    };

    const closePDFModal = () => {
        setIsPDFModalOpen(false);
        setSelectedPDF(null);
    };

    const formatDuration = (seconds) => {
        if (isNaN(seconds)) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getVideoThumbnail = (videoUrl) => {
        if (videoUrl && videoUrl.includes('cloudinary.com')) {
            try {
                const urlParts = videoUrl.match(/https:\/\/res\.cloudinary\.com\/([^\/]+)\/video\/upload\/(?:v\d+\/)?(.+)\.(mp4|mov|avi|mkv|webm)/);
                if (urlParts) {
                    const cloudName = urlParts[1];
                    const publicId = urlParts[2];
                    return `https://res.cloudinary.com/${cloudName}/video/upload/so_2.0,w_320,h_180,c_fill/${publicId}.jpg`;
                }
            } catch (error) {
                console.error("Error generating thumbnail:", error);
            }
        }
        return `https://placehold.co/320x180/1a1a1a/ffffff?text=Video`;
    };

    const handleCertificateDownload = async () => {
        const username = user?.userName;
        const courseName = course?.title;
        const imageSrc = "/certificate.png";
        if (!username || !courseName) {
            toast.error("Missing user or course info!");
            return;
        }
        setLoading(true);
        try {
            const imageDataUrl = await generateCertificateCanvas({ username, courseName, imageSrc });
            const link = document.createElement("a");
            link.download = `${username}_certificate.png`;
            link.href = imageDataUrl;
            link.click();
            toast.success("🎉 Certificate downloaded successfully!");
        } catch (error) {
            console.error("Error generating certificate:", error);
            toast.error("❌ Failed to generate certificate. Try again.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleEnrollment = () => {
        if (course) {
            toast.info("enroll course here");
            navigate("/student/new-course")
        }
    };

    const getRandomRating = () => {
        const rating = (Math.random() * (4.8 - 4.0) + 4.0).toFixed(1);
        const count = (Math.floor(Math.random() * (10000 - 5000) + 5000)).toLocaleString();
        return `${rating} (${count})`;
    };

    if (!course) {
        return (
            <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-600"></div>
                    <p className="mt-4 text-lg text-gray-400 font-medium">Loading course details...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden" style={{ fontFamily: "Bai Jamjuree, sans-serif" }}>
            
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-800 rounded-full blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-800 rounded-full blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@400;500;600;700&display=swap');
                @keyframes blob {
                    0% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0, 0) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite ease-in-out; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                
                /* This is the missing CSS to hide the scrollbar */
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                `}
            </style>
            <div className="relative z-10">
                {courseToStudentExists ? (
                    <div className="mt-20 container mx-auto px-4 py-15 max-w-6xl">
                         <div className="flex items-center justify-between mb-8">
                            <h1 className="flex-1 text-3xl md:text-4xl font-bold text-violet-400 break-words">{course.title.toUpperCase()}</h1>
                            <button
                                onClick={() => navigate(-1)}
                                className="group flex items-center text-gray-400 hover:text-violet-400 transition-colors px-4 py-2 rounded-full"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Back to Courses</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-xl flex flex-col items-start space-y-2">
                                <h3 className="text-2xl font-bold text-violet-400">{course.videos?.length || 0}</h3>
                                <p className="text-sm text-gray-400">Videos</p>
                            </div>
                            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-xl flex flex-col items-start space-y-2">
                                <h3 className="text-2xl font-bold text-violet-400">{course.pdfs?.length || 0}</h3>
                                <p className="text-sm text-gray-400">PDFs</p>
                            </div>
                            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-xl flex flex-col items-start space-y-2">
                                <h3 className="text-2xl font-bold text-violet-400">{course.duration}</h3>
                                <p className="text-sm text-gray-400">Duration</p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="bg-zinc-950 p-6 rounded-xl shadow-lg border border-zinc-800">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white">Course Content</h2>
                                    <div className="text-gray-400 text-sm">
                                        {completedVideos.length} / {course.videos?.length || 0} completed
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {course.videos && course.videos.length > 0 ? (
                                        course.videos.map((video, index) => (
                                            <div
                                                key={video._id}
                                                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-800 transition-colors"
                                                onClick={() => openVideoModal(video)}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden">
                                                        <img 
                                                            src={getVideoThumbnail(video.url)} 
                                                            alt={`Thumbnail for ${video.title}`}
                                                            className="w-full h-full object-cover" 
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors">
                                                            <PlayCircle className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-white font-semibold">{video.title}</p>
                                                        <p className="text-sm text-gray-400">{formatDuration(video.duration)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    {completedVideos.includes(video._id) && (
                                                        <span className="text-green-400 text-sm font-medium">Completed</span>
                                                    )}
                                                    <button
                                                        className="px-4 py-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors"
                                                    >
                                                        Play
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-400 py-8">
                                            <p>No video lectures available yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>              
                            <div className="flex flex-col gap-8">
                                <div className="bg-zinc-950 p-6 rounded-xl shadow-lg border border-zinc-800">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-white">Study Materials</h2>
                                        <div className="text-gray-400 text-sm">
                                            {course.pdfs?.length || 0} files
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {course.pdfs && course.pdfs.length > 0 ? (
                                            course.pdfs.map((pdf, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-800 transition-colors"
                                                    onClick={() => openPDFModal(pdf)}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 flex-shrink-0 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                                                            <FileText className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-white font-semibold">{`Study Material ${index + 1}`}</p>
                                                            <p className="text-sm text-gray-400">PDF Document</p>
                                                        </div>
                                                    </div>
                                                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors">
                                                        View
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-400 py-8">
                                                <p>No study materials available yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-zinc-950 p-6 rounded-xl shadow-lg border border-zinc-800 text-center">
                                    <h3 className="text-2xl font-bold text-violet-400 mb-4">Your Certificate</h3>
                                    {completedVideos.length === course.videos.length && course.videos.length > 0 ? (
                                        <button
                                            onClick={handleCertificateDownload}
                                            disabled={loading}
                                            className={`px-6 py-3 rounded-xl flex items-center justify-center gap-2 mx-auto bg-violet-600 text-white hover:bg-violet-700 transition ${
                                                loading ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="animate-spin w-5 h-5" />
                                                    Generating...
                                                </>
                                            ) : (
                                                "Download Certificate"
                                            )}
                                        </button>
                                    ) : (
                                        <div className=" text-yellow-400 font-medium bg-yellow-900/40 border border-yellow-800 px-5 py-3 rounded-lg inline-block">
                                            Complete all videos to unlock your certificate.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-20 relative w-full overflow-hidden">
                        <div className="w-full bg-zinc-950/70 backdrop-blur-md overflow-hidden">
                            <div className="relative min-h-[450px] py-12 flex items-center">
                                <div className="container mx-auto px-8 max-w-6xl grid md:grid-cols-2 gap-12 items-start">
                                    <div className="flex-1 space-y-6 text-center md:text-left">
                                        <div className="flex items-center justify-center md:justify-start">
                                            <button
                                                onClick={() => navigate(-1)}
                                                className="group flex items-center text-gray-400 hover:text-violet-400 transition-colors px-4 py-2 rounded-full"
                                            >
                                                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                                <span className="font-medium">Back to Courses</span>
                                            </button>
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg break-words">
                                            <span className="text-violet-400">{course.title.toUpperCase()}</span>
                                        </h1>
                                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 h-52 break-words hide-scrollbar overflow-y-scroll">
                                            {course.description}
                                        </p>
                                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4 text-violet-400" />
                                                <span>{course.videos?.length || 0} Course series</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-violet-400" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">★</span>
                                                <span>{getRandomRating()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                                                <span>Beginner</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full relative bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg overflow-hidden flex-shrink-0 max-w-sm mx-auto md:mx-0">
                                        <div className="relative aspect-video">
                                            <img src={course.coverImage} alt="Course Preview" className="w-full h-full object-cover"/>
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <button onClick={() => openVideoModal(course.videos[0])} className="p-4 bg-white/20 rounded-full backdrop-blur-sm text-white hover:bg-white/40 transition-colors">
                                                    <PlayCircle className="w-12 h-12" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6 text-center">
                                            <h3 className="text-xl font-bold text-white mb-4">Preview the course</h3>
                                            <button
                                                onClick={handleEnrollment}
                                                className="w-full py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors"
                                            >
                                                Enroll to Course
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container mx-auto px-8 py-16 max-w-6xl">
                            <div className="grid lg:grid-cols-2 gap-12">
                               
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isVideoModalOpen && selectedVideo && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                            <h3 className="text-lg font-semibold text-gray-100 break-words">{selectedVideo.title}</h3>
                            <button onClick={closeVideoModal} className="text-gray-400 hover:text-white p-1">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                                <video
                                    ref={videoRef}
                                    controls
                                    controlsList="nodownload"
                                    onContextMenu={(e) => e.preventDefault()}
                                    className="w-full h-full"
                                    src={selectedVideo.url}
                                    poster={getVideoThumbnail(selectedVideo.url)}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {isPDFModalOpen && selectedPDF && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                            <h3 className="text-lg font-semibold text-gray-100">{'Study Material'}</h3>
                            <button onClick={closePDFModal} className="text-gray-400 hover:text-white p-1">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="h-[calc(90vh-80px)]">
                            <iframe
                                src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(selectedPDF)}`}
                                className="w-full h-full"
                                title="PDF Viewer"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDisplay;