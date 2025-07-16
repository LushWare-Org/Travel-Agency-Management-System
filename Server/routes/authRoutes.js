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
      username,
      email,
      password,
      agencyName,
      corporateName,
      taxRegistrationNo,
      contactPerson,
      address,
      city,
      zipCode,
      stateProvince,
      country,
      phoneNumber,
      phoneNumber2,
      mobilePhone,
      fax,
      invoicingContact,
      billingAgencyName,
      billingEmail,
      billingAddress,
      billingCity,
      billingZipCode,
      billingStateProvince,
      billingCountry,
      billingPhoneNumber,
      remarks
    } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    // 1) Create user
    const hash = await bcrypt.hash(password, salt);    
    user = new User({
      email,
      password: hash, 
      role: 'pending'
    });
    await user.save();

    // 2) Create agency profile
    const profile = new AgencyProfile({
      user: user._id,
      username,
      agencyName,
      corporateName,
      taxRegistrationNo,
      contactPerson,
      address: { street: address, city, zipCode: billingZipCode, state: stateProvince, country },
      phoneNumber,
      phoneNumber2,
      mobilePhone,
      fax,
      invoicingContact,
      billingAgencyName,
      billingEmail,
      billingAddress: { street: billingAddress, city: billingCity, zipCode: billingZipCode, state: billingStateProvince, country: billingCountry },
      billingPhoneNumber,
      remarks
    });
    
    console.log('DEBUG - Creating agency profile:', {
      userId: user._id,
      agencyName,
      taxRegistrationNo,
      country: address?.country
    });
    
    await profile.save();

    // Update user with agency profile reference
    user.agencyProfile = profile._id;
    await user.save();

    console.log('DEBUG - Updated user with agency profile:', {
      userId: user._id,
      agencyProfileId: profile._id
    });

    // 3) Send email notification to admin
    try {
      await sendNewUserNotification(user, profile);
      console.log('Admin notification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Continue with registration process even if email fails
    }

    res.status(201).json({ msg: 'User registered successfully' });
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

    // Check if user is pending
    if (user.role === 'pending') {
      return res.status(403).json({ 
        msg: 'Your account is pending approval. Please wait for admin approval before logging in.',
        status: 'pending'
      });
    }

    const payload = { userId: user.id, role: user.role, email: email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    // Set token in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
    });
    
    res.json({ msg: 'Logged in successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 3600000,
    });

    return res.json({ msg: 'Token refreshed!' });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;