import { Outlet, useLocation, Link } from "react-router-dom";
import AuthLayoutImage from '../../assets/AuthLayoutImage.png';

function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname.includes('register');

  return (
    <div className="flex min-h-screen w-full ">
      <div className="absolute top-6 left-6 z-10">
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
        >
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Back to Home
        </Link>
      </div>

      {isRegister ? (
        <>
          <div className="flex flex-1 items-center justify-center bg-black">
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