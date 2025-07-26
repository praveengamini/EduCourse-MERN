const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentDetails, unenrollStudentFromCourse} = require('../../controllers/admin/student_data_Controller');

// GET /api/students - Get all students with pagination and filtering
router.get('/', getAllStudents);

// GET /api/students/:studentId - Get student details with enrolled courses
router.get('/:studentId', getStudentDetails);

// DELETE /api/students/:studentId/courses/:courseId - Unenroll student from course
router.delete('/:studentId/courses/:courseId', unenrollStudentFromCourse);

module.exports = router;