const express = require("express");
const { sendEmail } = require("../../controllers/student/sendMail.js");
const {courseToStudent} = require("../../controllers/student/CourseToStudent.js");
const router = express.Router();
router.post("/sendEmail", sendEmail);
router.get('/courseToStudent',courseToStudent);

module.exports = router;
