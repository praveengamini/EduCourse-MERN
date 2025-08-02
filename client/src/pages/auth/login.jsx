import CommonForm from "@/components/common/form";
import { toast } from "sonner";
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

        <div className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-sm"
            />
          </div>
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-sm"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500" />
              <span className="ml-2 text-sm text-gray-400">Remember me</span>
            </label>
            {/* <a href="#" className="text-sm text-gray-400 hover:text-white">Forgot Password?</a> */}
          </div>

          <button
            onClick={onSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-md"
          >
            Login
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">or</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="text-purple-500 hover:text-purple-400 font-medium"
            >
              Sign up.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthLogin;