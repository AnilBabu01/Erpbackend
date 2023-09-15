const express = require("express");
const router = express.Router();
const GuestController = require("../../Controllers/GuestController");
const verifyToken = require("../../Middleware/Auth");

const { Validation } = require("../../Middleware/Validate");


router.post("/login", GuestController.Guestlogin);


module.exports = router;
