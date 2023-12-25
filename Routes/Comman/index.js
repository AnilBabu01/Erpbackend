const express = require("express");
const router = express.Router();
const CommanController = require("../../Controllers/CommanController");
const upload = require("../../Middleware/upload");
const verifyToken = require("../../Middleware/Auth");
const { Validation } = require("../../Middleware/Validate");

router.post(
  "/createemployee",
  verifyToken,
  upload.fields([
    {
      name: "profileurl",
      maxCount: 1,
    },
    {
      name: "Aadharurl",
      maxCount: 1,
    },
    {
      name: "Drivingurl",
      maxCount: 1,
    },
    {
      name: "tenurl",
      maxCount: 1,
    },
    {
      name: "twelturl",
      maxCount: 1,
    },
    {
      name: "Graduationurl",
      maxCount: 1,
    },
    {
      name: "PostGraduationurl",
      maxCount: 1,
    },
    {
      name: "Certificate1url",
      maxCount: 1,
    },
    {
      name: "Certificate2url",
      maxCount: 1,
    },
    {
      name: "Certificate3url",
      maxCount: 1,
    },
  ]),
  CommanController.RegisterEmployee
);

router.post("/employeelogin", CommanController.Logingemployee);
router.put(
  "/updateemployee",
  verifyToken,
  upload.fields([
    {
      name: "profileurl",
      maxCount: 1,
    },
    {
      name: "Aadharurl",
      maxCount: 1,
    },
    {
      name: "Drivingurl",
      maxCount: 1,
    },
    {
      name: "tenurl",
      maxCount: 1,
    },
    {
      name: "twelturl",
      maxCount: 1,
    },
    {
      name: "Graduationurl",
      maxCount: 1,
    },
    {
      name: "PostGraduationurl",
      maxCount: 1,
    },
    {
      name: "Certificate1url",
      maxCount: 1,
    },
    {
      name: "Certificate2url",
      maxCount: 1,
    },
    {
      name: "Certificate3url",
      maxCount: 1,
    },
  ]),
  CommanController.UpdateEmployee
);
router.delete("/deleteemployee", verifyToken, CommanController.DeleteEmployee);
router.get("/allemployee", verifyToken, CommanController.Getallemployee);

router.get("/profile", verifyToken, CommanController.Getprofile);

router
  .route("/profile", verifyToken)
  .get(verifyToken, CommanController.Getprofile)
  .put(
    verifyToken,
    upload.fields([
      {
        name: "profileurl",
        maxCount: 1,
      },
      {
        name: "logourl",
        maxCount: 1,
      },
      { name: "certificatelogo", maxCount: 1 },
    ]),
    CommanController.updateprofile
  );

router
  .route("/section", verifyToken)
  .post(verifyToken, CommanController.CreateSection)
  .get(verifyToken, CommanController.getSection)
  .put(verifyToken, CommanController.UpdateSection)
  .delete(verifyToken, CommanController.DeleteSection);

router
  .route("/studentcategory", verifyToken)
  .post(verifyToken, CommanController.CreateStudentCategory)
  .get(verifyToken, CommanController.getStudentCategory)
  .put(verifyToken, CommanController.UpdateStudentCategory)
  .delete(verifyToken, CommanController.DeleteStudentCategory);

router
  .route("/fee", verifyToken)
  .post(verifyToken, CommanController.CreateFee)
  .get(verifyToken, CommanController.getFee)
  .put(verifyToken, CommanController.UpdateFee)
  .delete(verifyToken, CommanController.DeleteFee);

router.get("/allcoaching", CommanController.GetAllCoaching);
router.get("/allschool", CommanController.GetAllSchool);
router.get("/allcollege", CommanController.GetAllCollege);
router.get("/allclient", CommanController.GetAllclient);

router
  .route("/course", verifyToken)
  .post(verifyToken, CommanController.CreateCourse)
  .get(verifyToken, CommanController.getCourse)
  .put(verifyToken, CommanController.UpdateCourse)
  .delete(verifyToken, CommanController.DeleteCourse);

router
  .route("/designation", verifyToken)
  .post(verifyToken, CommanController.CreateDesignation)
  .get(verifyToken, CommanController.getDesignation)
  .put(verifyToken, CommanController.UpdateDesignation)
  .delete(verifyToken, CommanController.DeleteDesignation);

router
  .route("/department", verifyToken)
  .post(verifyToken, CommanController.CreateDepartment)
  .get(verifyToken, CommanController.getDepartment)
  .put(verifyToken, CommanController.UpdateDepartment)
  .delete(verifyToken, CommanController.DeleteDepartment);

router
  .route("/courseduration", verifyToken)
  .post(verifyToken, CommanController.CreateCoursemonth)
  .get(verifyToken, CommanController.getCoursemonth)
  .put(verifyToken, CommanController.UpdateCoursemonth)
  .delete(verifyToken, CommanController.DeleteCoursemonth);

router
  .route("/credentials", verifyToken)
  .get(verifyToken, CommanController.GetCredentials)
  .put(
    verifyToken,
    upload.fields([
      {
        name: "profileurl",
        maxCount: 1,
      },
      {
        name: "logourl",
        maxCount: 1,
      },
      { name: "certificatelogo", maxCount: 1 },
    ]),
    CommanController.updateCredentials
  );

router
  .route("/receiptprefix", verifyToken)
  .post(verifyToken, CommanController.CreateReceiptPrefix)
  .get(verifyToken, CommanController.getReceiptPrefix)
  .put(verifyToken, CommanController.UpdateReceiprefix);

router
  .route("/session", verifyToken)
  .post(verifyToken, CommanController.CreateSession)
  .get(verifyToken, CommanController.getSession)
  .put(verifyToken, CommanController.UpdateSession)
  .delete(verifyToken, CommanController.DeleteSession);

router
  .route("/section", verifyToken)
  .post(verifyToken, CommanController.CreateSection)
  .get(verifyToken, CommanController.getSection)
  .put(verifyToken, CommanController.UpdateSection)
  .delete(verifyToken, CommanController.DeleteSection);

router
  .route("/subject", verifyToken)
  .post(verifyToken, CommanController.CreateSubject)
  .get(verifyToken, CommanController.GetSubject)
  .put(verifyToken, CommanController.UpdateSubject)
  .delete(verifyToken, CommanController.DeleteSubject);

router
  .route("/classsubject", verifyToken)
  .post(verifyToken, CommanController.CreateClassSubject)
  .get(verifyToken, CommanController.getClassSubject)
  .put(verifyToken, CommanController.UpdateClassSubject)
  .delete(verifyToken, CommanController.DeleteClassSubject);

router
  .route("/GetEmpTimeTable", verifyToken)
  .get(verifyToken, CommanController.GetEmpTimeTable);

router
  .route("/footer", verifyToken)
  .post(verifyToken, CommanController.CreateFooterDtails)
  .get(verifyToken, CommanController.getFooterDtails)
  .put(verifyToken, CommanController.UpdateFooterDtails)
  .delete(verifyToken, CommanController.DeleteFooterDtails);

router
  .route("/notes", verifyToken)
  .post(verifyToken, CommanController.CreateBanner)
  .get(verifyToken, CommanController.getBanner)
  .put(verifyToken, CommanController.UpdateBanner)
  .delete(verifyToken, CommanController.DeleteBanner);

router
  .route("/slider", verifyToken)
  .post(
    verifyToken,
    upload.fields([
      {
        name: "ImgUrl",
        maxCount: 1,
      },
    ]),
    CommanController.CreateSlider
  )
  .get(verifyToken, CommanController.GetSlider)
  .put(
    verifyToken,
    upload.fields([
      {
        name: "ImgUrl",
        maxCount: 1,
      },
    ]),
    CommanController.updateSlider
  )
  .delete(verifyToken, CommanController.DeleteSlider);

router
  .route("/GetStudentTimeTable", verifyToken)
  .get(verifyToken, CommanController.GetStudentTimeTable);

router
  .route("/GetParentStudentList", verifyToken)
  .get(verifyToken, CommanController.GetParentStudentList);

router
  .route("/Changepassword", verifyToken)
  .post(verifyToken, CommanController.Changepassword);

router
  .route("/SendemailToStudent", verifyToken)
  .post(verifyToken, CommanController.SendemailToStudent);

router
  .route("/GetSentemailToStudent", verifyToken)
  .post(verifyToken, CommanController.GetSentemailToStudent);

router
  .route("/GetParentStudentListCoacging", verifyToken)
  .get(verifyToken, CommanController.GetParentStudentListCoacging);

module.exports = router;
