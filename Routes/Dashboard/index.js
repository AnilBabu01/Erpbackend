const express = require("express");
const router = express.Router();
const DashboardController = require("../../Controllers/DashboardController");
const verifyToken = require("../../Middleware/Auth");

const { Validation } = require("../../Middleware/Validate");

router.post(
  "/GetAllTotalData",
  verifyToken,
  DashboardController.GetAllTotalData
);

router.post(
  "/GetFeePaidChart",
  verifyToken,
  DashboardController.GetFeePaidChart
);

router.post(
  "/GetExpensesChart",
  verifyToken,
  DashboardController.GetExpensesChart
);

router.post(
  "/GetCoachingAllTotalData",
  verifyToken,
  DashboardController.GetCoachingAllTotalData
);

router.get("/getyearlist", verifyToken, DashboardController.getyearlist);

router.get(
  "/getexpensesyearlist",
  verifyToken,
  DashboardController.getexpensesyearlist
);

router.post(
  "/GetCoachingExpensesChart",
  verifyToken,
  DashboardController.GetCoachingExpensesChart
);

router.post(
  "/GetCoachingFeePaidChart",
  verifyToken,
  DashboardController.GetCoachingFeePaidChart
);

module.exports = router;
