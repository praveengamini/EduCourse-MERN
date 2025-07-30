const User = require('../../models/User');
const EnrolledCourse = require('../../models/EnrolledCourseModel');
const Course = require('../../models/CourseModel');
const Progress = require('../../models/ProgressModel');

// Get all students with pagination and filtering
const getAllStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      filterBy = 'all' // 'all', 'name', 'email', 'id'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build search query
    let searchQuery = { role: 'student' };
    
    if (search.trim()) {
      switch (filterBy) {
        case 'name':
          searchQuery.userName = { $regex: search, $options: 'i' };
          break;
        case 'email':
          searchQuery.email = { $regex: search, $options: 'i' };
          break;
        case 'id':
          if (search.match(/^[0-9a-fA-F]{24}$/)) {
            searchQuery._id = search;
          }
          break;
        default:
          searchQuery.$or = [
            { userName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ];
          if (search.match(/^[0-9a-fA-F]{24}$/)) {
            searchQuery.$or.push({ _id: search });
          }
      }
    }

    // Get students with pagination
    const students = await User.find(searchQuery)
      .select('_id userName email phone createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get enrolled courses count for each student
    const studentsWithCourseCount = await Promise.all(
      students.map(async (student) => {
        const enrolledCount = await EnrolledCourse.countDocuments({ userId: student._id });
        return {
          ...student,
          enrolledCoursesCount: enrolledCount
        };
      })
    );

    // Get total count for pagination
    const totalStudents = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalStudents / limitNum);

    res.json({
      success: true,
      data: {
        students: studentsWithCourseCount,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalStudents,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Get student details with enrolled courses
const getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get student basic info
    const student = await User.findById(studentId)
      .select('_id userName email phone createdAt role')
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.role !== 'student') {
      return res.status(400).json({
        success: false,
        message: 'User is not a student'
      });
    }

    // Get enrolled courses with course details
    const enrolledCourses = await EnrolledCourse.find({ userId: studentId })
      .populate('courseId', 'title description duration cost coverImage')
      .populate('progress')
      .sort({ enrolledAt: -1 })
      .lean();

    // Calculate progress percentage for each course
    const coursesWithProgress = enrolledCourses.map(enrollment => {
      let progressPercentage = 0;
      
      if (enrollment.progress && enrollment.progress.length > 0) {
        const totalProgress = enrollment.progress.reduce((sum, prog) => sum + prog.percentage, 0);
        progressPercentage = Math.round(totalProgress / enrollment.progress.length);
      }

      return {
        ...enrollment,
        progressPercentage,
        status: enrollment.isCompleted ? 'completed' : 'in-progress'
      };
    });

    // Get total courses statistics
    const totalEnrolled = enrolledCourses.length;
    const totalCompleted = enrolledCourses.filter(course => course.isCompleted).length;
    const totalInProgress = totalEnrolled - totalCompleted;

    res.json({
      success: true,
      data: {
        student,
        enrolledCourses: coursesWithProgress,
        statistics: {
          totalEnrolled,
          totalCompleted,
          totalInProgress
        }
      }
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student details',
      error: error.message
    });
  }
};

// Unenroll student from a course
const unenrollStudentFromCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    const enrollment = await EnrolledCourse.findOne({ 
      userId: studentId, 
      courseId: courseId 
    });
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Student is not enrolled in this course'
      });
    }
    await Progress.deleteMany({ userId : studentId, courseId : courseId });
    await EnrolledCourse.findByIdAndDelete(enrollment._id);
    res.json({
      success: true,
      message: 'Student successfully unenrolled from the course'
    });
  } catch (error) {
    console.error('Error unenrolling student:', error);
    res.status(500).json({
      success: false,
      message: 'Error unenrolling student from course',
      error: error.message
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentDetails,
  unenrollStudentFromCourse
};