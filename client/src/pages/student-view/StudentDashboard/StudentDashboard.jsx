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
  User,
  LogOut,
  Video
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import CourseCarousel from '@/components/student-view/CourseCarousel ';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('myCourses');
  const [stats, setStats] = useState({});
  const [myCourses, setMyCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [profile, setProfile] = useState({});

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
      } catch (error) {
        console.error('Download failed', error);
      }
    };



  useEffect(() => {
    if (user?.id) {
      axios
        .get(`${import.meta.env.VITE_SERVER_URL}/api/dashboard/${user.id}`)
        .then((res) => {
          const { stats, enrolledCourses, allCourses, certificates, profile } = res.data;
          setStats(stats);
          setMyCourses(enrolledCourses);
          setAllCourses(allCourses);
          setCertificates(certificates);
          setProfile(profile);
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  const renderCourses = (courses) => {
    if (!courses.length) {
      return (
        <div className="flex flex-col items-center justify-center py-16 space-y-8">
          <div className="text-center text-gray-400 mb-8">
            <p className="text-lg">
              No courses enrolled yet. Start exploring and enroll in your first course!
            </p>
          </div>

          <div className="w-full max-w-4xl bg-gray-800/50 rounded-2xl border border-gray-700 p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <GraduationCap size={32} className="text-white" />
                    <BookOpen size={28} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Take Advance Courses to Achieve Your Goal!
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                </p>
                <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                    onClick={navigate('/student/home')}>
                  Start Now!
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return(
       <CourseCarousel courses={courses} />
    );
  };

  const renderCertificates = () => {
    if (!certificates.length) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center text-gray-400">
            <Award size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">
              No certificates earned yet. Complete courses to earn certificates!
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
            className="bg-gray-800/60 border border-white/20 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 flex flex-col"
          >
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-3">
              <Award size={24} className="text-white" />
            </div>

            <div className="mb-3 flex-1">
              <h4 className="text-lg font-bold text-white mb-1">
                {cert.courseId?.title}
              </h4>
              <p className="text-gray-400 text-xs mb-1">
                Certificate #{cert.certificateNumber}
              </p>
              <p className="text-gray-400 text-xs">
                Earned on{' '}
                {new Date(cert.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={cert.certificateUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <ExternalLink size={16} />
                <span>View Certificate</span>
              </a>
              <button
                onClick={() => handleDownload(cert.certificateUrl,`certificate-${cert.certificateNumber}.png`)}
                className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCertificateValidator = () => {
    return (
      <div className="max-w-2xl mx-auto bg-gray-800/60 border border-white/20 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Certificate Validator</h2>
          <p className="text-gray-400">
            Enter certificate ID or URL to verify authenticity.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Certificate ID or URL"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none"
          />
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200">
            Validate
          </button>
        </div>
        {/* Placeholder result area */}
        <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700 text-sm text-gray-300">
          Enter a certificate to begin validation.
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black px-10 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.userName || 'Username'} !
          </h1>
          <p className="text-gray-400">Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-500 mb-1">
                  {String(stats.enrolled || 0).padStart(2, '0')}
                </div>
                <div className="text-white font-medium">Enrolled</div>
                <div className="text-white font-medium">Courses</div>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <BookOpen size={24} className="text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-500 mb-1">
                  {String(stats.completed || 0).padStart(2, '0')}
                </div>
                <div className="text-white font-medium">Completed</div>
                <div className="text-white font-medium">Courses</div>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <CheckCircle size={24} className="text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-500 mb-1">
                  {String(stats.time || 0).padStart(2, '0')}
                </div>
                <div className="text-white font-medium">Learning</div>
                <div className="text-white font-medium">Time</div>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <Clock size={24} className="text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-500 mb-1">
                  {String(stats.certificates || 0).padStart(2, '0')}
                </div>
                <div className="text-white font-medium">Certificates</div>
                <div className="text-white font-medium">Earned</div>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <Award size={24} className="text-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'myCourses'
                ? 'bg-white text-gray-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50 cursor-pointer'
            }`}
            onClick={() => setActiveTab('myCourses')}
          >
            My Courses
          </button>
          {/* <button
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'allCourses'
                ? 'bg-white text-gray-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50 cursor-pointer'
            }`}
            onClick={() => setActiveTab('allCourses')}
          >
            All Courses
          </button> */}
          <button
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'certifications'
                ? 'bg-white text-gray-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50 cursor-pointer'
            }`}
            onClick={() => setActiveTab('certifications')}
          >
            Certifications
          </button>
          {/* <button
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'certificateValidator'
                ? 'bg-white text-gray-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50 cursor-pointer'
            }`}
            onClick={() => navigate("/student/validator")}
          >
            Certificate Validator
          </button> */}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'myCourses' && renderCourses(myCourses)}
          {activeTab === 'allCourses' && renderCourses(allCourses)}
          {activeTab === 'certifications' && renderCertificates()}
          {activeTab === 'certificateValidator' && renderCertificateValidator()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
