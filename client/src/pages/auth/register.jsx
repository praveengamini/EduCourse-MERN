import CommonForm from "@/components/common/form"; 
import { toast } from "sonner";  
import { registerFormControls } from "../../config"; 
import { registerUser } from "@/store/auth-slice"; 
import { useState } from "react"; 
import { useDispatch } from "react-redux"; 
import { Link, useNavigate } from "react-router-dom"; 
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, XCircle, Phone } from "lucide-react"; 
import { MdPeopleAlt } from "react-icons/md";

const initialState = { 
  userName: "", 
  email: "", 
  phone: "",   // ✅ added phone
  password: "", 
  confirmPassword: "",
}; 

function AuthRegister() { 
  const [formData, setFormData] = useState(initialState); 
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 

  function validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/(?=.*[!@#$%^&*(),.?\":{}|<>])/.test(password)) {
      errors.push("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)");
    }
    
    return errors;
  }

  function handleInputChange(field, value) {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    if (field === 'password') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  }
 
  function onSubmit(event) { 
    event.preventDefault(); 
    
    // Manual validation as backup
    if (!formData.userName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const passwordValidationErrors = validatePassword(formData.password);
    if (passwordValidationErrors.length > 0) {
      toast.error("Please fix password requirements");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    const { confirmPassword, ...submitData } = formData;
    
    dispatch(registerUser(submitData)).then((data) => { 
      if (data?.payload?.success) { 
        toast.success(data?.payload?.message); 
        navigate("/auth/login"); 
      } else { 
        toast.error(data?.payload?.message); 
      } 
    }); 
  } 

  const isFormValid = formData.userName && 
                     formData.email && 
                     formData.phone &&   // ✅ must include phone
                     formData.password && 
                     formData.confirmPassword &&
                     formData.password === formData.confirmPassword &&
                     passwordErrors.length === 0;

  const passwordRequirements = [
    { text: "At least 8 characters", test: formData.password.length >= 8 },
    { text: "One lowercase letter", test: /(?=.*[a-z])/.test(formData.password) },
    { text: "One uppercase letter", test: /(?=.*[A-Z])/.test(formData.password) },
    { text: "One number", test: /(?=.*\d)/.test(formData.password) },
    { text: "One special character", test: /(?=.*[!@#$%^&*(),.?\":{}|<>])/.test(formData.password) }
  ];
 
  return ( 
    <div className=" bg-black flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
            <MdPeopleAlt className="text-4xl text-purple-500 "/>
          </div>
          <p className="text-gray-400 text-xl">
           Let's get started with your account
          </p>
        </div>

        {/* Wrap in form element */}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              required
              type="text"
              placeholder="Username"
              value={formData.userName}
              onChange={(e) => handleInputChange('userName', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-sm"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              required
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-sm"
            />
          </div>

          {/* ✅ Phone input */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              required
              type="number"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-sm"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              required
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              minLength="8"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              minLength="8"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {formData.password && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-300 mb-3">Password Requirements:</p>
              <div className="grid grid-cols-1 gap-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className={`flex items-center text-xs ${req.test ? 'text-green-400' : 'text-red-400'}`}>
                    {req.test ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    {req.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.confirmPassword && (
            <div className={`flex items-center text-xs ${
              formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'
            }`}>
              {formData.password === formData.confirmPassword ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full font-medium py-3 px-4 rounded-lg transition duration-200 shadow-md ${
              isFormValid
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-purple-500 hover:text-purple-400 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  ); 
} 
 
export default AuthRegister;