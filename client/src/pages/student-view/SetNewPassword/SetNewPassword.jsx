import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Shield, AlertCircle, CheckCircle2, X } from 'lucide-react';

const SetNewPassword = () => {
  // Mock Redux state for demo
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword.trim()) {
      setValidationError('Current password is required');
      return false;
    }
    if (!formData.newPassword.trim()) {
      setValidationError('New password is required');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setValidationError('New password must be at least 6 characters long');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError('New passwords do not match');
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      setValidationError('New password must be different from current password');
      return false;
    }
    return true;
  };

  const showToast = (message, type = 'success') => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-0 ${
      type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('translate-x-0'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsPasswordChanging(true);
    setPasswordChangeError('');

    // Mock API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      // Simulate success
      setPasswordChangeSuccess(true);
      showToast('Password changed successfully!', 'success');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setPasswordChangeError('Failed to change password. Please try again.');
      showToast('Failed to change password. Please try again.', 'error');
    } finally {
      setIsPasswordChanging(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Navigate to /student/myprofile
    console.log('Dialog closed - would navigate to /student/myprofile');
    // In actual implementation: navigate('/student/myprofile');
  };

  useEffect(() => {
    // Mock cleanup
    return () => {
      console.log('Component cleanup');
    };
  }, []);

  useEffect(() => {
    if (passwordChangeSuccess) {
      setTimeout(() => {
        handleCloseDialog();
      }, 2000);
    }
  }, [passwordChangeSuccess]);

  if (!isDialogOpen) {
    return null;
  }

  if (passwordChangeSuccess) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-b from-purple-800/20 to-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 text-center relative shadow-2xl">
            <button
              onClick={handleCloseDialog}
              className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors duration-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Password Changed Successfully!</h2>
            <p className="text-purple-200 mb-6">
              Your password has been updated successfully. You have been logged out from all devices for security reasons.
            </p>
            <button
              onClick={handleCloseDialog}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-b from-purple-800/20 to-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 shadow-2xl relative">
          {/* Close Button */}
          <button
            onClick={handleCloseDialog}
            className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors duration-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Set New Password</h1>
            <p className="text-purple-200">Update your password to keep your account secure</p>
          </div>

          {/* Error Display */}
          {(validationError || passwordChangeError) && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm">
                {validationError || passwordChangeError}
              </span>
            </div>
          )}

          {/* Password Change Section */}
          <div onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPasswordChanging}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-purple-800 disabled:to-purple-900 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {isPasswordChanging ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Changing Password...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-purple-600/10 border border-purple-500/20 rounded-lg">
            <p className="text-purple-200 text-sm text-center">
              🔒 Changing your password will log you out from all devices for security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;