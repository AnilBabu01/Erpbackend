const express = require("express");
const router = express.Router();
const BckenupController = require("../../Controllers/BckenupController");
const verifyToken = require("../../Middleware/Auth");

const { Validation } = require("../../Middleware/Validate");

router.post(
  "/GetAllbackdataData",
  verifyToken,
  BckenupController.GetAllbackdataData
);

module.exports = router;
