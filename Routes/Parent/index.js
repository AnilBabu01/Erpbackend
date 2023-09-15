const express = require("express");
const router = express.Router();
const ParentController = require("../../Controllers/ParentController");
const upload = require("../../Middleware/upload");
const verifyToken = require("../../Middleware/Auth");

const { Validation } = require("../../Middleware/Validate");

router.post("/login", ParentController.Loging);

router.get("/mychildren", verifyToken, ParentController.getmystudents);

module.exports = router;
