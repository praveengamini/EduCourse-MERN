import React, { useState } from 'react';
import { Search } from 'lucide-react';

const Hero = ({ onGetStartedClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const trendingKeywords = [
    'Web Designing', 'UI/UX Designing', 'App Script'
  ];

  return (
    <section id="home" className="pt-16 min-h-screen bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-gray-700 rounded-full opacity-30"></div>
      <div className="absolute top-40 right-20 w-24 h-24 border border-gray-700 rounded-full opacity-20"></div>
      <div className="absolute bottom-40 left-1/4 w-16 h-16 border border-gray-700 rounded-full opacity-25"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Explore Over
                <br />
                <span className="text-purple-400">5,000+ Courses</span>
                <br />
                Grow your skills
              </h1>
              <p className="text-l text-gray-300 leading-relaxed max-w-lg">
                We collaborate to ensure every student achieves academic, social, and emotional
                success by working together and providing comprehensive support. 
              </p>
            </div>

            {/* Trending Keywords */}
            <div className="space-y-3">
              <p className="text-white text-xl">Trending Courses</p>
              <div className="flex flex-wrap gap-3">
                {trendingKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            {/* <div className="relative max-w-lg">
              <div className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="What do you want to learn today?"
                  className="flex-1 bg-white text-black px-6 py-4 rounded-l-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-purple-600 text-white px-8 py-4 rounded-r-full hover:bg-purple-700 transition-colors flex items-center">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div> */}
          </div>

          {/* Hero Image */}
          <div className="relative flex justify-center items-start h-[400px] md:h-[500px]">
            {/* Person image */}
            <img
              src="/assets/person.png"
              alt="Hero person"
              className="relative z-10 w-3/4 max-w-sm md:max-w-md"
            />  

            {/* Thread image positioned above the person's head */}
            <img
              src="/assets/thread.png"
              alt="Decorative thread"
              className="absolute z-20 w-[300px] -top-10 -left-10 md:w-[700px] md:-top-20 md:-left-20 pointer-events-none select-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
