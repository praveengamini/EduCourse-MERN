import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Lock, Mail, LogOut, Check } from 'lucide-react'
import { changePassword } from '@/store/Admin-AddStudent'
import { logoutUser } from '@/store/auth-slice'

const ChangePassword = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.adminStudent || {})
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth)
  
  const [isOpen, setIsOpen] = useState(true)
  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  })

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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const strength = validatePassword(formData.password);
      if (strength.score < 3) {
        newErrors.password = 'Password is too weak. Please meet more requirements.';
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Update password strength for new password
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }

    // Validate confirm password in real-time
    if (name === 'confirmPassword' && formData.password) {
      if (value && value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const result = await dispatch(changePassword({
        email: formData.email,
        password: formData.password
      })).unwrap()

      if (result.success) {
        toast.success(result.message || 'Password changed successfully! Logging out...')
        
        // Clear form data
        setFormData({ 
          email: user?.email || '', 
          password: '', 
          confirmPassword: '' 
        })
        setErrors({})
        setPasswordStrength({
          score: 0,
          checks: {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false,
            special: false
          }
        })
        setIsOpen(false)
        
        // Add a small delay before logout for better UX
        setTimeout(() => {
          dispatch(logoutUser())
        }, 1500) // 1.5 second delay to show the success message
      }
    } catch (error) {
      toast.error(error.message || 'Failed to change password')
    }
  }

  const handleClose = () => {
    setFormData({ 
      email: user?.email || '', 
      password: '', 
      confirmPassword: '' 
    })
    setErrors({})
    setPasswordStrength({
      score: 0,
      checks: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      }
    })
    setShowPassword(false)
    setShowConfirmPassword(false)
    setIsOpen(false)
  }

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

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with blur - can't be closed by clicking */}
      <div 
        className="fixed inset-0 z-50 bg-black/50"
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      />
      
      {/* Modal content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div 
          className="relative w-full max-w-xs sm:max-w-md max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-2xl border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Logout button */}
          <button
            onClick={() => dispatch(logoutUser())}
            className="absolute right-3 top-3 sm:right-4 sm:top-4 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-1 sm:gap-2"
            disabled={loading}
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="mb-4 sm:mb-6 pr-16 sm:pr-20">
              <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold mb-2">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Change Password
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Enter your email and new password to update your account credentials.
                You will be logged out after changing your password.
              </p>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm font-medium flex items-center gap-2">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`transition-all bg-gray-50 dark:bg-gray-800 text-xs sm:text-sm h-9 sm:h-10 ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'focus:border-primary focus:ring-primary/20'
                  }`}
                  disabled={loading}
                  readOnly
                />
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm font-medium flex items-center gap-2">
                  <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pr-8 sm:pr-10 transition-all text-xs sm:text-sm h-9 sm:h-10 ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'focus:border-primary focus:ring-primary/20'
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Password Strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.score <= 2 ? 'text-red-500' : 
                        passwordStrength.score <= 3 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {getStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-500 mb-2">Password must contain:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                      {[
                        { key: 'length', text: 'At least 8 characters' },
                        { key: 'uppercase', text: 'Uppercase letter' },
                        { key: 'lowercase', text: 'Lowercase letter' },
                        { key: 'number', text: 'Number' },
                        { key: 'special', text: 'Special character' }
                      ].map(({ key, text }) => (
                        <div key={key} className={`flex items-center space-x-1 ${
                          passwordStrength.checks[key] ? 'text-green-500' : 'text-gray-400'
                        }`}>
                          <Check className={`w-3 h-3 ${passwordStrength.checks[key] ? 'opacity-100' : 'opacity-30'}`} />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs sm:text-sm font-medium flex items-center gap-2">
                  <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pr-8 sm:pr-10 transition-all text-xs sm:text-sm h-9 sm:h-10 ${
                      errors.confirmPassword 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'focus:border-primary focus:ring-primary/20'
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 sm:pt-4">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full h-9 sm:h-10 text-xs sm:text-sm"
                  disabled={loading || passwordStrength.score < 3}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Changing...
                    </div>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangePassword