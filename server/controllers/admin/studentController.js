const UserModel = require('../../models/User');
const CourseModel = require('../../models/CourseModel');
const EnrolledCourseModel = require('../../models/EnrolledCourseModel');
const ProgressModel = require('../../models/ProgressModel');

const getAllStudents = async (req, res) => {
  try {
    const students = await UserModel.find({ role: 'student' }).select('_id userName email');
    res.status(200).json({ students });
  } catch (err) {
    console.error('Get all students error:', err);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

const getStudentEnrolledCourses = async (req, res) => {
  
  try {
    const { studentId } = req.query;
    const user = await UserModel.findById(studentId);
    if (!user) return res.status(404).json({ message: 'Student not found' });

    const enrolledCourses = await EnrolledCourseModel.find({ userId: studentId })
      .populate('courseId');

    if (!enrolledCourses || enrolledCourses.length === 0) {
      return res.status(200).json({ enrolledCourses: [], message: 'Student not enrolled in any course' });
    }

    res.status(200).json({ enrolledCourses });
  } catch (err) {
    console.error('Get student enrolled courses error:', err);
    res.status(500).json({ message: 'Server error fetching enrolled courses' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await UserModel.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ student });
  } catch (err) {
    console.error('Get student by ID error:', err);
    res.status(500).json({ message: 'Server error fetching student' });
  }
};

const enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const student = await UserModel.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const course = await CourseModel.findById(courseId).populate('videos');
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const alreadyEnrolled = await EnrolledCourseModel.findOne({ userId: studentId, courseId });
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }

    const progressEntries = await Promise.all(
      course.videos.map(video =>
        ProgressModel.create({
          videoId: video._id,
          watchedDuration: 0,
          totalDuration: video.duration,
          percentage: 0
        })
      )
    );

    const progressIds = progressEntries.map(p => p._id);

    const enrolledCourse = await EnrolledCourseModel.create({
      userId: studentId, 
      courseId,
      progress: progressIds,
      isCompleted: false,
      certificateIssued: false
    });

    res.status(201).json({ message: 'Student enrolled successfully', enrolledCourse });

  } catch (err) {
    console.error('Enroll student error:', err);
    res.status(500).json({ message: 'Server error enrolling student' });
  }
};

module.exports = {
  getAllStudents,
  getStudentEnrolledCourses,
  enrollStudent,
  getStudentById
};

