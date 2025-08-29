const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentDetails, unenrollStudentFromCourse} = require('../../controllers/admin/student_data_Controller');
const {  addStudentByAdmin,changePassword} = require('../../controllers/admin/addStudent-controller')
router.get('', getAllStudents);
router.get('/:studentId', getStudentDetails);
router.delete('/:studentId/courses/:courseId', unenrollStudentFromCourse);
router.post('/add-student',addStudentByAdmin)
router.put('/change-password', changePassword);
module.exports = router;