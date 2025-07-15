import CommonForm from "@/components/common/form";
import { toast } from "sonner"; 
import { loginFormControls } from "../../config";
import { loginUser } from "../../store/auth-slice/index";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-14">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Welcome Back
        </h1>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}

      />
        <p className="mt-2 text-slate-600">
          Don't have an account?
          <Link
            className="font-medium ml-2 text-slate-700 hover:text-slate-900 hover:underline transition-colors inline-flex items-center"
            to="/auth/register"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Create Account
          </Link>
        </p>
    </div>
  );
}

export default AuthLogin;