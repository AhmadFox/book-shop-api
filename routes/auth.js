const express = require('express');
const router = express.Router();

// Import Controllers:
const { register, login } = require("../controllers/authController");

// Method Chain: /api/books
router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;