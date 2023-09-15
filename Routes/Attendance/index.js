const express = require("express");
const router = express.Router();
const AttendanceController = require("../../Controllers/AttendanceController");
const upload = require("../../Middleware/upload");
const verifyToken = require("../../Middleware/Auth");

const { Validation } = require("../../Middleware/Validate");

router
  .route("/attendance", verifyToken)
  .post(verifyToken, AttendanceController.MarkStudentAttendance)
  .put(verifyToken, AttendanceController.DoneStudentAttendance);

router
  .route("/analysisattendance", verifyToken)
  .post(verifyToken, AttendanceController.AttendanceAnalasis);

module.exports = router;
