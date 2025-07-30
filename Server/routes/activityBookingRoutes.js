const express = require('express');
const router = express.Router();
const activityBookingController = require('../controllers/activityBookingController');
const auth = require('../middleware/auth');

// Route to create a new activity booking
router.post('/', auth, activityBookingController.createActivityBooking);

// Route to get all activity bookings (admin only)
router.get('/', auth, activityBookingController.getAllActivityBookings);

// Route to get activity booking statistics (admin only)
router.get('/stats', auth, activityBookingController.getActivityBookingStats);

// Route to get current user's activity bookings
router.get('/my', auth, activityBookingController.getMyActivityBookings);

// Route to get a single activity booking by ID
router.get('/:id', auth, activityBookingController.getActivityBookingById);

// Route to update an activity booking (admin only)
router.put('/:id', auth, activityBookingController.updateActivityBooking);

// Route to cancel an activity booking
router.put('/:id/cancel', auth, activityBookingController.cancelActivityBooking);

// Route to delete an activity booking (admin only)
router.delete('/:id', auth, activityBookingController.deleteActivityBooking);

module.exports = router;
