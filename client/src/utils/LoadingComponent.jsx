import React from 'react';

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-15">
        <div className="grid grid-cols-20 grid-rows-12 h-full w-full">
          {[...Array(240)].map((_, i) => (
            <div 
              key={i} 
              className="border border-purple-800/20 animate-pulse"
              style={{
                animationDelay: `${i * 30}ms`,
                animationDuration: '4s'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main educational icons layout */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="relative w-80 h-60">
          
          {/* VIDEO ICON - Left side */}
          <div className="absolute top-8 left-8">
            <div className="relative animate-pulse" style={{ animationDuration: '2s' }}>
              {/* Monitor screen */}
              <div className="w-20 h-14 bg-white border-2 border-white">
                {/* Screen content */}
                <div className="absolute inset-1 bg-gradient-to-br from-purple-600 to-purple-400"></div>
                {/* Play button triangle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-4 border-t-3 border-b-3 border-l-white border-t-transparent border-b-transparent ml-1"></div>
                </div>
              </div>
              {/* Monitor stand */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-white"></div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-white"></div>
              
              {/* Floating elements around video */}
              <div className="absolute -top-2 -right-2 w-2 h-2 bg-purple-400 transform rotate-45 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-white transform rotate-45 animate-bounce" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* BOOK ICON - Center */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="relative animate-bounce" style={{ animationDuration: '3s' }}>
              {/* Main book */}
              <div className="w-14 h-18 bg-gradient-to-r from-purple-600 to-purple-400 shadow-lg">
                {/* Book spine */}
                <div className="absolute left-0 top-0 w-2 h-18 bg-purple-700"></div>
                {/* Page lines */}
                <div className="absolute right-1 top-2 w-10 h-0.5 bg-white opacity-80"></div>
                <div className="absolute right-1 top-4 w-10 h-0.5 bg-white opacity-80"></div>
                <div className="absolute right-1 top-6 w-8 h-0.5 bg-white opacity-60"></div>
                <div className="absolute right-1 top-8 w-9 h-0.5 bg-white opacity-60"></div>
                <div className="absolute right-1 top-10 w-7 h-0.5 bg-white opacity-60"></div>
                {/* Bookmark */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1.5 h-10 bg-white"></div>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-0.75 border-r-0.75 border-t-2 border-l-transparent border-r-transparent border-t-white"></div>
              </div>
              
              {/* Stacked books underneath */}
              <div className="absolute -bottom-1 -left-1 w-12 h-16 bg-white opacity-90 -z-10"></div>
              <div className="absolute -bottom-2 -left-2 w-11 h-15 bg-purple-300 opacity-70 -z-20"></div>
              
              {/* Knowledge sparkles */}
              <div className="absolute -top-3 -left-3 w-1.5 h-1.5 bg-white transform rotate-45 animate-ping" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute -top-4 right-2 w-1 h-1 bg-purple-300 transform rotate-45 animate-ping" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>

          {/* PENCIL ICON - Right side */}
          <div className="absolute top-12 right-8">
            <div className="relative animate-pulse" style={{ animationDuration: '2.5s' }}>
              <div className="transform rotate-12">
                {/* Pencil body */}
                <div className="w-20 h-4 bg-gradient-to-r from-purple-400 to-purple-600 shadow-md">
                  {/* Wooden details */}
                  <div className="absolute left-6 top-0.5 w-10 h-0.5 bg-purple-300 opacity-60"></div>
                  <div className="absolute left-6 bottom-0.5 w-10 h-0.5 bg-purple-300 opacity-60"></div>
                  <div className="absolute left-8 top-1.5 w-8 h-1 bg-purple-500 opacity-40"></div>
                </div>
                {/* Wooden tip */}
                <div className="absolute right-0 top-0 w-0 h-0 border-l-6 border-t-2 border-b-2 border-l-orange-300 border-t-transparent border-b-transparent"></div>
                {/* Lead tip */}
                <div className="absolute right-0 top-1.5 w-1.5 h-1 bg-gray-800"></div>
                {/* Eraser ferrule */}
                <div className="absolute left-0 top-0 w-3 h-4 bg-yellow-400"></div>
                {/* Eraser */}
                <div className="absolute -left-2 top-0.5 w-2 h-3 bg-pink-300"></div>
              </div>
              
              {/* Writing effect */}
              <div className="absolute -bottom-6 right-4 w-8 h-0.5 bg-purple-400 opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute -bottom-8 right-2 w-6 h-0.5 bg-purple-300 opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute -bottom-10 right-6 w-4 h-0.5 bg-purple-200 opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              
              {/* Creative sparks */}
              <div className="absolute -top-2 right-2 w-1 h-1 bg-white transform rotate-45 animate-bounce" style={{ animationDelay: '0.8s' }}></div>
              <div className="absolute top-8 -right-3 w-1.5 h-1.5 bg-purple-400 transform rotate-45 animate-bounce" style={{ animationDelay: '1.2s' }}></div>
            </div>
          </div>

          {/* Central connecting elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Central diamond */}
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 via-purple-500 to-white transform rotate-45 animate-pulse shadow-lg shadow-purple-500/50" style={{ animationDuration: '3s' }}></div>
            
            {/* Connection lines - static */}
            <div className="absolute w-24 h-0.5 bg-gradient-to-r from-purple-400 via-transparent to-purple-400 opacity-50" style={{ left: '-48px' }}></div>
            <div className="absolute w-24 h-0.5 bg-gradient-to-l from-purple-400 via-transparent to-purple-400 opacity-50" style={{ right: '-48px' }}></div>
            <div className="absolute h-16 w-0.5 bg-gradient-to-b from-purple-400 via-transparent to-purple-400 opacity-50" style={{ top: '-32px' }}></div>
            <div className="absolute h-16 w-0.5 bg-gradient-to-t from-purple-400 via-transparent to-purple-400 opacity-50" style={{ bottom: '-32px' }}></div>
          </div>
        </div>
      </div>

      {/* Floating educational particles - no rotation */}
      <div className="absolute inset-0">
        {/* Small video screens floating */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`video-${i}`}
            className="absolute animate-float"
            style={{
              top: `${15 + Math.random() * 70}%`,
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 800}ms`,
              animationDuration: '4s'
            }}
          >
            <div className="w-3 h-2 bg-purple-400 opacity-50 animate-pulse">
              <div className="absolute inset-0.5 bg-purple-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0 h-0 border-l-0.5 border-t-0.25 border-b-0.25 border-l-white border-t-transparent border-b-transparent"></div>
              </div>
            </div>
          </div>
        ))}

        {/* Small books floating */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`book-${i}`}
            className="absolute animate-bounce"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${15 + Math.random() * 70}%`,
              animationDelay: `${i * 1200}ms`,
              animationDuration: '3s'
            }}
          >
            <div className="w-2 h-3 bg-white opacity-60 animate-pulse">
              <div className="absolute left-0 top-0 w-0.25 h-3 bg-purple-500"></div>
            </div>
          </div>
        ))}

        {/* Small pencils floating */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`pencil-${i}`}
            className="absolute animate-pulse"
            style={{
              top: `${25 + Math.random() * 50}%`,
              left: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 1500}ms`,
              animationDuration: '2s'
            }}
          >
            <div className="w-4 h-0.5 bg-purple-400 opacity-50">
              <div className="absolute right-0 top-0 w-0 h-0 border-l-0.5 border-t-0.25 border-b-0.25 border-l-orange-300 border-t-transparent border-b-transparent"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="relative w-64 h-3 bg-gray-800" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)' }}>
          <div className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-white animate-pulse" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-white animate-ping opacity-30" style={{ animationDuration: '3s' }}></div>
        </div>
        
        {/* Static progress indicators */}
        <div className="absolute -top-3 left-16 w-2 h-2 bg-white transform rotate-45 animate-bounce" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute -top-3 left-32 w-2 h-2 bg-purple-400 transform rotate-45 animate-bounce" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}></div>
        <div className="absolute -top-3 right-16 w-2 h-2 bg-white transform rotate-45 animate-bounce" style={{ animationDuration: '1.5s', animationDelay: '0.6s' }}></div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/15 via-transparent to-transparent pointer-events-none"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingComponent;