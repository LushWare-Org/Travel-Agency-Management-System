const ActivityBooking = require('../models/ActivityBooking');
const Activity = require('../models/Activity');
const User = require('../models/User');

// @desc    Create a new activity booking
// @route   POST /api/activity-bookings
// @access  Private
exports.createActivityBooking = async (req, res) => {
  try {
    const {
      activityId,
      customerDetails,
      bookingDetails,
      pricing
    } = req.body;

    console.log('Creating activity booking with data:', req.body);
    console.log('User from auth:', req.user);

    // Validate activity exists
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
    }

    // Check if activity is active
    if (activity.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Activity is not available for booking'
      });
    }

    // Validate guest count doesn't exceed max participants
    if (bookingDetails.guests > activity.maxParticipants) {
      return res.status(400).json({
        success: false,
        error: `Maximum ${activity.maxParticipants} participants allowed for this activity`
      });
    }

    // Generate unique booking reference
    const bookingReference = `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Calculate total price
    const totalPrice = pricing.pricePerPerson * bookingDetails.guests;

    // For mock authentication, we'll use a default user ID or create one
    let userId = req.user.userId;
    if (userId === 'mock-user-id') {
      // Try to find an existing user or use the mock ID
      const mockUser = await User.findOne({ email: 'mock@admin.com' });
      if (mockUser) {
        userId = mockUser._id;
      } else {
        // Create a mock user if it doesn't exist
        const newMockUser = new User({
          username: 'Mock Admin',
          email: 'mock@admin.com',
          password: 'mock-password',
          role: 'admin'
        });
        await newMockUser.save();
        userId = newMockUser._id;
      }
    }

    const activityBooking = new ActivityBooking({
      activity: activityId,
      user: userId,
      bookingReference,
      customerDetails,
      bookingDetails,
      pricing: {
        pricePerPerson: pricing.pricePerPerson,
        totalPrice
      }
    });

    await activityBooking.save();

    // Populate the booking with activity and user details
    const populatedBooking = await ActivityBooking.findById(activityBooking._id)
      .populate('activity', 'title location duration price image')
      .populate('user', 'email username');

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (err) {
    console.error('Error creating activity booking:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};

// @desc    Get all activity bookings (Admin only)
// @route   GET /api/activity-bookings
// @access  Private (Admin)
exports.getAllActivityBookings = async (req, res) => {
  try {
    const { status, startDate, endDate, activityId } = req.query;
    
    let query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by activity
    if (activityId) {
      query.activity = activityId;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query['bookingDetails.date'] = {};
      if (startDate) query['bookingDetails.date'].$gte = new Date(startDate);
      if (endDate) query['bookingDetails.date'].$lte = new Date(endDate);
    }

    const bookings = await ActivityBooking.find(query)
      .populate('activity', 'title location duration price image type')
      .populate('user', 'email username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    console.error('Error fetching activity bookings:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get activity bookings for logged-in user
// @route   GET /api/activity-bookings/my
// @access  Private
exports.getMyActivityBookings = async (req, res) => {
  try {
    let userId = req.user.userId;
    
    // Handle mock authentication
    if (userId === 'mock-user-id') {
      const mockUser = await User.findOne({ email: 'mock@admin.com' });
      if (mockUser) {
        userId = mockUser._id;
      } else {
        // Return empty array if no mock user exists yet
        return res.status(200).json({
          success: true,
          count: 0,
          data: []
        });
      }
    }

    const bookings = await ActivityBooking.find({ user: userId })
      .populate('activity', 'title location duration price image type')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    console.error('Error fetching user activity bookings:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single activity booking by ID
// @route   GET /api/activity-bookings/:id
// @access  Private
exports.getActivityBookingById = async (req, res) => {
  try {
    const booking = await ActivityBooking.findById(req.params.id)
      .populate('activity')
      .populate('user', 'email username');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Activity booking not found'
      });
    }

    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    console.error('Error fetching activity booking:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update activity booking status (Admin only)
// @route   PUT /api/activity-bookings/:id
// @access  Private (Admin)
exports.updateActivityBooking = async (req, res) => {
  try {
    const { status, paymentStatus, notes } = req.body;

    const booking = await ActivityBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Activity booking not found'
      });
    }

    // Update fields if provided
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (notes !== undefined) booking.notes = notes;

    await booking.save();

    // Populate and return updated booking
    const updatedBooking = await ActivityBooking.findById(booking._id)
      .populate('activity', 'title location duration price image type')
      .populate('user', 'email username');

    res.status(200).json({
      success: true,
      data: updatedBooking
    });
  } catch (err) {
    console.error('Error updating activity booking:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete activity booking (Admin only)
// @route   DELETE /api/activity-bookings/:id
// @access  Private (Admin)
exports.deleteActivityBooking = async (req, res) => {
  try {
    const booking = await ActivityBooking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Activity booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Error deleting activity booking:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Cancel activity booking (User or Admin)
// @route   PUT /api/activity-bookings/:id/cancel
// @access  Private
exports.cancelActivityBooking = async (req, res) => {
  try {
    const booking = await ActivityBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Activity booking not found'
      });
    }

    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'Completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel completed booking'
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    const updatedBooking = await ActivityBooking.findById(booking._id)
      .populate('activity', 'title location duration price image type')
      .populate('user', 'email username');

    res.status(200).json({
      success: true,
      data: updatedBooking
    });
  } catch (err) {
    console.error('Error cancelling activity booking:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get activity booking statistics (Admin only)
// @route   GET /api/activity-bookings/stats
// @access  Private (Admin)
exports.getActivityBookingStats = async (req, res) => {
  try {
    const totalBookings = await ActivityBooking.countDocuments();
    const pendingBookings = await ActivityBooking.countDocuments({ status: 'Pending' });
    const confirmedBookings = await ActivityBooking.countDocuments({ status: 'Confirmed' });
    const cancelledBookings = await ActivityBooking.countDocuments({ status: 'Cancelled' });
    const completedBookings = await ActivityBooking.countDocuments({ status: 'Completed' });

    // Calculate total revenue from confirmed and completed bookings
    const revenueBookings = await ActivityBooking.find({ 
      status: { $in: ['Confirmed', 'Completed'] } 
    });
    const totalRevenue = revenueBookings.reduce((sum, booking) => sum + booking.pricing.totalPrice, 0);

    // Get bookings by activity type
    const bookingsByActivity = await ActivityBooking.aggregate([
      {
        $lookup: {
          from: 'activities',
          localField: 'activity',
          foreignField: '_id',
          as: 'activityData'
        }
      },
      {
        $unwind: '$activityData'
      },
      {
        $group: {
          _id: '$activityData.type',
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.totalPrice' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        completedBookings,
        totalRevenue,
        bookingsByActivity
      }
    });
  } catch (err) {
    console.error('Error fetching activity booking stats:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
