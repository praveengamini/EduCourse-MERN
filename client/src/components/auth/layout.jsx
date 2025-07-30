import { Outlet, useLocation } from "react-router-dom";
import AuthLayoutImage from '../../assets/AuthLayoutImage.png';

function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname.includes('register');

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-stone-100">
      {isRegister ? (
        <>
          <div className="flex flex-1 items-center justify-center">
            <div className={`
              w-full transition-transform duration-500 ease-in-out
              ${isRegister ? 'transform translate-x-0' : 'transform -translate-x-full'}
            `}>
              <Outlet />
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center w-2/5 h-screen">
            <div className={`
              w-full h-full
              transition-transform duration-500 ease-in-out
              ${isRegister ? 'transform translate-x-0' : 'transform translate-x-full'}
            `}>
              <img 
                src={AuthLayoutImage} 
                alt="SkillCraft" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="hidden lg:flex items-center justify-center w-2/5 h-screen">
            <div className={`
              w-full h-full
              transition-transform duration-500 ease-in-out
              ${!isRegister ? 'transform translate-x-0' : 'transform -translate-x-full'}
            `}>
              <img 
                src={AuthLayoutImage} 
                alt="SkillCraft" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className={`
              w-full transition-transform duration-500 ease-in-out
              ${!isRegister ? 'transform translate-x-0' : 'transform translate-x-full'}
            `}>
              <Outlet />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AuthLayout;