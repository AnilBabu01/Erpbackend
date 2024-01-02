const express = require("express");
const router = express.Router();
const ClientAuthController = require("../../Controllers/ClientAuthController");
const verifyToken = require("../../Middleware/Auth");
const { Validation } = require("../../Middleware/Validate");

router
  .route("/emailverification")
  .post(ClientAuthController.getotponEmail)
  .put(ClientAuthController.VerifyEmail);

router
  .route("/phondverification")
  .post(ClientAuthController.getotponPhone)
  .put(ClientAuthController.VerifyPhone);

router
  .route("/GetforgetOtpEmail")
  .post(ClientAuthController.GetforgetOtpEmail)
  .put(ClientAuthController.Changepassword);

router
  .route("/GetforgetOtpPhone")
  .post(ClientAuthController.GetforgetOtpPhone)
  .put(ClientAuthController.Changepassword);

module.exports = router;
