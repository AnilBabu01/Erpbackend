const express = require("express");
const router = express.Router();
const CommanController = require("../../Controllers/CommanController");
const upload = require("../../Middleware/upload");
const verifyToken = require("../../Middleware/Auth");
const { Validation } = require("../../Middleware/Validate");

router.post(
  "/createemployee",
  verifyToken,
  upload.single("profileurl"),
  CommanController.RegisterEmployee
);
router.post("/employeelogin", CommanController.Logingemployee);
router.put("/updateemployee", verifyToken, CommanController.UpdateEmployee);
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

module.exports = router;
