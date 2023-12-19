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

router
  .route("/holidy", verifyToken)
  .post(verifyToken, AttendanceController.AddHoliday)
  .put(verifyToken, AttendanceController.Updateholiday)
  .delete(verifyToken, AttendanceController.Deleteholiday);

router
  .route("/getholidy", verifyToken)
  .post(verifyToken, AttendanceController.GetHolidays);

router
  .route("/GetStudentTodayAttendance", verifyToken)
  .post(verifyToken, AttendanceController.GetStudentTodayAttendance);

router
  .route("/GetStudentAllMonthAttendance", verifyToken)
  .post(verifyToken, AttendanceController.GetStudentAllMonthAttendance);

router
  .route("/GetStudentByDateAttendance", verifyToken)
  .post(verifyToken, AttendanceController.GetStudentByDateAttendance);


module.exports = router;
