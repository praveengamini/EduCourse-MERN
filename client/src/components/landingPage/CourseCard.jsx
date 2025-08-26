import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const getCourseIcon = (title) => {
    const icons = {
      'design': '🎨',
      'ui': '🎨',
      'ux': '🎨',
      'development': '💻',
      'programming': '💻',
      'software': '💻',
      'web': '💻',
      'security': '🔒',
      'cyber': '🔒',
      'machine': '🤖',
      'ai': '🤖',
      'ml': '🤖',
      'data': '📊',
      'science': '📊',
      'marketing': '📈'
    };

    const lower = title.toLowerCase();
    for (const [key, icon] of Object.entries(icons)) {
      if (lower.includes(key)) return icon;
    }
    return '📚';
  };

  const getCategory = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('design') || lower.includes('ui') || lower.includes('ux')) return 'Design';
    if (lower.includes('development') || lower.includes('programming') || lower.includes('software') || lower.includes('web')) return 'Programming';
    if (lower.includes('security') || lower.includes('cyber')) return 'Security';
    if (lower.includes('machine') || lower.includes('ai') || lower.includes('ml')) return 'AI/ML';
    if (lower.includes('data') || lower.includes('science')) return 'Data';
    return 'General';
  };

  const rating = (Math.random() * (5 - 4) + 4).toFixed(1); // 4.0 - 5.0

  return (
    <div className="bg-[#0f0f0f] border  hover:border-purple-600 border-gray-700 rounded-lg p-5 w-15rem h-15rem text-white font-sans" >

      {/* Top Info */}
      <div className="flex justify-between text-sm text-gray-300 mb-4">
        <div>
          <div className="uppercase text-xs">Course Rating</div>
          <div className="text-white text-sm">★ {rating}</div>
        </div>
        <div>
          {/* <div className="uppercase text-xs">Course Type</div>
          <div className="text-white text-sm">{getCategory(course.title).toUpperCase()}</div> */}
        </div>
        <div className="text-right">
          <div className="uppercase text-xs">Cost</div>
          <div className='flex gap-2'>
            <div className='line-through'>₹ {course.cost*2-1} </div> <span className='text-red-400'> -50%</span>
            <div className="text-green-400 text-sm">₹ {course.cost}</div>
          </div>
        </div>
      </div>

      {/* Title  */}
      <div className="flex items-start space-x-4 mb-3">
        <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center text-2xl">
          {getCourseIcon(course.title)}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white mb-1 overflow-hidden text-ellipsis whitespace-nowrap" style={{ whiteSpace: 'pre' }}>
            {course.title.length <= 30
              ? course.title.padEnd(33, ' ')
              : course.title.slice(0, 30) + '...'}
          </h2>


          <p className="text-sm text-gray-400 line-clamp-2 overflow-hidden">
            Enroll in our {course.title.length <= 30
              ? course.title.padEnd(33, ' ')
              : course.title.slice(0, 30) + '...'} course and master the art of creating intuitive, user-friendly designs.
          </p>
        </div>
      </div>

      <hr className="border-gray-700 my-4" />

      {/* Bottom Row */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400"></span>
        <button
          onClick={()=>navigate(`/student/courses/${course._id}`)}
          className="text-purple-400 hover:text-purple-300 flex items-center space-x-1 cursor-pointer"
        >
          <span className="font-medium">More Details</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};


export default CourseCard;

