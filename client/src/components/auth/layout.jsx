import { Outlet } from "react-router-dom";
import AuthLayoutImage from '../../assets/AuthLayoutImage.png' 
function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-stone-100">
      <div className="hidden lg:flex items-center justify-center w-2/5">
        <img 
          src={AuthLayoutImage} 
          alt="SkillCraft" 
          className="w-full max-h-screen object-cover"
        />
      </div>

      <div className="flex flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;