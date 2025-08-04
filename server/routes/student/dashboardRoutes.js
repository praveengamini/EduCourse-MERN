const express = require("express");
const dashboardRoutes = require("../../controllers/student/Dashboard");

const router = express.Router();
router.get('/:userId', dashboardRoutes);

module.exports = router;