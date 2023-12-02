const express = require("express");
const router = express.Router();
const StudentController = require("../../Controllers/StudentController");
const SchoolStudentController = require("../../Controllers/SchoolStudentController");
const upload = require("../../Middleware/upload");
const verifyToken = require("../../Middleware/Auth");
const { Validation } = require("../../Middleware/Validate");

router
  .route("/addstudent", verifyToken)
  .post(
    verifyToken,
    upload.fields([
      {
        name: "profileurl",
        maxCount: 1,
      },
      {
        name: "adharcard",
        maxCount: 1,
      },
      {
        name: "markSheet",
        maxCount: 1,
      },
      {
        name: "othersdoc",
        maxCount: 1,
      },
      {
        name: "BirthDocument",
        maxCount: 1,
      },
    ]),
    StudentController.Addstudent
  )

  .get(verifyToken, StudentController.getAllStudent)
  .put(
    verifyToken,
    upload.fields([
      {
        name: "profileurl",
        maxCount: 1,
      },
      {
        name: "adharcard",
        maxCount: 1,
      },
      {
        name: "markSheet",
        maxCount: 1,
      },
      {
        name: "othersdoc",
        maxCount: 1,
      },
      {
        name: "BirthDocument",
        maxCount: 1,
      },
    ]),
    StudentController.UpdateStudent
  )
  .delete(verifyToken, StudentController.deleteStudent);
router.post("/login", StudentController.Loging);
router.post("/pacoachingfee", verifyToken, StudentController.addfee);
router.get("/getreceiptdata", verifyToken, StudentController.getReceipt);
router.post("/schoolfee", verifyToken, SchoolStudentController.getSchoolFee);
router.post("/addacadmyfee", verifyToken, StudentController.addSchoolFee);
router.post("/addhostelfee", verifyToken, StudentController.addHostelFee);
router.post("/addtransportfee", verifyToken, StudentController.addTransportFee);
router.post("/changesession", verifyToken, StudentController.ChangeSession);
module.exports = router;
