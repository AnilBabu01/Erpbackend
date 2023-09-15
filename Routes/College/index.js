const express = require("express");
const router = express.Router();
const CollegeController = require("../../Controllers/CollegeController");
const upload = require("../../Middleware/upload");
const verifyToken = require("../../Middleware/Auth");
const { Validation } = require("../../Middleware/Validate");

router.post(
  "/register",
  upload.fields([
    {
      name: "profileurl",
      maxCount: 1,
    },
    {
      name: "logourl",
      maxCount: 1,
    },
  ]),
  CollegeController.Register
);
router.post("/login", CollegeController.Loging);

router.post(
  "/updateprofile",
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
  ]),
  CollegeController.updateprofile
);

router
  .route("/enquiry", verifyToken)
  .post(verifyToken, CollegeController.Addenquiry)
  .get(verifyToken, CollegeController.Getallenquuiry)
  .put(verifyToken, CollegeController.UpdateEnquiry)
  .delete(verifyToken, CollegeController.DeleteEnquiry);
module.exports = router;
