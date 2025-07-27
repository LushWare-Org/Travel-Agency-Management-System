// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Agency = require('../models/AgencyProfile');
const auth = require('../middleware/auth');
const { sendEmail } = require('../utils/emailService');


router.get('/me', auth, async (req, res) => {
  try {
    console.log('DEBUG - Fetching user with ID:', req.user.userId);
    
    const user = await User.findById(req.user.userId)
      .select('-password');

    console.log('DEBUG - User data:', {
      id: user?._id,
      email: user?.email,
      role: user?.role
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user); 
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/me', auth, async (req, res) => {
  try {

    const updates = {};
    const { email, password } = req.body;

    if (email) {
      // you might want extra validation here (regex, uniqueness, etc.)
      updates.email = email;
    }
    if (password) {
      // 🔒 Hash the new password
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    // Find the user by ID from auth middleware, apply updates, and return the new doc
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password'); // omit password in response

    res.json(updatedUser);
  } catch (err) {
    console.error('PUT /users/me error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user by ID
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 }); // Sort by creation date in descending order
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin route to delete a user by ID
router.delete('/:userId', auth, async (req, res) => {
  try {
    // Check if user is admin
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to perform this action' });
    }

    const user = await User.findByIdAndDelete(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin route to update a user's role
router.put('/:userId/role', auth, async (req, res) => {
  try {
    const { role } = req.body;
    
    // Check if user is admin
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to perform this action' });
    }
    
    // Validate role
    if (!['agent', 'admin', 'pending'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Send email notification if role is changed to agent
    if (role === 'agent') {
      await sendEmail('agentApproval', user.email);
    }
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user details with agency information
router.get('/:userId/details', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find associated agency
    const agency = await Agency.findOne({ user: user._id });
    
    res.json({
      user,
      agency: agency || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Maintenance route to fix agency profile 
router.post('/fix-agency-refs', auth, async (req, res) => {
  try {
    // Only allow admins to run this
    const currentUser = await User.findById(req.user.userId);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    console.log('DEBUG - Starting agency profile reference fix');
    const users = await User.find().select('-password');
    
    let fixed = 0;
    for (const user of users) {
      if (user.agencyProfile) continue;

      // Try to find an agency profile for the user
      const agencyProfile = await Agency.findOne({ user: user._id });
      if (agencyProfile) {
        console.log('DEBUG - Found missing agency profile reference:', {
          userId: user._id,
          agencyProfileId: agencyProfile._id
        });
        await User.findByIdAndUpdate(user._id, { agencyProfile: agencyProfile._id });
        fixed++;
      }
    }

    console.log('DEBUG - Fixed agency profile references:', {
      totalUsers: users.length,
      fixedCount: fixed
    });

    res.json({ 
      msg: `Fixed ${fixed} user(s) with missing agency profile references`,
      totalUsers: users.length,
      fixedCount: fixed
    });
  } catch (err) {
    console.error('Error fixing agency profile references:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
