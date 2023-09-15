const express = require("express");
const router = express.Router();
const AdminAuthController = require("../../Controllers/AdminController");
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
  AdminAuthController.Register
);
router.post("/login", AdminAuthController.Loging);

router
  .route(
    "/createtypeoforganization",
    AdminAuthController.Createtypeoforganization
  )
  .post(AdminAuthController.Createtypeoforganization)
  .get(AdminAuthController.gettypeoforganization)
  .put(AdminAuthController.Updatetypeoforganization)
  .delete(AdminAuthController.deletetypeoforganization);

module.exports = router;
