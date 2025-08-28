import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { addStudentByAdmin } from '@/store/Admin-AddStudent';

const AddNewStudent = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.adminStudent || {});

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    } else if (formData.userName.trim().length < 2) {
      newErrors.userName = 'Username must be at least 2 characters long';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but if provided should be valid)
    if (formData.phone.trim() && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await dispatch(addStudentByAdmin(formData)).unwrap();
      
      if (result.success) {
        toast.success(result.message || 'Student added successfully!');
        toast.info('Login credentials have been sent to the student\'s email');
        
        // Reset form
        setFormData({
          userName: '',
          email: '',
          phone: ''
        });
        setErrors({});
      }
    } catch (error) {
      const errorMessage = error?.message || 'Failed to add student';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      userName: '',
      email: '',
      phone: ''
    });
    setErrors({});
  };

  return (
    <div className="w-full bg-white p-4">
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black mb-2">Add New Student</h2>
          <p className="text-gray-700">
            Create a new student account. Login credentials will be automatically generated and sent via email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Username Field */}
          <div className="w-full">
            <label htmlFor="userName" className="block text-lg font-semibold text-black mb-3">
              Username <span className="text-purple-600">*</span>
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className={`w-full px-6 py-4 text-lg border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors ${
                errors.userName ? 'border-red-500' : 'border-purple-200'
              }`}
              placeholder="Enter student's username"
              disabled={isSubmitting}
            />
            {errors.userName && (
              <p className="mt-2 text-lg text-red-600">{errors.userName}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="w-full">
            <label htmlFor="email" className="block text-lg font-semibold text-black mb-3">
              Email Address <span className="text-purple-600">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-6 py-4 text-lg border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors ${
                errors.email ? 'border-red-500' : 'border-purple-200'
              }`}
              placeholder="Enter student's email address"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-2 text-lg text-red-600">{errors.email}</p>
            )}
            <p className="mt-2 text-base text-gray-600">
              Login credentials will be sent to this email address
            </p>
          </div>

          {/* Phone Field */}
          <div className="w-full">
            <label htmlFor="phone" className="block text-lg font-semibold text-black mb-3">
              Phone Number <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-6 py-4 text-lg border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors ${
                errors.phone ? 'border-red-500' : 'border-purple-200'
              }`}
              placeholder="Enter student's phone number"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-2 text-lg text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-6 pt-8 w-full">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-4 px-8 rounded-lg text-lg font-semibold transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding Student...
                </span>
              ) : (
                'Add Student'
              )}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-8 py-4 border-2 border-purple-200 rounded-lg text-lg font-semibold text-black hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewStudent;