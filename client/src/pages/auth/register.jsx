import CommonForm from "@/components/common/form"; 
import { toast } from "sonner";  
import { registerFormControls } from "../../config"; 
import { registerUser } from "@/store/auth-slice"; 
import { useState } from "react"; 
import { useDispatch } from "react-redux"; 
import { Link, useNavigate } from "react-router-dom"; 
 
const initialState = { 
  userName: "", 
  email: "", 
  password: "", 
  confirmPassword: "",
}; 

const enhancedRegisterFormControls = [
  ...registerFormControls,
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Confirm your password",
    componentType: "input",
    type: "password",
  }
];

function AuthRegister() { 
  const [formData, setFormData] = useState(initialState); 
  const [passwordErrors, setPasswordErrors] = useState([]);
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
    
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      errors.push("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)");
    }
    
    return errors;
  }

  function handleFormDataChange(newFormData) {
    setFormData(newFormData);
    
    if (newFormData.password !== formData.password) {
      const errors = validatePassword(newFormData.password);
      setPasswordErrors(errors);
    }
  }
 
  function onSubmit(event) { 
    event.preventDefault(); 
    
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
                     formData.password && 
                     formData.confirmPassword &&
                     formData.password === formData.confirmPassword &&
                     passwordErrors.length === 0;
 
  console.log(formData); 
 
  return ( 
    <div className="mx-auto w-full max-w-md space-y-6"> 
      <div className="text-center"> 
        <h1 className="text-3xl font-bold tracking-tight text-slate-800"> 
          Start Your Learning Journey 
        </h1> 
      </div> 
      
      <div className="space-y-4">
        <CommonForm 
          formControls={enhancedRegisterFormControls} 
          buttonText={"Create Account"} 
          formData={formData} 
          setFormData={handleFormDataChange} 
          onSubmit={onSubmit}
          isBtnDisabled={!isFormValid}
        />
        
        {formData.password && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
            <ul className="space-y-1">
              <li className={`text-xs flex items-center ${formData.password.length >= 8 ? 'text-green-600' : 'text-red-500'}`}>
                <span className="w-4 h-4 mr-2">
                  {formData.password.length >= 8 ? '✓' : '✗'}
                </span>
                At least 8 characters
              </li>
              <li className={`text-xs flex items-center ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                <span className="w-4 h-4 mr-2">
                  {/(?=.*[a-z])/.test(formData.password) ? '✓' : '✗'}
                </span>
                One lowercase letter
              </li>
              <li className={`text-xs flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                <span className="w-4 h-4 mr-2">
                  {/(?=.*[A-Z])/.test(formData.password) ? '✓' : '✗'}
                </span>
                One uppercase letter
              </li>
              <li className={`text-xs flex items-center ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                <span className="w-4 h-4 mr-2">
                  {/(?=.*\d)/.test(formData.password) ? '✓' : '✗'}
                </span>
                One number
              </li>
              <li className={`text-xs flex items-center ${/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password) ? 'text-green-600' : 'text-red-500'}`}>
                <span className="w-4 h-4 mr-2">
                  {/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password) ? '✓' : '✗'}
                </span>
                One special character
              </li>
            </ul>
          </div>
        )}
        
        {formData.confirmPassword && (
          <div className="mt-2">
            <p className={`text-xs flex items-center ${
              formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-500'
            }`}>
              <span className="w-4 h-4 mr-2">
                {formData.password === formData.confirmPassword ? '✓' : '✗'}
              </span>
              {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
            </p>
          </div>
        )}
      </div>
        
      <p className="mt-6 text-slate-600"> 
        Already have an account? 
        <Link 
          className="font-medium ml-2 text-slate-700 hover:text-slate-900 hover:underline transition-colors inline-flex items-center" 
          to="/auth/login" 
        > 
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> 
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" /> 
          </svg> 
          Sign In 
        </Link> 
      </p> 
    </div> 
  ); 
} 
 
export default AuthRegister;