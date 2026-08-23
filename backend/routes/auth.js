const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;
    
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email address is already registered' });
      }
      return res.status(400).json({ message: 'Username is already taken' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password is too weak' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      username,
      passwordHash: hashedPassword,
    });
    
    await newUser.save();
    generateTokenAndSetCookie(res, newUser._id);

    const userResponse = { id: newUser._id, fullName: newUser.fullName, username: newUser.username, email: newUser.email, avatar: newUser.avatar };
    res.status(201).json({ user: userResponse });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ $or: [{ username: username }, { email: username }] });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    user.lastLogin = new Date();
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    const userResponse = { id: user._id, fullName: user.fullName, username: user.username, email: user.email, avatar: user.avatar };
    res.json({ user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Forgot Password Flow
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Avoid revealing whether the user exists for security
      return res.json({ message: 'If that email exists, a password reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = await bcrypt.hash(resetToken, 10);
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // In a real app, send email with nodemailer here
    // Example: sendEmail(user.email, resetToken);
    
    res.json({ message: 'If that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ 
      email, 
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user || !(await bcrypt.compare(token, user.resetPasswordToken))) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GitHub OAuth Flow (Placeholder/Mock logic)
router.get('/github/login', (req, res) => {
  // Redirect user to github oauth page
  // res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
  res.json({ message: 'GitHub OAuth URL goes here' });
});

module.exports = router;
