import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  Download,
  ExternalLink,
  GraduationCap,
  Video
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import CourseCarousel from '@/components/student-view/CourseCarousel ';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('myCourses');
  const [stats, setStats] = useState({});
  const [myCourses, setMyCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  
  const [profile, setProfile] = useState({});

  /**

   * @param {string} url The URL of the file to download.
   * @param {string} fileName The desired name for the downloaded file.
   */
  const handleDownload = async (url, fileName = 'certificate.png') => {
    try {
      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Download started successfully!");
    } catch (error) {
      console.error('Download failed', error);
      toast.error("Failed to download the file.");
    }
  };

  useEffect(() => {
    console.log(user);
    
    if (user?.id) {
      axios
        .get(`${import.meta.env.VITE_SERVER_URL}/api/dashboard/${user.id}`)
        .then((res) => {
          const { stats, enrolledCourses, certificates, profile } = res.data;
          setStats(stats);
          setMyCourses(enrolledCourses);
          setCertificates(certificates);
          setProfile(profile);
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  /**
   * @param {Array} courses The list of courses to render.
   */
  const renderCourses = (courses) => {
    if (!courses.length) {
      return (
        <div className="flex flex-col items-center justify-center py-16 space-y-8">
          <div className="text-center text-gray-400 mb-8">
            <p className="text-lg font-semibold">
              No courses enrolled yet. Start exploring and enroll in your first course!
            </p>
          </div>
          <div className="w-full max-w-4xl bg-zinc-950/70 rounded-2xl border border-zinc-800 p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-violet-600 to-blue-500 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl">
                  <div className="relative flex items-center justify-center space-x-2">
                    <GraduationCap size={48} className="text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl font-bold text-violet-400 mb-3 drop-shadow-md">
                  Take Your First Step
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Unlock a world of knowledge and skill. Dive into our extensive course catalog to find your passion.
                </p>
                <button 
                  onClick={() => navigate('/student/home')}
                  className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white px-8 py-3 rounded-full font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-violet-500/25 transform hover:scale-105">
                  Explore All Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <CourseCarousel courses={courses} />;
  };

  /**
   * Renders the user's earned certificates or a message if none exist.
   */
  const renderCertificates = () => {
    if (!certificates.length) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center text-gray-400">
            <Award size={64} className="mx-auto mb-4 opacity-50 text-purple-400" />
            <p className="text-lg font-medium">
              No certificates earned yet. Complete courses to earn a certificate!
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert._id}
            className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 flex flex-col"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl mb-4 shadow-xl">
              <Award size={32} className="text-white" />
            </div>
            <div className="mb-4 flex-1">
              <p className="text-purple-700 text-lg font-bold mb-1">
                {cert.courseTitle}
              </p>
              <p className="text-gray-400 text-sm mb-1">
                Certificate #{cert.certificateNumber}
              </p>
              <p className="text-gray-400 text-sm">
                Earned on{' '}
                {new Date(cert.issuedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-auto">
              <a
                href={cert.certificateUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white py-3 px-4 rounded-full font-semibold transition-colors duration-200"
              >
                <ExternalLink size={18} />
                <span>View Certificate</span>
              </a>
              <button
                onClick={() => handleDownload(cert.certificateUrl, `certificate-${cert.certificateNumber}.png`)}
                className="flex items-center justify-center space-x-2 bg-zinc-700 hover:bg-zinc-600 text-white py-3 px-4 rounded-full font-semibold transition-colors duration-200"
              >
                <Download size={18} />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden" style={{ fontFamily: "Bai Jamjuree, sans-serif" }}>
      {/* Animated blob background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-800 rounded-full blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-800 rounded-full blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      {/* Style for the blob animation */}
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
        `}
      </style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Welcome back, <span className="text-violet-400">{user?.userName || 'Username'}</span>!
          </h1>
          <p className="text-gray-400 text-lg">Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-violet-400 mb-1">{String(stats.enrolled || 0).padStart(2, '0')}</div>
                <div className="text-gray-300 font-medium">Courses Enrolled</div>
              </div>
              <div className="w-14 h-14 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen size={28} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-1">{String(stats.completed || 0).padStart(2, '0')}</div>
                <div className="text-gray-300 font-medium">Courses Completed</div>
              </div>
              <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle size={28} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-cyan-400 mb-1">{stats.time || '0h'}</div>
                <div className="text-gray-300 font-medium">Learning Time</div>
              </div>
              <div className="w-14 h-14 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock size={28} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-yellow-400 mb-1">{String(stats.certificates || 0).padStart(2, '0')}</div>
                <div className="text-gray-300 font-medium">Certificates Earned</div>
              </div>
              <div className="w-14 h-14 bg-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <Award size={28} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center sm:justify-start">
          <button
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer ${
              activeTab === 'myCourses'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-zinc-800/50'
            }`}
            onClick={() => setActiveTab('myCourses')}
          >
            <BookOpen size={20} />
            My Courses
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer ${
              activeTab === 'certifications'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-zinc-800/50'
            }`}
            onClick={() => setActiveTab('certifications')}
          >
            <Award size={20} />
            Certifications
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'myCourses' && renderCourses(myCourses)}
          {activeTab === 'certifications' && renderCertificates()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
