const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multer');
const { addCourse } = require('../../controllers/admin/adminController');
const { getAllCourses, getCourseById } = require('../../controllers/admin/courseController');
const {getAllStudents, getStudentEnrolledCourses,enrollStudent,getStudentById } = require('../../controllers/admin/studentController');

router.get('/courses', getAllCourses);
router.get('/course/:id', getCourseById);
router.get('/students', getAllStudents);
router.get('/student/enrolledcourses',getStudentEnrolledCourses);
router.post('/enroll-student',enrollStudent);
router.get('/student/:id', getStudentById);
router.post('/add-course',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'pdfs' },
    { name: 'videos' }
  ]),
  addCourse
);

module.exports = router;
