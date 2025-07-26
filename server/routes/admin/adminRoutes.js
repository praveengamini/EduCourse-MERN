const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multer');
const { addCourse,getStats,getGraphStats,getDetailedAnalytics } = require('../../controllers/admin/adminController');
const { getAllCourses, getCourseById } = require('../../controllers/admin/courseController');
const {getAllStudents, getStudentEnrolledCourses,enrollStudent,getStudentById } = require('../../controllers/admin/studentController');

router.get('/courses', getAllCourses);
router.get('/course/:id', getCourseById);
router.get('/students', getAllStudents);
router.get('/student/enrolledcourses',getStudentEnrolledCourses);
router.get('/student/:id', getStudentById);
router.get('/stats', getStats);
router.get('/graph-stats', getGraphStats);
router.get('/detailed-analytics', getDetailedAnalytics);
router.post('/enroll-student',enrollStudent);

router.post('/add-course',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'pdfs' },
    { name: 'videos' }
  ]),
  addCourse
);

module.exports = router;
