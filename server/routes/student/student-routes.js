const express = require("express");
const { sendEmail } = require("../../controllers/student/sendMail.js");
const {courseToStudent} = require("../../controllers/student/CourseToStudent.js");
const {progressController,courseCompletedProgress,getProgress,completedVideos} = require("../../controllers/student/ProgressController.js")

const router = express.Router();
router.post("/sendEmail", sendEmail);
router.get('/courseToStudent',courseToStudent);
router.post("/progress",progressController);
router.get("/progress",getProgress);
router.post("/complete",courseCompletedProgress);
router.get("/progress/completed",completedVideos);
module.exports = router;
