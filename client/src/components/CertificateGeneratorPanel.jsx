import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CertificateGenerator from './CertificateGenerator';

const CertificateGeneratorPanel = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const certificateRef = useRef(null);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/generator/students');
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/generator/courses');
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleGeneratePreview = () => {
    if (!selectedStudent || !selectedCourse) {
      setMessage('Please select both student and course');
      setMessageType('error');
      return;
    }
    setShowPreview(true);
    setMessage('');
  };

  const handleGenerateAndStore = async () => {
    if (!selectedStudent || !selectedCourse) {
      setMessage('Please select both student and course');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Get the canvas data URL from the certificate generator
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        throw new Error('Certificate preview not generated');
      }
      
      const imageDataUrl = canvas.toDataURL('image/png');

      const response = await axios.post('http://localhost:5000/api/generator/generate-certificate', {
        studentId: selectedStudent,
        courseId: selectedCourse,
        imageDataUrl: imageDataUrl
      });

      setMessage(`Certificate generated successfully! Certificate Number: ${response.data.certificate.certificateNumber}`);
      setMessageType('success');
      setShowPreview(false);
      setSelectedStudent('');
      setSelectedCourse('');
    } catch (error) {
      console.error('Certificate generation error:', error);
      setMessage(error.response?.data?.message || 'Error generating certificate');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const selectedStudentData = students.find(s => s._id === selectedStudent);
  const selectedCourseData = courses.find(c => c._id === selectedCourse);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Certificate Generator</h1>
          <p className="text-lg text-gray-600">Generate and store certificates for students</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="">Choose a student...</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.userName} ({student.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="">Choose a course...</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={handleGeneratePreview}
              disabled={!selectedStudent || !selectedCourse}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              Generate Preview
            </button>

            {showPreview && (
              <button
                onClick={handleGenerateAndStore}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                {loading ? 'Generating & Storing...' : 'Generate & Store Certificate'}
              </button>
            )}
          </div>

          {message && (
            <div className={`rounded-lg p-4 mb-6 ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {messageType === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm">{message}</p>
                </div>
              </div>
            </div>
          )}

          {showPreview && selectedStudentData && selectedCourseData && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Certificate Preview</h3>
              <CertificateGenerator 
                ref={certificateRef}
                username={selectedStudentData.userName}
                courseName={selectedCourseData.title}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateGeneratorPanel;