const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AgencyProfile = require('../models/AgencyProfile'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendNewUserNotification } = require('../utils/emailService');

// Register
router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      country,
      phoneNumber,
      password
    } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user = new User({
      firstName,
      lastName,
      email,
      country,
      phoneNumber,
      password: hash
      // role will default to 'user' as per schema
    });
    await user.save();

    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // No longer block login for 'pending' users

    const payload = { userId: user.id, role: user.role, email: email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    // Set token in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 3600000, // 1 hour
    });
    
    res.json({ success: true }); // Simplified response for better UX
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post("/logout", (req, res) => {
  // Clear the auth cookie; include path so it matches the cookie that was set
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    path: '/',
  });
  res.json({ message: "Logged out successfully" });
});

// Token Refresh Route
router.post('/refresh-token', async (req, res) => {
  try {
    // inside router.post('/refresh-token')
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: 'No token provided' });

    let payload;
    try {
      // try normal verify for non-expired tokens
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        // grab payload from the expired token
        payload = jwt.decode(token);
      } else {
        return res.status(401).json({ msg: 'Invalid token' });
      }
    }

    // now payload.userId, payload.email, etc. are available
    const newToken = jwt.sign(
      { userId: payload.userId, role: payload.role, email: payload.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // set the fresh cookie
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 3600000,
    });

    return res.json({ msg: 'Token refreshed!' });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;