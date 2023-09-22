const express = require("express");
const router = express.Router();
const TestController = require("../../Controllers/TestController");
const upload = require("../../Middleware/upload");
const verifyToken = require("../../Middleware/Auth");
const { Validation } = require("../../Middleware/Validate");

router.post(
  "/addtest",
  verifyToken,
  upload.fields([
    {
      name: "testfile",
      maxCount: 1,
    },
  ]),
  TestController.AddTest
);

router.get("/getalltest", verifyToken, TestController.GetAllTest);

module.exports = router;
