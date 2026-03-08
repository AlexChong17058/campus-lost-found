const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const protect = require("../middleware/auth");

// register
router.post("/register", authController.register);

// login
router.post("/login", authController.login);

// forgot password
router.post("/forgot-password", authController.forgotPassword);

// NEW: get current logged-in user
router.get("/me", protect, authController.getMe);

module.exports = router;