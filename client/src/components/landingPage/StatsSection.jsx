import React from 'react';
import { Users, BookOpen, Award, Globe } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: <Users className="h-8 w-8 text-purple-400" />,
      title: "Expert Instructors",
      description: "We have the best instructors to teach you and guide you through your learning journey.",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-purple-400" />,
      title: "Best Course Content",
      description: "We offer the best course content that will help you learn and grow your skills.",
    },
    {
      icon: <Award className="h-8 w-8 text-purple-400" />,
      title: "Online Courses",
      description: "We have a wide range of online courses that you can take from anywhere in the world.",
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-400" />,
      title: "Live Students",
      description: "We have thousands of students who are learning and growing their skills with us.",
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-300 hover:border-purple-500 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  {stat.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">{stat.title}</h3>
                  <p className="text-gray-400 text-sm">{stat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
