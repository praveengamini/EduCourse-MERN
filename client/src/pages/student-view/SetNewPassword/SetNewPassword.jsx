import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Shield, AlertCircle, CheckCircle2, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { setNewPassword, resetPasswordChangeState } from '@/store/auth-slice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const SetNewPassword = ({ isOpen, onClose }) => {
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

  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });

  useEffect(() => {
    if (passwordChangeSuccess) {
      setTimeout(() => {
        handleCloseDialog();
      }, 2000);
    }
  }, [passwordChangeSuccess]);

  // Password validation rules
  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update password strength for new password
    if (name === 'newPassword') {
      setPasswordStrength(validatePassword(value));
    }

    // Validate confirm password in real-time
    if (name === 'confirmPassword' && formData.newPassword) {
      if (value && value !== formData.newPassword) {
        setValidationErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else {
        setValidationErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.currentPassword.trim()) {
      errors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      errors.newPassword = 'New password is required';
    } else {
      const strength = validatePassword(formData.newPassword);
      if (strength.score < 3) {
        errors.newPassword = 'Password is too weak. Please meet more requirements.';
      }
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword && formData.currentPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showToast = (message, type = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const passwordData = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    };

    try {
      const resultAction = await dispatch(setNewPassword(passwordData));
      
      if (setNewPassword.fulfilled.match(resultAction)) {
        showToast('Password changed successfully!', 'success');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const errorMessage = resultAction.payload || 'Failed to change password';
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      showToast('Failed to change password. Please try again.', 'error');
    }
  };

  const handleCloseDialog = () => {
    // Reset form state
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setValidationErrors({});
    setPasswordStrength({ 
      score: 0, 
      checks: { 
        length: false, 
        uppercase: false, 
        lowercase: false, 
        number: false, 
        special: false 
      } 
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
    
    // Reset Redux password change state
    dispatch(resetPasswordChangeState());
    
    onClose();
  };

  useEffect(() => {
    // Mock cleanup
    return () => {
      console.log('Component cleanup');
    };
  }, []);

  const getStrengthColor = (score) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score) => {
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Medium';
    return 'Strong';
  };

  if (!isOpen) {
    return null;
  }   

  if (passwordChangeSuccess) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="bg-gradient-to-b from-purple-800/20 to-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 sm:p-8 text-center relative shadow-2xl">
            <button
              onClick={handleCloseDialog}
              className="absolute top-3 cursor-pointer right-3 sm:top-4 sm:right-4 text-purple-300 hover:text-white transition-colors duration-200 p-1"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
            </button>
            
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Password Changed Successfully!</h2>
            <p className="text-purple-200 mb-4 sm:mb-6 text-sm sm:text-base">
              Your password has been updated successfully. You have been logged out from all devices for security reasons.
            </p>
            <button
              onClick={handleCloseDialog}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm sm:max-w-md max-h-[95vh] overflow-y-auto">
        <div className="bg-gradient-to-b from-purple-800/20 to-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 sm:p-8 shadow-2xl relative">
          {/* Close Button */}
          <button
            onClick={handleCloseDialog}
            className="absolute top-3 right-3 cursor-pointer sm:top-4 sm:right-4 text-purple-300 hover:text-white transition-colors duration-200 p-1 z-10"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Set New Password</h1>
            <p className="text-purple-200 text-sm sm:text-base">Update your password to keep your account secure</p>
          </div>

          {/* Error Display */}
          {passwordChangeError && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-red-300 text-xs sm:text-sm">
                {passwordChangeError}
              </span>
            </div>
          )}

          {/* Password Change Section */}
          <div className="space-y-4 sm:space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                </div>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-black/30 border rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm sm:text-base ${
                    validationErrors.currentPassword ? 'border-red-500/50' : 'border-purple-500/30'
                  }`}
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              {validationErrors.currentPassword && (
                <p className="mt-1 text-xs sm:text-sm text-red-400">{validationErrors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                </div>
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-black/30 border rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm sm:text-base ${
                    validationErrors.newPassword ? 'border-red-500/50' : 'border-purple-500/30'
                  }`}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute inset-y-0 right-0 pr-3 cursor-pointer flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300">Password Strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.score <= 2 ? 'text-red-400' : 
                      passwordStrength.score <= 3 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {getStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              {formData.newPassword && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-purple-300 mb-2">Password must contain:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                    {[
                      { key: 'length', text: 'At least 8 characters' },
                      { key: 'uppercase', text: 'Uppercase letter' },
                      { key: 'lowercase', text: 'Lowercase letter' },
                      { key: 'number', text: 'Number' },
                      { key: 'special', text: 'Special character' }
                    ].map(({ key, text }) => (
                      <div key={key} className={`flex items-center space-x-1 ${
                        passwordStrength.checks[key] ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        <Check className={`w-3 h-3 ${passwordStrength.checks[key] ? 'opacity-100' : 'opacity-30'}`} />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {validationErrors.newPassword && (
                <p className="mt-1 text-xs sm:text-sm text-red-400">{validationErrors.newPassword}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                </div>
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-black/30 border rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm sm:text-base ${
                    validationErrors.confirmPassword ? 'border-red-500/50' : 'border-purple-500/30'
                  }`}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute inset-y-0 right-0 pr-3 cursor-pointer flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs sm:text-sm text-red-400">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPasswordChanging || passwordStrength.score < 3}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-purple-800 disabled:to-purple-900 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              {isPasswordChanging ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Changing Password...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-purple-600/10 border border-purple-500/20 rounded-lg">
            <p className="text-purple-200 text-xs sm:text-sm text-center">
              🔒 Changing your password will log you out from all devices for security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;