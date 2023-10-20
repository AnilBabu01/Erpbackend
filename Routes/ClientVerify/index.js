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
module.exports = router;
