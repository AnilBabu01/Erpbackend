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
router.put(
  "/updatetest",
  upload.fields([
    {
      name: "testfile",
      maxCount: 1,
    },
  ]),
  verifyToken,
  TestController.UpdateTest
);
router.delete("/deletetest", verifyToken, TestController.DeleteTest);
router.get("/getstudentalltest", verifyToken, TestController.GetStudentTest);
router.post("/addtestretult", verifyToken, TestController.AddTestResult);
router.post("/checktesttime", verifyToken, TestController.CheckTestTime);
router.post("/studentresult", verifyToken, TestController.GetStudentResult);

module.exports = router;

