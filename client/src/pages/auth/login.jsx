import CommonForm from "@/components/common/form";
import { toast } from "react-toastify";
import { loginFormControls } from "../../config";
import { loginUser } from "../../store/auth-slice/index";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { MdPeopleAlt } from "react-icons/md";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();

    // Manual validation as backup
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success("Logged in successfully");

        if (data?.payload?.deviceRemoved) {
          toast.info(`Device "${data.payload.deviceRemoved.deviceName}" was logged out due to device limit.`);
        }
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center px-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
            <MdPeopleAlt className="text-4xl text-purple-500"/>
          </div>
          <p className="text-gray-400 text-lg">
            Empower Your Journey: Where Professionalism<br />
            Meets Progress
          </p>
        </div>

        {/* Wrap inputs in a form element */}
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <input
              required
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-sm"
            />
          </div>
          
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              minLength="6"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 cursor-pointer" />
              ) : (
                <Eye className="w-5 h-5 cursor-pointer" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 accent-purple-600 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500" />
              <span className="ml-2 cursor-pointer text-sm text-gray-400">Remember me</span>
            </label>
          </div>

          {/* Change to type="submit" and remove onClick */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-md"
          >
            Login
          </button>

        
        </form>

     
      </div>
    </div>
  );
}

export default AuthLogin;