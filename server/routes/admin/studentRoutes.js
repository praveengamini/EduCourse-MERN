const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentDetails } = require('../../controllers/admin/student_data_Controller');

// GET /api/students - Get all students with pagination and filtering
router.get('/', getAllStudents);

// GET /api/students/:studentId - Get student details with enrolled courses
router.get('/:studentId', getStudentDetails);

module.exports = router;