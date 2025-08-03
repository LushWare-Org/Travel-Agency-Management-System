const ActivityBooking = require('../models/ActivityBooking');
const Activity = require('../models/Activity');
const User = require('../models/User');

// @desc    Create a new activity booking
// @route   POST /api/activity-bookings
// @access  Public for inquiries, Private for bookings
exports.createActivityBooking = async (req, res) => {
  try {
    const {
      activityId,
      type = 'inquiry', // Default to inquiry if not specified
      customerDetails,
      bookingDetails,
      pricing
    } = req.body;

    console.log('Creating activity booking with data:', req.body);
    console.log('User from auth:', req.user);

    // Check authentication requirement based on type
    if (type === 'booking' && !req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required for bookings'
      });
    }

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
    const bookingReference = type === 'inquiry' 
      ? `INQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      : `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Calculate total price
    const totalPrice = pricing.pricePerPerson * bookingDetails.guests;

    // Handle user ID for authenticated and non-authenticated requests
    let userId = null;
    
    if (req.user) {
      // User is authenticated
      userId = req.user.userId;
      
      // Handle mock authentication if needed
      if (userId === 'mock-user-id') {
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
    } else {
      // For inquiries without authentication, create a guest user or use null
      // We'll store customer details in the booking itself
      userId = null;
    }

    const activityBooking = new ActivityBooking({
      activity: activityId,
      user: userId, // Can be null for inquiries
      bookingReference,
      type,
      customerDetails,
      bookingDetails,
      pricing: {
        pricePerPerson: pricing.pricePerPerson,
        totalPrice
      }
    });

    await activityBooking.save();

    // Populate the booking with activity and user details (user might be null)
    const populatedBooking = await ActivityBooking.findById(activityBooking._id)
      .populate({
        path: 'activity',
        select: 'title location duration price image type description shortDescription maxParticipants'
      })
      .populate({
        path: 'user',
        select: 'email username firstName lastName',
        // Allow null values
        match: { _id: { $ne: null } }
      });

    console.log('Created activity booking:', JSON.stringify(populatedBooking, null, 2));

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
    const { status, startDate, endDate, activityId, type } = req.query;
    
    let query = {};
    
    // Filter by type
    if (type) {
      query.type = type;
    }
    
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
      .populate({
        path: 'activity',
        select: 'title location duration price image type description shortDescription maxParticipants'
      })
      .populate({
        path: 'user',
        select: 'email username firstName lastName'
      })
      .sort({ createdAt: -1 });

    console.log(`Admin fetched ${bookings.length} activity bookings`);

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
    console.log('=== GET MY ACTIVITY BOOKINGS DEBUG ===');
    console.log('Request user:', req.user);
    console.log('User ID from request:', req.user?.userId);
    
    let userId = req.user.userId;
    
    // Handle mock authentication
    if (userId === 'mock-user-id') {
      const mockUser = await User.findOne({ email: 'mock@admin.com' });
      if (mockUser) {
        userId = mockUser._id;
        console.log('Using mock user ID:', userId);
      } else {
        console.log('No mock user found, returning empty array');
        // Return empty array if no mock user exists yet
        return res.status(200).json({
          success: true,
          count: 0,
          data: []
        });
      }
    }

    console.log('Final user ID for query:', userId);

    const bookings = await ActivityBooking.find({ user: userId })
      .populate({
        path: 'activity',
        select: 'title location duration price image type description shortDescription maxParticipants'
      })
      .sort({ createdAt: -1 });

    console.log(`Found ${bookings.length} activity bookings for user ${userId}`);
    
    // Debug each booking to see what data is included
    if (bookings.length > 0) {
      console.log('Sample booking with activity data:');
      bookings.forEach((booking, index) => {
        console.log(`Booking ${index + 1}:`, {
          id: booking._id,
          reference: booking.bookingReference,
          activityPopulated: !!booking.activity,
          activityTitle: booking.activity?.title,
          activityImage: booking.activity?.image,
          activityLocation: booking.activity?.location,
          date: booking.bookingDetails?.date,
          guests: booking.bookingDetails?.guests,
          totalPrice: booking.pricing?.totalPrice
        });
      });
    } else {
      console.log(`No activity bookings found for user ${userId}`);
      
      // Let's also check if there are any bookings at all in the system
      const totalBookings = await ActivityBooking.countDocuments();
      console.log(`Total activity bookings in database: ${totalBookings}`);
      
      // And check if there are any activities
      const totalActivities = await Activity.countDocuments();
      console.log(`Total activities in database: ${totalActivities}`);
      
      // Check if there are bookings for other users
      const bookingsForOtherUsers = await ActivityBooking.find({ user: { $ne: userId } }).limit(3);
      console.log(`Found ${bookingsForOtherUsers.length} bookings for other users`);
    }

    console.log('=== END DEBUG ===');

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
    // For inquiries without users, only admin can access
    if (booking.user) {
      if (booking.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    } else {
      // For guest inquiries, only admin can access
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
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
    // For inquiries without users, only admin can cancel
    if (booking.user) {
      if (booking.user.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    } else {
      // For guest inquiries, only admin can cancel
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
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

// @desc    Create test activity booking (Development only)
// @route   POST /api/activity-bookings/test
// @access  Private
exports.createTestActivityBooking = async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: 'Test endpoints not available in production'
      });
    }

    // Find first active activity
    const activity = await Activity.findOne({ status: 'active' });
    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'No active activities found to create test booking'
      });
    }

    // Create test booking
    const testBooking = new ActivityBooking({
      activity: activity._id,
      user: req.user.userId,
      bookingReference: `TEST-${Date.now()}`,
      type: 'booking',
      customerDetails: {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890'
      },
      bookingDetails: {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        guests: 2,
        specialRequests: 'Test booking created for development'
      },
      pricing: {
        pricePerPerson: activity.price,
        totalPrice: activity.price * 2
      },
      status: 'Confirmed'
    });

    await testBooking.save();

    // Populate and return
    const populatedBooking = await ActivityBooking.findById(testBooking._id)
      .populate({
        path: 'activity',
        select: 'title location duration price image type description shortDescription maxParticipants'
      })
      .populate({
        path: 'user',
        select: 'email username firstName lastName'
      });

    res.status(201).json({
      success: true,
      message: 'Test booking created successfully',
      data: populatedBooking
    });
  } catch (err) {
    console.error('Error creating test booking:', err);
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
