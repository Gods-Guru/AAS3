const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Create user (password will be hashed in model's pre-save hook)
    const newUser = await User.create({
      name,
      email,
      password, // plain password – model hashes it
      otp,
      otpExpiresAt,
    });
    console.log('New User Created:', newUser);

    // Send OTP via email
    const html = `
      <h2>Verify Your Email</h2>
      <p>Use the OTP below to verify your account:</p>
      <h3>${otp}</h3>
      <p>This OTP expires in 10 minutes.</p>
    `;

    await sendEmail({ to: email, subject: 'Verify Your Email - AutoHub', html });

    res.status(201).json({ message: 'User registered. Please verify your email with the OTP sent.' });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.password || typeof user.password !== 'string' || !user.password.startsWith('$2')) {
      return res.status(500).json({
        message: 'Stored password is not a valid bcrypt hash. Please reset your password or contact support.'
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const { password: pwd, ...userData } = user.toObject();

    res.status(200).json({ message: 'Login successful', token, user: userData });

  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user with that email found.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const html = `
      <h3>Password Reset Request</h3>
      <p>You requested a password reset. Click the link below:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn’t request this, ignore this email.</p>
    `;

    await sendEmail({ to: user.email, subject: 'Reset Your Password', html });

    res.status(200).json({ message: 'Reset link sent to your email.' });
  } catch (err) {
    console.error('Forgot Password Error: ', err);
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });

    user.password = password; // will be hashed by model hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful. You may now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reset password.' });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired, please request a new one' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;

    await user.save();

    // Generate JWT token and return user data (excluding password)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const { password, ...userData } = user.toObject();

    return res.json({ message: 'Email verified successfully', user: userData, token });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.clearFirstLoginFlag = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isFirstLogin) {
      user.isFirstLogin = false;
      await user.save();
    }

    res.status(200).json({ message: 'First login flag cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user flag' });
  }
};