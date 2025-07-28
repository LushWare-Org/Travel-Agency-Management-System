const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// Route to get activity title suggestions (for search bar)
router.get('/suggestions', activityController.getActivitySuggestions);

// Route to get all activities
// Supports query params: type, minPrice, maxPrice, minDuration, maxDuration, location, search, featured, status, sortBy, guests
router.get('/', activityController.getAllActivities);

// Route to get a single activity by ID
router.get('/:id', activityController.getActivityById);

// Route to get bookings for a specific activity
router.get('/:id/bookings', async (req, res) => {
  try {
    const ActivityBooking = require('../models/ActivityBooking');
    const bookings = await ActivityBooking.find({ activity: req.params.id })
      .populate('user', 'email username')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Route to create a new activity (admin only)
router.post('/', activityController.createActivity);

// Route to update an existing activity (admin only)
router.put('/:id', activityController.updateActivity);

// Route to delete an activity (admin only)
router.delete('/:id', activityController.deleteActivity);

module.exports = router;
