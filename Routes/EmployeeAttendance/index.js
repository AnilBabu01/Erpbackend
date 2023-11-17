const express = require("express");
const router = express.Router();
const AttendanceController = require("../../Controllers/EmployeeAttendanceController");
const upload = require("../../Middleware/upload");
const verifyToken = require("../../Middleware/Auth");

const { Validation } = require("../../Middleware/Validate");

router
  .route("/attendance", verifyToken)
  .post(verifyToken, AttendanceController.MarkEmployeeAttendance)
  .put(verifyToken, AttendanceController.DoneEmployeeAttendance);

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

module.exports = router;
