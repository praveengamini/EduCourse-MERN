const express = require("express");
const { sendEmail } = require("../../controllers/student/sendMail.js");

const router = express.Router();
router.post("/sendEmail", sendEmail);

module.exports = router;
