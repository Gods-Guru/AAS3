const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, verifyOtp, clearFirstLoginFlag } = require('../controllers/authController');

// Route to register a new user
router.post('/register', registerUser);

// Route to login a user
router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

router.post('/verify-otp', verifyOtp);

router.patch('/clear-first-login', clearFirstLoginFlag);

module.exports = router;