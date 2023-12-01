const express = require("express");
const router = express.Router();
const AttendanceController = require("../../Controllers/PayrollController");
const upload = require("../../Middleware/upload");
const verifyToken = require("../../Middleware/Auth");

const { Validation } = require("../../Middleware/Validate");

router
  .route("/getMonths", verifyToken)
  .post(verifyToken, AttendanceController.GetPayMonthList);
//   .put(verifyToken, AttendanceController.Updateholiday)
//   .delete(verifyToken, AttendanceController.Deleteholiday);

router
  .route("/payempsalary", verifyToken)
  .post(verifyToken, AttendanceController.PaySalary)
  .get(verifyToken, AttendanceController.GetEmpSalaryList);
//.put(verifyToken, AttendanceController.Updateholiday)
//.delete(verifyToken, AttendanceController.Deleteholiday);

module.exports = router;
