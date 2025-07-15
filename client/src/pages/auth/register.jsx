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
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        navigate("/auth/login");
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }

  console.log(formData);

  return (
    <div className="mx-auto w-full max-w-md space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Start Your Learning Journey
        </h1>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Create Account"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
        <p className="mt-2 text-slate-600">
          Already have an account?
          <Link
            className="font-medium ml-2 text-slate-700 hover:text-slate-900 hover:underline transition-colors inline-flex items-center"
            to="/auth/login"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In
          </Link>
        </p>
    </div>
  );
}

export default AuthRegister;