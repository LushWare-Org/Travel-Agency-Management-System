const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createBulkBooking,
  getAllBulkBookings,
  getBulkBookingById,
  getMyBulkBookings,
  updateBulkBooking,
  cancelBulkBooking,
  confirmAllBookings,
  getBulkBookingStatistics,
  deleteBulkBooking
} = require('../controllers/bulkBookingController');

// Create bulk booking
router.post('/', auth, createBulkBooking);

// Get all bulk bookings (admin only)
router.get('/', auth, getAllBulkBookings);

// Get bulk booking statistics (admin only)
router.get('/statistics', auth, getBulkBookingStatistics);

// Get bulk bookings for logged-in user
router.get('/my', auth, getMyBulkBookings);

// Get bulk booking by ID
router.get('/:id', auth, getBulkBookingById);

// Update bulk booking
router.put('/:id', auth, updateBulkBooking);

// Cancel bulk booking
router.put('/:id/cancel', auth, cancelBulkBooking);

// Confirm all bookings in bulk
router.put('/:id/confirm-all', auth, confirmAllBookings);

// Delete bulk booking (admin only)
router.delete('/:id', auth, deleteBulkBooking);

module.exports = router;

