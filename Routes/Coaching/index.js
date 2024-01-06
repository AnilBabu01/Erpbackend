const express = require("express");
const router = express.Router();
const CoachingController = require("../../Controllers/CoachingController");
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
  CoachingController.Register
);
router.post("/login", CoachingController.Loging);

router
  .route("/enquiry", verifyToken)
  .post(verifyToken, CoachingController.Addenquiry)
  .get(verifyToken, CoachingController.Getallenquuiry)
  .put(verifyToken, CoachingController.UpdateEnquiry)
  .delete(verifyToken, CoachingController.DeleteEnquiry);

router
  .route("/batch", verifyToken)
  .post(verifyToken, CoachingController.Addbatch)
  .get(verifyToken, CoachingController.Getbatch)
  .put(verifyToken, CoachingController.Updatebatch)
  .delete(verifyToken, CoachingController.Deletebatch);

router
  .route("/getcurrentyear", verifyToken)
  .get(verifyToken, CoachingController.GetCurrentYear);

module.exports = router;
