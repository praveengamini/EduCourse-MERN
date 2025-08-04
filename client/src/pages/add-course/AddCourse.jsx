import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  VideoCameraIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PhotoIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const AddCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [cost, setCost] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const coverInputRef = useRef();
  const pdfInputRef = useRef();
  const videoInputRef = useRef();

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setCoverImage(files[0]);
      setCoverPreview(URL.createObjectURL(files[0]));
    }
  };

  const handleAddPdf = () => {
    pdfInputRef.current.click();
  };

  const handlePdfChange = (e) => {
    const selected = Array.from(e.target.files);
    setPdfs(prev => [...prev, ...selected]);
    e.target.value = null;
  };

  const handleRemovePdf = (index) => {
    setPdfs(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddVideo = () => {
    videoInputRef.current.click();
  };

  const handleVideoChange = async (e) => {
    const selectedVideos = Array.from(e.target.files);
    setUploadingVideos(true);

    const updatedVideoData = [...videoData];

    for (const video of selectedVideos) {
      const videoEntry = { name: video.name, isProcessing: true };
      updatedVideoData.push(videoEntry);
      setVideoData([...updatedVideoData]);

      const formData = new FormData();
      formData.append('file', video);
      formData.append('upload_preset', 'llm_upload'); // your unsigned preset

      try {
        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dqzvjsfws/video/upload',
          formData
        );

        const updatedEntry = {
          name: video.name,
          url: res.data.secure_url,
          duration: Math.floor(res.data.duration),
          public_id: res.data.public_id,
          isProcessing: false
        };

        const index = updatedVideoData.findIndex(v => v.name === video.name && v.isProcessing);
        updatedVideoData[index] = updatedEntry;
        setVideoData([...updatedVideoData]);

      } catch (err) {
        console.error("Video upload error:", err);
        toast.error(`Failed to upload ${video.name}`);
        updatedVideoData.pop(); // remove failed entry
        setVideoData([...updatedVideoData]);
      }
    }

    setUploadingVideos(false);
    videoInputRef.current.value = null;
    toast.success("Videos uploaded successfully!");
  };

  const handleRemoveVideo = (index) => {
    setVideoData(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !duration || !cost || videoData.length === 0) {
      toast.error("Please fill all required fields and upload videos.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('duration', duration);
    formData.append('cost', cost);
    if (coverImage) formData.append('coverImage', coverImage);
    pdfs.forEach(pdf => formData.append('pdfs', pdf));
    formData.append('videos', JSON.stringify(videoData.map(v => ({
      title: v.name,       
      url: v.url,           
      duration: v.duration    
    }))));



    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/admin/add-course`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Course added successfully!");

      // Reset form
      setTitle(''); setDescription(''); setDuration(''); setCost('');
      setCoverImage(null); setCoverPreview(null);
      setPdfs([]); setVideoData([]);
      if (coverInputRef.current) coverInputRef.current.value = null;
      if (pdfInputRef.current) pdfInputRef.current.value = null;
      if (videoInputRef.current) videoInputRef.current.value = null;

    } catch (err) {
      console.error(err);
      toast.error("Error adding course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
    </div>
  );

  const PulsingDots = () => (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
      <ToastContainer />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create New Course
          </h1>
          <p className="text-gray-600 text-lg">Build engaging learning experiences with multimedia content</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <VideoCameraIcon className="h-8 w-8 mr-3" />
              Course Details
            </h2>
          </div>

          <div onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Course Title
                </label>
                <input
                  type="text"
                  placeholder="Enter course title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Duration (In Weeks)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 4 weeks"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Course Description
              </label>
              <textarea
                placeholder="Describe what students will learn in this course..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Course Price (Rupees)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                required
              />
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <PhotoIcon className="h-5 w-5 mr-2 text-indigo-600" />
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Cover Image
              </label>
              
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={coverInputRef}
                  onChange={handleCoverChange}
                  className="hidden"
                  required
                />
                
                {coverPreview ? (
                  <div className="relative">
                    <img 
                      src={coverPreview} 
                      alt="Cover Preview" 
                      className="mx-auto max-h-64 rounded-lg shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImage(null);
                        setCoverPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="cursor-pointer" onClick={() => coverInputRef.current.click()}>
                    <CloudArrowUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drop your cover image here, or <span className="text-indigo-600">browse</span>
                    </p>
                    <p className="text-sm text-gray-500">Supports: JPG, PNG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* PDF Upload */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <DocumentIcon className="h-5 w-5 mr-2 text-blue-600" />
                Course Materials (PDF)
                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Optional</span>
              </label>
              
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleAddPdf}
                  className="flex items-center space-x-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Add PDF Materials</span>
                </button>
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  ref={pdfInputRef}
                  onChange={handlePdfChange}
                  className="hidden"
                />
              </div>

              {pdfs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pdfs.map((pdf, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <DocumentIcon className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {pdf.name.length > 25 ? `${pdf.name.slice(0, 25)}...` : pdf.name}
                          </p>
                          <p className="text-xs text-gray-500">{(pdf.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePdf(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <VideoCameraIcon className="h-5 w-5 mr-2 text-purple-600" />
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Course Videos
              </label>
              
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleAddVideo}
                  disabled={uploadingVideos}
                  className="flex items-center space-x-2 px-4 py-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors border border-purple-200 disabled:opacity-50"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Add Videos</span>
                </button>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  ref={videoInputRef}
                  onChange={handleVideoChange}
                  className="hidden"
                />
                {uploadingVideos && (
                  <div className="flex items-center space-x-2 text-purple-600">
                    <PulsingDots />
                    <span className="text-sm">Processing videos...</span>
                  </div>
                )}
              </div>

               {videoData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videoData.map((video, index) => (
            <div key={index} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {video.isProcessing ? (
                    <div className="w-20 h-14 bg-gray-200 rounded-lg flex items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <img 
                      src={`https://res.cloudinary.com/dqzvjsfws/video/upload/${video.public_id}.jpg`}
                      alt="Video thumbnail"
                      className="w-20 h-14 object-cover rounded-lg"
                    />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {video.name.length > 20 ? `${video.name.slice(0, 20)}...` : video.name}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {video.isProcessing ? (
                      <span className="text-xs text-orange-600 flex items-center">
                        <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                        Processing...
                      </span>
                    ) : (
                      <span className="text-xs text-green-600 flex items-center">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        {video.duration}s
                      </span>
                    )}
                  </div>
                </div>
                {!video.isProcessing ?
                <button
                  type="button"
                  onClick={() => handleRemoveVideo(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                  disabled = {video.isProcessing}
                >
                  <TrashIcon className="h-4 w-4" />
                </button> : <></>}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={uploadingVideos || isSubmitting}
                onClick={handleSubmit}
                className={`w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                  uploadingVideos || isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02]'
                } shadow-lg`}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner />
                    <span>Creating Course...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Create Course</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;