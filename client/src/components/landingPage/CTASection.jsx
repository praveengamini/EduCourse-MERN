import React from 'react';

const CTASection = ({ onGetStartedClick }) => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Blurred background image */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: "url('/assets/coursebg.png')", // Replace with actual image path
          filter: 'blur(10px)',
          zIndex: 0,
        }}
      />

      {/* Overlay color with 75% opacity */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(11, 12, 35, 0.75)', // 0B0C23 with 75% opacity
          zIndex: 1,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="space-y-8">
          <h2 className="text-xl lg:text-2xl font-bold leading-tight">
            The Best Choice
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
            Apply for your favorite
            <br />
            Courses Today !
          </h2>

          {/* <button
            onClick={onGetStartedClick}
            className="bg-white text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
          >
            Apply Now
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
