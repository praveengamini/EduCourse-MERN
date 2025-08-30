import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Lock, Shield, AlertCircle, CheckCircle2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { setNewPassword } from '@/store/auth-slice';

const SetNewPassword = ({ trigger, open, onOpenChange }) => {
  const dispatch = useDispatch();
  const { isPasswordChanging, passwordChangeError, passwordChangeSuccess } = useSelector(state => state.auth);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await dispatch(setNewPassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    }));

    if (setNewPassword.fulfilled.match(result)) {
      // Reset form after successful password change
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const handleClose = () => {
    if (!isPasswordChanging) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setValidationError('');
      setShowPasswords({
        current: false,
        new: false,
        confirm: false
      });
      dispatch(resetPasswordChangeState());
      if (onOpenChange) onOpenChange(false);
    }
  };

  const handleSuccessRedirect = () => {
    handleClose();
    // You can add navigation logic here
    window.location.href = '/login'; // Adjust as needed
  };

  useEffect(() => {
    return () => {
      dispatch(resetPasswordChangeState());
    };
  }, [dispatch]);

  const DialogContentComponent = () => {
    if (passwordChangeSuccess) {
      return (
        <div className="bg-gradient-to-b from-purple-900/90 to-black/90 border-purple-500/30 text-center p-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <DialogHeader className="space-y-4 mb-6">
            <DialogTitle className="text-2xl font-bold text-white">
              Password Changed Successfully!
            </DialogTitle>
            <DialogDescription className="text-purple-200 text-base">
              Your password has been updated successfully. You have been logged out from all devices for security reasons.
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={handleSuccessRedirect}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Go to Login
          </button>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-b from-purple-900/90 to-black/90 border-purple-500/30">
        {/* Header */}
        <DialogHeader className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-purple-400" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            Set New Password
          </DialogTitle>
          <DialogDescription className="text-purple-200">
            Update your password to keep your account secure
          </DialogDescription>
        </DialogHeader>

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
        <div className="space-y-6">
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
                className="w-full pl-10 pr-12 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
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
                className="w-full pl-10 pr-12 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
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
                className="w-full pl-10 pr-12 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
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

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              disabled={isPasswordChanging}
              className="flex-1 bg-gray-600/50 hover:bg-gray-600/70 disabled:bg-gray-700/50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 border border-gray-500/30"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPasswordChanging}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-purple-800 disabled:to-purple-900 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {isPasswordChanging ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Changing...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-4 p-4 bg-purple-600/10 border border-purple-500/20 rounded-lg">
            <p className="text-purple-200 text-sm text-center">
              🔒 Changing your password will log you out from all devices for security
            </p>
          </div>
        </div>
      </div>
    );
  };

  // If controlled by parent component
  if (open !== undefined && onOpenChange !== undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-0">
          <DialogContentComponent />
        </DialogContent>
      </Dialog>
    );
  }

  // If using trigger
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0">
        <DialogContentComponent />
      </DialogContent>
    </Dialog>
  );
};

export default SetNewPassword;