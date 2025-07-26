const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentDetails, unenrollStudentFromCourse} = require('../../controllers/admin/student_data_Controller');
router.get('/', getAllStudents);
router.get('/:studentId', getStudentDetails);
router.delete('/:studentId/courses/:courseId', unenrollStudentFromCourse);

module.exports = router;