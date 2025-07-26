import React, { useState, useEffect, useCallback } from 'react';
import { 
  XMarkIcon, 
  PlusIcon, 
  TrashIcon, 
  DocumentIcon, 
  VideoCameraIcon,
  CloudArrowUpIcon,
  PhotoIcon
} from '@heroicons/react/24/solid';
import axios from 'axios';

const EditCourseModal = ({ course, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    cost: 0,
    coverImage: '',
    pdfs: [],
    videos: []
  });
  
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize form data when course changes
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        duration: course.duration || '',
        cost: course.cost || 0,
        coverImage: course.coverImage || '',
        pdfs: course.pdfs || [],
        videos: course.videos || []
      });
    }
  }, [course]);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        await uploadCoverImage(file);
      } else {
        alert('Please drop only image files for cover image');
      }
    }
  }, []);

  // Handle file input change for cover image
  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        await uploadCoverImage(file);
      } else {
        alert('Please select only image files');
      }
    }
  };

  // Upload cover image to server
  const uploadCoverImage = async (file) => {
    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/upload/image`,
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setFormData(prev => ({
        ...prev,
        coverImage: res.data.url
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
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

  // Add new PDF
  const addPDF = () => {
    const pdfUrl = prompt('Enter PDF URL:');
    if (pdfUrl && pdfUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        pdfs: [...prev.pdfs, pdfUrl.trim()]
      }));
    }
  };

  // Remove PDF
  const removePDF = (index) => {
    setFormData(prev => ({
      ...prev,
      pdfs: prev.pdfs.filter((_, i) => i !== index)
    }));
  };

  // Add new video
  const addVideo = () => {
    const title = prompt('Enter video title:');
    if (!title || !title.trim()) return;

    const url = prompt('Enter video URL:');
    if (!url || !url.trim()) return;

    const durationStr = prompt('Enter video duration in seconds:');
    const duration = parseInt(durationStr);
    if (isNaN(duration) || duration <= 0) {
      alert('Please enter a valid duration in seconds');
      return;
    }

    const newVideo = {
      title: title.trim(),
      url: url.trim(),
      duration: duration
    };

    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, newVideo]
    }));
  };

  // Remove video
  const removeVideo = (index) => {
    if (confirm('Are you sure you want to remove this video? This will also remove progress data for all enrolled students.')) {
      setFormData(prev => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index)
      }));
    }
  };

  // Edit existing video
  const editVideo = (index) => {
    const video = formData.videos[index];
    
    const newTitle = prompt('Enter video title:', video.title);
    if (!newTitle || !newTitle.trim()) return;

    const newUrl = prompt('Enter video URL:', video.url);
    if (!newUrl || !newUrl.trim()) return;

    const newDurationStr = prompt('Enter video duration in seconds:', video.duration.toString());
    const newDuration = parseInt(newDurationStr);
    if (isNaN(newDuration) || newDuration <= 0) {
      alert('Please enter a valid duration in seconds');
      return;
    }

    setFormData(prev => ({
      ...prev,
      videos: prev.videos.map((v, i) => 
        i === index 
          ? { ...v, title: newTitle.trim(), url: newUrl.trim(), duration: newDuration }
          : v
      )
    }));
  };

  // Format duration helper
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/course/${course._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      onUpdate(res.data.course);
      onClose();
      alert('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      alert(error.response?.data?.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                    <p className="text-gray-600">Uploading image...</p>
                  </div>
                ) : formData.coverImage ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={formData.coverImage} 
                      alt="Cover preview" 
                      className="w-32 h-20 object-cover rounded-lg mb-4"
                    />
                    <p className="text-green-600 font-medium mb-2">Image uploaded successfully!</p>
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
                  onClick={addPDF}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add PDF
                </button>
              </div>
              
              {formData.pdfs.length > 0 ? (
                <div className="space-y-3">
                  {formData.pdfs.map((pdf, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <DocumentIcon className="h-5 w-5 text-emerald-600 mr-3" />
                        <span className="text-gray-700 font-medium">Study Material {index + 1}</span>
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
                <p className="text-gray-500 text-center py-4">No PDFs added yet</p>
              )}
            </div>

            {/* Videos Section */}
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <VideoCameraIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Video Lectures
                </h3>
                <button
                  type="button"
                  onClick={addVideo}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Video
                </button>
              </div>
              
              {formData.videos.length > 0 ? (
                <div className="space-y-3">
                  {formData.videos.map((video, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-indigo-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <VideoCameraIcon className="h-5 w-5 text-indigo-600 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-800">{video.title}</h4>
                            <p className="text-sm text-gray-500">Duration: {formatDuration(video.duration)}</p>
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
              disabled={loading || uploading || !formData.coverImage}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Course'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;