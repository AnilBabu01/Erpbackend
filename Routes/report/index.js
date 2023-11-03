const express = require("express");
const router = express.Router();
const ReportController = require("../../Controllers/ReportController");
const upload = require("../../Middleware/upload");
const verifyToken = require("../../Middleware/Auth");

const { Validation } = require("../../Middleware/Validate");

router.get(
  "/cochingmonthlyfee",
  verifyToken,
  ReportController.getMonthlyCoachingFee
);

module.exports = router;
