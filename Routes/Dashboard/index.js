const express = require("express");
const router = express.Router();
const DashboardController = require("../../Controllers/DashboardController");
const verifyToken = require("../../Middleware/Auth");

const { Validation } = require("../../Middleware/Validate");

router.post("/GetAllTotalData", DashboardController.GetAllTotalData);

module.exports = router;
