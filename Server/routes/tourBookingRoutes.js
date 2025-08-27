const express = require('express');
const router = express.Router();
const tourBookingController = require('../controllers/tourBookingController');
const auth = require('../middleware/auth');

// Create a new tour booking (public - no auth required)
router.post('/', tourBookingController.createTourBooking);

// Get all tour bookings (admin only)
router.get('/', auth, tourBookingController.getAllTourBookings);

// Get a single tour booking by ID (admin only)
router.get('/:id', auth, tourBookingController.getTourBookingById);

// Update booking status (admin only)
router.put('/:id/status', auth, tourBookingController.updateBookingStatus);

// Delete a tour booking (admin only)
router.delete('/:id', auth, tourBookingController.deleteTourBooking);

// Get bookings by status (admin only)
router.get('/status/:status', auth, tourBookingController.getBookingsByStatus);

module.exports = router;
