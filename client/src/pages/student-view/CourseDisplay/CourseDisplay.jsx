import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon, PlayIcon, DocumentIcon, ClockIcon, CurrencyRupeeIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { generateCertificateCanvas } from "../../../utils/certificateUtils";
import { Loader2 } from "lucide-react";

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
    
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/course/${courseId}`);
        setCourse(res.data.course);
      } catch (err) {
        console.error("Error fetching course:", err);
      }
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/student/courseToStudent`, {
        params: { courseId: courseId, userId: user.id }
      });
      setCourseToStudentExists(response.data.courseToStudentExists);
    };
    fetchCourse();
    const fetchCompleted = async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/student/progress/completed`, {
      params: { userId: user.id, courseId }
    });
    setCompletedVideos(res.data.completedVideoIds);
  };

  fetchCompleted();
  }, [courseId]);

  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = async () => {
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
  }, [selectedVideo]);

  useEffect(() => {
    const fetchProgress = async () => {
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
    };

    if (selectedVideo) fetchProgress();
  }, [selectedVideo]);

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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getVideoThumbnail = (videoUrl) => {
    if (videoUrl && videoUrl.includes('cloudinary.com')) {
      try {
        const urlParts = videoUrl.match(/https:\/\/res\.cloudinary\.com\/([^\/]+)\/video\/upload\/(?:v\d+\/)?(.+)\.(mp4|mov|avi|mkv|webm)/);
        if (urlParts) {
          const cloudName = urlParts[1];
          const publicId = urlParts[2];
          const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/video/upload/so_2.0,w_320,h_180,c_fill/${publicId}.jpg`;
          return thumbnailUrl;
        }
      } catch (error) {
        console.error("Error generating thumbnail:", error);
      }
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

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


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-indigo-600 hover:text-indigo-800 mb-8 transition-all duration-200 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Courses</span>
        </button>

        {/* Main Course Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Hero Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 z-10"></div>
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-full h-80 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-black/20 z-20"></div>
            
            {/* Course Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-30 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {course.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-white/90">
                <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  <CurrencyRupeeIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">₹{course.cost}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                Course Description
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg bg-gray-50/70 p-4 rounded-xl border-l-4 border-indigo-200">
                {course.description}
              </p>
            </div>
            {courseToStudentExists && (
                <div className="my-3 text-center">
                  {completedVideos.length === course.videos.length ? (
                 <button
                    onClick={handleCertificateDownload}
                    disabled={loading}
                    className={`px-6 py-3 rounded-xl flex items-center justify-center gap-2 bg-violet-600 text-white hover:bg-violet-700 transition ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        Generating...
                      </>
                    ) : (
                      "Get Certificate"
                    )}
                </button>


                  ) : (
                    <p className="text-yellow-700 font-medium bg-yellow-100 border border-yellow-300 px-5 py-3 rounded-lg inline-block">
                      Complete all videos to unlock your certificate.
                    </p>
                  )}
                </div>
              )}

            {/* Course Materials Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Videos Section */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <PlayIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Video Lectures</h2>
                  {courseToStudentExists && (
                    <p className="text-sm text-gray-500 ml-3">
                      {completedVideos.length} / {course.videos.length} videos completed
                    </p>
                  )}

                  {course.videos && course.videos.length > 0 && (
                    <span className="ml-auto bg-indigo-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {course.videos.length} videos
                    </span>
                  )}
                </div>
                
                {course.videos && course.videos.length > 0 ? (
                  <div className="space-y-4">
                    {(courseToStudentExists ? course.videos : course.videos.slice(0, 1)).map((video, index) => (
                      <div 
                        key={index} 
                        className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-white/50 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group"
                        onClick={() => openVideoModal(video)}
                      >
                        <div className="flex">
                          {/* Video Thumbnail */}
                          <div className="relative w-32 h-20 flex-shrink-0">
                            <img
                              src={getVideoThumbnail(video.url)}
                              alt={video.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/320x180/4f46e5/ffffff?text=Video';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <PlayIcon className="h-6 w-6 text-white drop-shadow-lg" />
                            </div>
                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                              {formatDuration(video.duration)}
                            </div>
                          </div>
                          
                          {/* Video Info */}
                          <div className="flex-1 p-3 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-800 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                                {video.title}
                              </h3>
                              {completedVideos.includes(video._id) && (
                                <span className="ml-2 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                  Completed
                                </span>
                              )}
                            </div>

                            <div className="flex items-center text-gray-500 text-xs mt-1">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              <span>{formatDuration(video.duration)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!courseToStudentExists && course.videos.length > 1 && (
                    <p className="text-sm text-red-500 mt-4 text-center font-medium">
                      Subscribe to access all videos in this course.
                    </p>
)}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PlayIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No video lectures available yet</p>
                  </div>
                )}
              </div>

              {/* PDFs Section */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                    <DocumentIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Study Materials</h2>
                  {course.pdfs && course.pdfs.length > 0 && (
                    <span className="ml-auto bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {course.pdfs.length} files
                    </span>
                  )}
                </div>
                
                {course.pdfs && course.pdfs.length > 0 ? (
                  <div className="space-y-3">
                    {(courseToStudentExists ? course.pdfs : course.pdfs.slice(0, 1)).map((pdf, index) => (
                      <div 
                        key={index} 
                        className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white/50 hover:shadow-md hover:bg-white/90 transition-all duration-200 cursor-pointer group"
                        onClick={() => openPDFModal(pdf)}
                      >
                        <div className="flex items-center">
                          <div className="bg-emerald-500 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-emerald-600 transition-colors duration-200">
                            <DocumentIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-700 font-medium group-hover:text-emerald-600 transition-colors duration-200">
                              {`Study Material ${index + 1}`}
                            </span>
                            <p className="text-gray-500 text-sm">PDF Document</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!courseToStudentExists && course.pdfs.length > 1 && (
                    <p className="text-sm text-red-500 mt-4 text-center font-medium">
                      Subscribe to access all study materials.
                    </p>
)}

                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DocumentIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No study materials available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">{selectedVideo.title}</h3>
              <button
                onClick={closeVideoModal}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <XMarkIcon className="h-6 w-6" />
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
              <div className="mt-3 flex items-center text-gray-600 text-sm">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>Duration: {formatDuration(selectedVideo.duration)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {isPDFModalOpen && selectedPDF && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {'Study Material'}
              </h3>
              <button
                onClick={closePDFModal}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <XMarkIcon className="h-6 w-6" />
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