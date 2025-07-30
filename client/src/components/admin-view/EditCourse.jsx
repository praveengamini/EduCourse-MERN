import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  XMarkIcon, 
  PlusIcon, 
  TrashIcon, 
  DocumentIcon, 
  VideoCameraIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditCourseModal = ({ course, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    cost: 0,
    videos: []
  });
  
  // Separate states for files
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [pdfFiles, setPdfFiles] = useState([]);
  
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const videoInputRef = useRef();
  const pdfInputRef = useRef();

  // Initialize form data when course changes
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        duration: course.duration || '',
        cost: course.cost || 0,
        videos: course.videos || []
      });
      
      // Set existing cover image preview
      setCoverImagePreview(course.coverImage || '');
      setCoverImageFile(null);
      
      // Reset PDF files (will show existing PDFs from course data)
      setPdfFiles([]);
    }
  }, [course]);

  // Loading Components
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

  // Handle drag events for cover image
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop event for cover image
  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (files[0].type.startsWith('image/')) {
        setCoverImageFile(files[0]);
        setCoverImagePreview(URL.createObjectURL(files[0]));
      } else {
        toast.error('Please select only image files');
      }
    }
  }, []);

  // Handle file input change for cover image
  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setCoverImageFile(file);
        setCoverImagePreview(URL.createObjectURL(file));
      } else {
        toast.error('Please select only image files');
      }
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  // Add PDF handler
  const handleAddPdf = () => {
    pdfInputRef.current.click();
  };

  // Handle PDF file selection
  const handlePdfChange = (e) => {
    const selectedPdfs = Array.from(e.target.files);
    
    selectedPdfs.forEach(pdf => {
      if (pdf.type === 'application/pdf') {
        setPdfFiles(prev => [...prev, pdf]);
      } else {
        toast.error(`${pdf.name} is not a PDF file`);
      }
    });
    
    e.target.value = null;
    toast.success(`${selectedPdfs.filter(pdf => pdf.type === 'application/pdf').length} PDF(s) added successfully!`);
  };

  const removePDF = (index) => {
    setPdfFiles(prev => prev.filter((_, i) => i !== index));
    toast.info('PDF removed');
  };

  const handleAddVideo = () => {
    videoInputRef.current.click();
  };

  const handleVideoChange = async (e) => {
    const selectedVideos = Array.from(e.target.files);
    setUploadingVideos(true);

    const updatedVideoData = [...formData.videos];

    for (const video of selectedVideos) {
      const videoEntry = { 
        title: video.name, 
        url: '', 
        duration: 0, 
        isProcessing: true,
        public_id: ''
      };
      updatedVideoData.push(videoEntry);
      setFormData(prev => ({ ...prev, videos: [...updatedVideoData] }));

      const uploadFormData = new FormData();
      uploadFormData.append('file', video);
      uploadFormData.append('upload_preset', 'llm_upload');

      try {
        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dqzvjsfws/video/upload',
          uploadFormData
        );

        const updatedEntry = {
          title: video.name,
          url: res.data.secure_url,
          duration: Math.floor(res.data.duration),
          public_id: res.data.public_id,
          isProcessing: false
        };

        const index = updatedVideoData.findIndex(v => 
          v.title === video.name && v.isProcessing
        );
        if (index !== -1) {
          updatedVideoData[index] = updatedEntry;
          setFormData(prev => ({ ...prev, videos: [...updatedVideoData] }));
        }

      } catch (err) {
        console.error("Video upload error:", err);
        toast.error(`Failed to upload ${video.name}`);
        const failedIndex = updatedVideoData.findIndex(v => 
          v.title === video.name && v.isProcessing
        );
        if (failedIndex !== -1) {
          updatedVideoData.splice(failedIndex, 1);
          setFormData(prev => ({ ...prev, videos: [...updatedVideoData] }));
        }
      }
    }

    setUploadingVideos(false);
    videoInputRef.current.value = null;
    toast.success("Videos uploaded successfully!");
  };

  // Remove video
  const removeVideo = (index) => {
    setVideoToDelete(index);
    setShowDeleteModal(true);
  };

  const confirmDeleteVideo = () => {
    if (videoToDelete !== null) {
      setFormData(prev => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== videoToDelete)
      }));
      toast.info('Video removed');
    }
    setShowDeleteModal(false);
    setVideoToDelete(null);
  };

  const cancelDeleteVideo = () => {
    setShowDeleteModal(false);
    setVideoToDelete(null);
  };

  // Format duration helper
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.duration) {
      toast.error('Please fill all required fields');
      return;
    }

    // Check if cover image exists (either existing or new file)
    if (!coverImagePreview) {
      toast.error('Please select a cover image');
      return;
    }

    if (formData.videos.length === 0) {
      toast.error('Course must consist of at least one video');
      return;
    }

    if (formData.videos.some(v => v.isProcessing)) {
      toast.error('Please wait for all videos to finish processing');
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const submitFormData = new FormData();
      
      // Add text fields
      submitFormData.append('title', formData.title);
      submitFormData.append('description', formData.description);
      submitFormData.append('duration', formData.duration);
      submitFormData.append('cost', formData.cost.toString());
      
      // Add videos data as JSON string
      submitFormData.append('videos', JSON.stringify(formData.videos.map(v => ({
        title: v.title,
        url: v.url,
        duration: v.duration,
        _id: v._id // Include _id for existing videos
      }))));

      // Add cover image file if new one is selected
      if (coverImageFile) {
        submitFormData.append('coverImage', coverImageFile);
      }

      // Add PDF files
      pdfFiles.forEach((pdf) => {
        submitFormData.append('pdfs', pdf);
      });

      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/course/${course._id}`,
        submitFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      onUpdate(res.data.course);
      onClose();
      toast.success('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(error.response?.data?.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Are you sure you want to remove this video?
                </p>
                <p className="text-sm text-red-600 font-medium">
                  ⚠️ This will also remove progress data for all enrolled students.
                </p>
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={cancelDeleteVideo}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteVideo}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Remove Video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-2xl font-bold text-gray-800">Edit Course</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-h-[calc(90vh-140px)] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., 4 weeks, 20 hours"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cost (₹)
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter course cost"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter course description"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cover Image *
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                    dragActive 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <LoadingSpinner />
                      <p className="text-gray-600 mt-2">Uploading image...</p>
                    </div>
                  ) : coverImagePreview ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={coverImagePreview} 
                        alt="Cover preview" 
                        className="w-32 h-20 object-cover rounded-lg mb-4"
                      />
                      <p className="text-green-600 font-medium mb-2">
                        {coverImageFile ? 'New image selected!' : 'Current cover image'}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        id="cover-image-input"
                      />
                      <label
                        htmlFor="cover-image-input"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer"
                      >
                        Change Image
                      </label>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drag and drop your image here
                      </p>
                      <p className="text-gray-500 mb-4">or</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        id="cover-image-input"
                      />
                      <label
                        htmlFor="cover-image-input"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer flex items-center"
                      >
                        <PhotoIcon className="h-5 w-5 mr-2" />
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* PDFs Section */}
              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <DocumentIcon className="h-5 w-5 mr-2 text-emerald-600" />
                    Study Materials (PDFs)
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddPdf}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add PDF
                  </button>
                </div>
                
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  ref={pdfInputRef}
                  onChange={handlePdfChange}
                  className="hidden"
                />
                
                {/* Show existing PDFs if no new ones are added */}
                {pdfFiles.length === 0 && course?.pdfs?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current PDFs (will be replaced if new ones are uploaded):</p>
                    <div className="space-y-2">
                      {course.pdfs.map((pdf, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-emerald-200 flex items-center">
                          <DocumentIcon className="h-4 w-4 text-emerald-600 mr-2" />
                          <span className="text-sm text-gray-700">Existing PDF {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {pdfFiles.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-orange-600 font-medium">New PDFs (will replace existing ones):</p>
                    {pdfFiles.map((pdf, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center">
                          <DocumentIcon className="h-5 w-5 text-emerald-600 mr-3" />
                          <span className="text-gray-700 font-medium">{pdf.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePDF(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  pdfFiles.length === 0 && (!course?.pdfs?.length || course.pdfs.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No PDFs added yet</p>
                  )
                )}
              </div>

              {/* Videos Section */}
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <VideoCameraIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    Video Lectures
                  </h3>
                  <div className="flex items-center space-x-4">
                    {uploadingVideos && (
                      <div className="flex items-center space-x-2 text-indigo-600">
                        <PulsingDots />
                        <span className="text-sm">Processing videos...</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleAddVideo}
                      disabled={uploadingVideos}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center disabled:bg-gray-400"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Video
                    </button>
                  </div>
                </div>
                
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  ref={videoInputRef}
                  onChange={handleVideoChange}
                  className="hidden"
                />
                
                {formData.videos.length > 0 ? (
                  <div className="space-y-3">
                    {formData.videos.map((video, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-indigo-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1">
                            {video.isProcessing ? (
                              <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                                <LoadingSpinner />
                              </div>
                            ) : video.public_id ? (
                              <img 
                                src={`https://res.cloudinary.com/dqzvjsfws/video/upload/${video.public_id}.jpg`}
                                alt="Video thumbnail"
                                className="w-16 h-12 object-cover rounded-lg mr-3"
                              />
                            ) : (
                              <VideoCameraIcon className="h-5 w-5 text-indigo-600 mr-3" />
                            )}
                            <div>
                              <h4 className="font-medium text-gray-800">{video.title}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                {video.isProcessing ? (
                                  <span className="text-xs text-orange-600 flex items-center">
                                    <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                                    Processing...
                                  </span>
                                ) : (
                                  <span className="text-xs text-green-600 flex items-center">
                                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                                    Duration: {formatDuration(video.duration)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => removeVideo(index)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No videos added yet</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading || uploadingVideos || !coverImagePreview || formData.videos.some(v => v.isProcessing)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Updating...</span>
                  </>
                ) : (
                  'Update Course'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCourseModal;