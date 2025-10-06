// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Agency = require('../models/AgencyProfile');
const Room = require('../models/Room');
const BulkBooking = require('../models/BulkBooking');
const auth = require('../middleware/auth');
const { sendBookingNotification, sendBookingStatusUpdate } = require('../utils/emailService');
const { generateCustomerQuote } = require('../utils/customerQuotePdfGenerator');

// Create a booking request
router.post('/', auth, async (req, res) => {
  try {
    req.body.bookingReference = 'BK-' + Date.now();
    if (!req.body.nights && req.body.checkIn && req.body.checkOut) {
      const checkInDate = new Date(req.body.checkIn);
      const checkOutDate = new Date(req.body.checkOut);
      req.body.nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    }
    if (typeof req.body.rooms === 'undefined' || req.body.rooms === null) {
      req.body.rooms = 1;
    } else {
      req.body.rooms = Number(req.body.rooms);
      if (isNaN(req.body.rooms) || req.body.rooms < 1) req.body.rooms = 1;
    }

    const booking = new Booking({
      ...req.body,
      user: req.user.userId,
    });
    await booking.save();
    
    // Populate hotel, room, and user data with agency profile for notifications
    const populatedBooking = await Booking.findById(booking._id)
      .populate('hotel')
      .populate({
        path: 'room',
        model: 'Room'
      })
      .populate({
        path: 'user',
        model: 'User',
        populate: {
          path: 'agencyProfile',
          model: 'AgencyProfile'
        }
      });

    // Send notifications
    const notificationResult = await sendBookingNotification(populatedBooking);
    
    // Continue with success response even if notifications fail
    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('hotel')
      .populate({
        path: 'room',
        select: '-__v',
      })
      .populate({
        path: 'user',
        model: 'User',
        select: '-password',
        populate: {
          path: 'agencyProfile',
          model: 'AgencyProfile'
        }
      })
      .sort({ createdAt: -1 });

    // Process missing agency profiles
    const bookingsWithAgency = await Promise.all(bookings.map(async (booking) => {
      if (booking.user && !booking.user.agencyProfile) {
        console.log('DEBUG - Missing agency profile for user:', booking.user._id);
        
        // Try to find agency profile directly
        const agencyProfile = await Agency.findOne({ user: booking.user._id });
        if (agencyProfile) {
          console.log('DEBUG - Found agency profile directly:', {
            userId: booking.user._id,
            agencyProfileId: agencyProfile._id,
            agencyName: agencyProfile.agencyName
          });
          
          // Update the user's agencyProfile reference if it's missing
          await User.findByIdAndUpdate(booking.user._id, { agencyProfile: agencyProfile._id });
          
          // Attach the agency profile to the booking response
          booking.user.agencyProfile = agencyProfile;
        }
      }
      return booking;
    }));

    console.log('DEBUG - Final bookings data:', 
      bookingsWithAgency.map(b => ({
        id: b._id,
        userEmail: b.user?.email,
        hasAgencyProfile: !!b.user?.agencyProfile,
        agencyName: b.user?.agencyProfile?.agencyName
      }))
    );

    res.json(bookingsWithAgency);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get bookings for the logged-in user
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('hotel')
      .populate({
        path: 'room',
        select: '-__v'
      })
      .populate({
        path: 'user',
        model: 'User',
        populate: {
          path: 'agencyProfile',
          model: 'AgencyProfile'
        }
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a specific booking by id
router.get('/:id', auth, async (req, res) => {  try {
    console.log('DEBUG - Fetching booking:', req.params.id);
    const booking = await Booking.findById(req.params.id)
      .populate('hotel')
      .populate({
        path: 'room',
        model: 'Room',
        transform: doc => {
          console.log('DEBUG - Populated room data:', doc);
          return doc;
        }
      })
      .populate({
        path: 'user',
        model: 'User',
        populate: {
          path: 'agencyProfile',
          model: 'AgencyProfile'
        }
      });
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a booking (if permitted)
router.put('/:id', auth, async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id)
      .populate({
        path: 'user',
        model: 'User',
        populate: {
          path: 'agencyProfile',
          model: 'AgencyProfile'
        }
      })
      .populate('hotel')
      .populate({
        path: 'room',
        select: '-__v'
      });
    
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    // Check if status is being updated to Confirmed or Modified
    const isStatusUpdate = req.body.status && req.body.status !== booking.status;
    const isConfirmed = req.body.status === 'Confirmed';
    const isModified = req.body.status === 'Modified';
    const isPaid = req.body.status === 'Paid';

    if (isPaid) {
      req.body.paidAt = new Date();
      req.body.amountPaid = req.body.amountPaid || booking.priceBreakdown?.total || 0;
    }

    // Update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    )
    .populate({
      path: 'user',
      model: 'User',
      populate: {
        path: 'agencyProfile',
        model: 'AgencyProfile'
      }
    })
    .populate('hotel')
    .populate({
      path: 'room',
      select: '-__v'
    });

    // Send email notification if status is updated to Confirmed, Modified, or Paid
    if (isStatusUpdate && (isConfirmed || isModified || isPaid)) {
      try {
        console.log('Sending booking status update for:', updatedBooking.bookingReference, 'Status:', updatedBooking.status);
        await sendBookingStatusUpdate(updatedBooking);
      } catch (emailErr) {
        console.error('Error sending status update email:', emailErr);
      }
    }

    res.json(updatedBooking);
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Cancel a booking with detailed cancellation info
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { cancellationReason, cancellationNotes, refundAmount, refundMethod, cancellationFee } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ msg: 'Booking is already cancelled' });
    }

    // Update cancellation details
    booking.status = 'Cancelled';
    booking.cancellationDetails = {
      cancelledBy: req.user.userId,
      cancelledAt: new Date(),
      cancellationReason,
      cancellationNotes,
      refundAmount: refundAmount || 0,
      refundMethod,
      cancellationFee: cancellationFee || 0
    };

    await booking.save();

    // Populate and return updated booking
    const updatedBooking = await Booking.findById(booking._id)
      .populate('hotel')
      .populate('room')
      .populate('user')
      .populate('cancellationDetails.cancelledBy', 'firstName lastName email');

    res.json(updatedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete / Cancel a booking (legacy endpoint - soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ msg: 'Booking is already cancelled' });
    }

    // Soft delete by marking as cancelled
    booking.status = 'Cancelled';
    booking.cancellationDetails = {
      cancelledBy: req.user.userId,
      cancelledAt: new Date(),
      cancellationReason: 'Legacy Delete',
      cancellationNotes: 'Booking cancelled via delete endpoint',
      refundAmount: 0,
      refundMethod: 'No Refund',
      cancellationFee: 0
    };

    await booking.save();
    res.json({ msg: 'Booking cancelled' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Generate customer quote PDF for a confirmed booking
router.post('/:id/customer-quote', auth, async (req, res) => {  
  try {
    const { profitMargin, marginType = 'percentage' } = req.body;
    if (typeof profitMargin !== 'number' || profitMargin < 0) {
      return res.status(400).json({ msg: 'Invalid profit margin' });
    }

    // First get the initial booking data
    const existingBooking = await Booking.findById(req.params.id);
    if (!existingBooking) {
      console.log('DEBUG - Booking not found');
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Get detailed room data
    const roomData = await Room.findById(existingBooking.room).lean();
    if (!roomData) {
      console.log('DEBUG - Room not found:', existingBooking.room);
      return res.status(404).json({ msg: 'Room not found' });
    }

    console.log('DEBUG - Found room with transportations:', {
      roomId: roomData._id,
      hasTransportations: !!roomData.transportations,
      transportCount: roomData.transportations?.length
    });

    // Get the fully populated booking
    const populatedBooking = await Booking.findById(req.params.id)
      .populate('hotel')
      .populate({
        path: 'room',
        model: 'Room',
        select: 'roomName roomType bedType maxOccupancy amenities'
      })
      .populate({
        path: 'user',
        model: 'User',
        populate: {
          path: 'agencyProfile',
          model: 'AgencyProfile'
        }
      })
      .lean();

    if (!populatedBooking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Merge room data to ensure we have all necessary information
    populatedBooking.room = {
      ...populatedBooking.room,
      transportations: roomData.transportations || []
    };

    const agent = {
      name: populatedBooking.user?.agencyProfile?.username || 'N/A',
      agency: populatedBooking.user?.agencyProfile?.agencyName || 'Independent',
      email: populatedBooking.user?.email || 'N/A',
      phone: populatedBooking.user?.agencyProfile?.phone || 'N/A',
      country: populatedBooking.user?.agencyProfile?.address?.country || 'Maldives'
    };

    console.log('DEBUG - Generating PDF with room data:', {
      roomId: populatedBooking.room._id,
      transportations: populatedBooking.room.transportations
    });

    // Generate the PDF
    const pdfPath = await generateCustomerQuote(populatedBooking, agent, profitMargin, marginType);
    res.download(pdfPath, `customer-quote-${populatedBooking.bookingReference}.pdf`);
  } catch (err) {
    console.error('Error generating quote:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.get('/:id/confirmation-pdf', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel')
      .populate('room');
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });
    const { generateBookingVoucher } = require('../utils/bookingPdfGenerator');
    const pdfPath = await generateBookingVoucher(booking, booking.hotel, booking.room);
    res.download(pdfPath, `booking-confirmation-${booking.bookingReference}.pdf`);
  } catch (err) {
    console.error('Error generating confirmation PDF:', err);
    res.status(500).json({ msg: 'Failed to generate confirmation PDF' });
  }
});

// Bulk booking endpoint
router.post('/bulk', auth, async (req, res) => {
  try {
    console.log('Bulk booking request received:', req.body);
    const { bookings } = req.body;

    if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
      console.log('Error: No bookings array provided');
      return res.status(400).json({ msg: 'Bookings array is required and must not be empty' });
    }

    // Create individual bookings first
    const createdBookings = [];
    
    for (let i = 0; i < bookings.length; i++) {
      const bookingData = bookings[i];
      
      // Validate required fields
      console.log(`Processing booking ${i + 1}:`, bookingData);
      
      if (!bookingData.hotelId || !bookingData.roomId || !bookingData.clientDetails) {
        console.log(`Booking ${i + 1} missing required fields:`, {
          hotelId: !!bookingData.hotelId,
          roomId: !!bookingData.roomId,
          clientDetails: !!bookingData.clientDetails
        });
        return res.status(400).json({ 
          msg: `Booking ${i + 1} is missing required fields (hotelId, roomId, clientDetails)` 
        });
      }

      if (!bookingData.clientDetails.name || !bookingData.clientDetails.email) {
        console.log(`Booking ${i + 1} missing client details:`, bookingData.clientDetails);
        return res.status(400).json({ 
          msg: `Booking ${i + 1} is missing required client details (name, email)` 
        });
      }

      // Check room availability
      const room = await Room.findById(bookingData.roomId);
      if (!room) {
        return res.status(400).json({ msg: `Room not found for booking ${i + 1}` });
      }

      // Check room availability - ONLY check date range conflicts
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      
      // ONLY CHECK: Date range conflicts with existing bookings
      const overlappingBooking = await Booking.findOne({
        room: bookingData.roomId,
        status: { $in: ['Confirmed', 'Paid'] },
        $or: [
          { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
        ]
      });

      if (overlappingBooking) {
        return res.status(400).json({ 
          msg: `Room ${room.roomName} is not available: Date conflict with existing booking` 
        });
      }

      // Calculate price breakdown
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      
      // Get room price from pricePeriods or prices array
      let basePricePerNight = 0;
      
      if (room.pricePeriods && room.pricePeriods.length > 0) {
        // Check for direct period matches
        const directPeriods = room.pricePeriods.filter(period => {
          if (!period?.startDate || !period?.endDate || period.price == null || period.price < 0) {
            return false;
          }
          
          const periodStart = new Date(period.startDate);
          const periodEnd = new Date(period.endDate);
          periodStart.setHours(0, 0, 0, 0);
          periodEnd.setHours(23, 59, 59, 999);

          return periodStart <= checkOutDate && periodEnd >= checkInDate;
        });

        if (directPeriods.length > 0) {
          basePricePerNight = directPeriods[0].price;
        } else {
          // Use first available price period
          basePricePerNight = room.pricePeriods[0].price;
        }
      } else if (room.prices && room.prices.length > 0) {
        // Fallback to prices array
        const standardPrice = room.prices.find(p => p.market === 'Standard') || room.prices[0];
        basePricePerNight = standardPrice.price;
      }
      
      // Calculate meal plan cost (simplified calculation)
      let mealPlanCost = 0;
      switch (bookingData.mealPlan) {
        case 'Bed & Breakfast':
          mealPlanCost = basePricePerNight * 0.1;
          break;
        case 'Half Board':
          mealPlanCost = basePricePerNight * 0.2;
          break;
        case 'Full Board':
          mealPlanCost = basePricePerNight * 0.3;
          break;
        case 'All-Inclusive':
          mealPlanCost = basePricePerNight * 0.4;
          break;
        default:
          mealPlanCost = 0;
      }

      const roomTotal = basePricePerNight * nights;
      const mealPlanTotal = mealPlanCost * nights;
      const total = roomTotal + mealPlanTotal;

      // Create individual booking
      const individualBooking = new Booking({
        user: req.user.userId,
        hotel: bookingData.hotelId,
        room: bookingData.roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        mealPlan: bookingData.mealPlan,
        adults: bookingData.adults,
        children: Array.from({ length: bookingData.children || 0 }, () => ({ age: 0 })),
        clientDetails: bookingData.clientDetails,
        rooms: 1,
        nights: nights,
        bookingReference: 'BK-' + Date.now() + '-' + i,
        status: bookingData.status || 'Pending',
        priceBreakdown: {
          basePricePerNight: basePricePerNight,
          roomTotal: roomTotal,
          mealPlan: {
            type: bookingData.mealPlan,
            price: mealPlanCost,
            total: mealPlanTotal
          },
          total: total
        }
      });

      const savedBooking = await individualBooking.save();
      createdBookings.push(savedBooking);

      // Note: Room reservation is handled by the booking creation
      // No need to call reserveRooms since we're creating individual bookings
    }

    res.status(201).json({
      msg: 'Bulk bookings created successfully',
      bookings: createdBookings,
      totalBookings: createdBookings.length
    });

  } catch (error) {
    console.error('Error creating bulk bookings:', error);
    
    // If there's an error, try to clean up any created bookings
    if (createdBookings && createdBookings.length > 0) {
      try {
        await Booking.deleteMany({ _id: { $in: createdBookings.map(b => b._id) } });
      } catch (cleanupError) {
        console.error('Error cleaning up created bookings:', cleanupError);
      }
    }
    
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

module.exports = router;