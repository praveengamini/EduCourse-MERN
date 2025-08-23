const CourseModel = require('../../models/CourseModel');
const EnrolledCourseModel = require('../../models/EnrolledCourseModel');

const getAllCourses = async (req, res) => {
  try {
    const { title, cost, studentCount } = req.query;
    let query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (cost) {
      if (cost.includes('>') && cost.includes('<')) {
        const [min, max] = cost.match(/\d+/g).map(Number);
        query.cost = { $gt: min, $lt: max };
      } else if (cost.includes('>')) {
        const min = parseInt(cost.match(/\d+/)[0]);
        query.cost = { $gt: min };
      } else if (cost.includes('<')) {
        const max = parseInt(cost.match(/\d+/)[0]);
        query.cost = { $lt: max };
      }
    }

    const allCourses = await CourseModel.find(query).lean();

    const courseIds = allCourses.map(course => course._id);

    const enrollments = await EnrolledCourseModel.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: "$courseId", count: { $sum: 1 } } }
    ]);

    const countMap = {};
    enrollments.forEach(e => {
      countMap[e._id.toString()] = e.count;
    });

    // Attach student count
    const enrichedCourses = allCourses.map(course => {
      const studentCount = countMap[course._id.toString()] || 0;
      return { ...course, studentCount };
    });

    // Filter by studentCount range if needed
    let finalCourses = enrichedCourses;
    if (studentCount) {
      const match = studentCount.match(/\d+/g)?.map(Number);
      if (studentCount.includes('>') && studentCount.includes('<=')) {
        finalCourses = enrichedCourses.filter(
          course => course.studentCount > match[0] && course.studentCount <= match[1]
        );
      } else if (studentCount.includes('<=') && !studentCount.includes('>')) {
        finalCourses = enrichedCourses.filter(course => course.studentCount <= match[0]);
      } else if (studentCount.includes('>') && !studentCount.includes('<=')) {
        finalCourses = enrichedCourses.filter(course => course.studentCount > match[0]);
      }
    }

    res.status(200).json({ success: true, courses: finalCourses });
  } catch (err) {
    console.error("Get all courses error:", err);
    res.status(500).json({ success: false, message: "Server error fetching courses" });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.id)
      .populate({
        path: 'videos',
        select: 'title url duration' 
      });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const studentCount = await EnrolledCourseModel.countDocuments({ 
      courseId: course._id 
    });

    const courseObject = course.toObject();
    
    res.json({ 
      course: { 
        ...courseObject, 
        studentCount 
      } 
    });

  } catch (err) {
    console.error("Get course by ID error:", err);
    res.status(500).json({ message: "Server error fetching course" });
  }
};
const getEnrolledStudentsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const enrollments = await EnrolledCourseModel.find({ courseId })
      .populate('userId', 'userName email phone')
      .populate('certificateId', '_id')
      .populate('progress') // Populate progress to calculate percentage
      .select('-__v');

    if (enrollments.length === 0) {
      return res.status(200).json({ 
        message: 'No students enrolled in this course.', 
        data: [] 
      });
    }

    const formatted = enrollments.map(enroll => {
      // Calculate progress percentage from progress array
      let progressPercentage = 0;
      if (enroll.progress && enroll.progress.length > 0) {
        const totalProgress = enroll.progress.reduce((sum, prog) => sum + (prog.percentage || 0), 0);
        progressPercentage = Math.round(totalProgress / enroll.progress.length);
      }

      return {
        studentId: enroll.userId._id,
        name: enroll.userId.userName,
        email: enroll.userId.email,
        phone: enroll.userId.phone || '',
        progress: enroll.progress, // Keep original progress array for detailed view
        progressPercentage, // Add calculated percentage
        isCompleted: enroll.isCompleted,
        certificateIssued: enroll.certificateIssued,
        certificateId: enroll.certificateId?._id || null,
        enrolledAt: enroll.enrolledAt,
        completedAt: enroll.completedAt,
      };
    });

    res.status(200).json({ 
      message: 'Students fetched successfully',
      data: formatted 
    });

  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ 
      error: 'Server error while fetching enrolled students.',
      details: error.message 
    });
  }
};
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the course
        const course = await CourseModel.findByIdAndDelete(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting course',
            error: error.message
        });
    }
};

module.exports = {
  getAllCourses,
  getCourseById,
  getEnrolledStudentsForCourse,
  deleteCourse

};
