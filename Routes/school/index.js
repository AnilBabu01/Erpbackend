const express = require("express");
const router = express.Router();
const SchoolController = require("../../Controllers/SchoolController");
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
      name: "adharcard",
      maxCount: 1,
    },
  ]),
  SchoolController.Register
);
router.post("/login", SchoolController.Loging);

router
  .route("/class", verifyToken)
  .post(verifyToken, SchoolController.CreateClass)
  .get(verifyToken, SchoolController.getclass)
  .put(verifyToken, SchoolController.Updateclass)
  .delete(verifyToken, SchoolController.Deleteclass);

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
  SchoolController.updateprofile
);

router
.route("/enquiry", verifyToken)
.post(verifyToken,  SchoolController.Addenquiry)
.get(verifyToken,   SchoolController.Getallenquuiry)
.put(verifyToken, SchoolController.UpdateEnquiry)
.delete(verifyToken,  SchoolController.DeleteEnquiry);
module.exports = router;
