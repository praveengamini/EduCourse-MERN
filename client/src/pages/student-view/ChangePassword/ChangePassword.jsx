import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Lock, Mail, LogOutIcon } from 'lucide-react'
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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
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
    setShowPassword(false)
    setShowConfirmPassword(false)
    setIsOpen(false)
  }

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-2xl border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Logout button */}
          <button
            onClick={() => dispatch(logoutUser())}
            className="absolute right-4 top-4 px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <LogOutIcon className="h-4 w-4" />
            Logout
          </button>

          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-2">
                <Lock className="h-5 w-5 text-primary" />
                Change Password
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter your email and new password to update your account credentials.
                You will be logged out after changing your password.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`transition-all bg-gray-50 dark:bg-gray-800 ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'focus:border-primary focus:ring-primary/20'
                  }`}
                  disabled={loading}
                  readOnly
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
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
                    className={`pr-10 transition-all ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'focus:border-primary focus:ring-primary/20'
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
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
                    className={`pr-10 transition-all ${
                      errors.confirmPassword 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'focus:border-primary focus:ring-primary/20'
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Changing...
                    </div>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangePassword