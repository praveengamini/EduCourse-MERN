import Slider from 'react-slick';
import { Video, Clock } from 'lucide-react';
import {  useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CourseCarousel = ({ courses }) => {
     const navigate = useNavigate();
  const settings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="slider-container px-4 pt-6">
      <Slider {...settings}>
        {courses.map((course) => (
          <div key={course._id} className="px-2">
            <div className="bg-[#1f2937] text-white rounded-2xl border border-white/10 shadow-md hover:border-white/20 transition-all duration-300 flex flex-col h-[420px]">
              
              {/* Image */}
              <div className="h-53 w-full overflow-hidden flex-shrink-0">
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col justify-between space-y-3">
                {/* Top Info Section */}
                <div className="flex gap-4">
                  {/* Text Info */}
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-base line-clamp-2">
                    {course.title?.length > 23
                      ? course.title.substring(0, 23) + '...' // Added an ellipsis for truncated titles
                      : course.title}
                  </h4>
                    
                    <div className="text-sm text-gray-300 space-y-1">
                      <div className="flex items-center">
                        <Video size={14} className="mr-2" />
                        <span className="ml-1">{course.totalVideos || course.videos?.length || 0}</span>
                        <span className="ml-1">Videos </span>
                      </div>
                      {course.duration && (
                        <div className="flex items-center">
                          <Clock size={14} className="mr-2" />
                          <span className="ml-1">{course.duration}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm">
                        {course.description?.length > 26
                            ? course.description.substring(0, 26) + '...'
                            : course.description}
                        </p>


                  </div>

                  {/* Progress Circle */}
                  {course.progress !== undefined && (
                    <div className="w-[96px] h-[96px] flex-shrink-0">
                      <CircularProgressbar
                        value={course.progress}
                        text={`${course.progress}%`}
                        styles={buildStyles({
                          textColor: '#ffffff',
                          pathColor: '#8B5CF6',
                          trailColor: '#374151',
                          textSize: '18px',
                          strokeWidth: 8,
                        })}
                      />
                    </div>
                  )}
                </div>

                {/* Button */}
                <div className='mt-auto flex items-start pt-2'
                    onClick={()=>navigate(`/student/courses/${course._id}`)}>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg w-full shadow-md transition cursor-pointer">
                    Continue this Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CourseCarousel;
