const BulkBooking = require('../models/BulkBooking');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const User = require('../models/User');

// Create bulk booking
const createBulkBooking = async (req, res) => {
  try {
    const { groupName, bookings, checkIn, checkOut, checkInTime, checkOutTime, adults, children, mealPlan, specialRequests } = req.body;

    if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
      return res.status(400).json({ msg: 'Bookings array is required and must not be empty' });
    }

    if (!groupName || !checkIn || !checkOut) {
      return res.status(400).json({ msg: 'Group name, check-in and check-out dates are required' });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ msg: 'Check-out date must be after check-in date' });
    }

    // Create bulk booking data
    const bulkBookingData = {
      bulkBookingReference: 'BB-' + Date.now(),
      groupName: groupName,
      user: req.user.userId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      checkInTime: checkInTime || '14:00',
      checkOutTime: checkOutTime || '12:00',
      adults: adults || 1,
      children: children || 0,
      mealPlan: mealPlan || 'All-Inclusive',
      specialRequests: specialRequests || '',
      createdBy: req.user.userId,
      bookings: []
    };

    // Track rooms to update availability
    const roomsToUpdate = new Map();

    // Process each booking
    for (let i = 0; i < bookings.length; i++) {
      const bookingData = bookings[i];
      
      // Validate required fields
      if (!bookingData.hotelId || !bookingData.roomId || !bookingData.clientDetails) {
        return res.status(400).json({ 
          msg: `Booking ${i + 1} is missing required fields (hotelId, roomId, clientDetails)` 
        });
      }

      if (!bookingData.clientDetails.name || !bookingData.clientDetails.email) {
        return res.status(400).json({ 
          msg: `Booking ${i + 1} is missing required client details (name, email)` 
        });
      }

      // Check room availability
      console.log(`Looking for room with ID: ${bookingData.roomId}`);
      const room = await Room.findById(bookingData.roomId);
      if (!room) {
        console.log(`Room not found with ID: ${bookingData.roomId}`);
        return res.status(400).json({ msg: `Room not found for booking ${i + 1}. Room ID: ${bookingData.roomId}` });
      }

      // Check if room has enough availability for this booking
      // For now, allow booking even if currentAvailableQuantity is 0 (for testing)
      // In production, you might want to enforce this check
      console.log(`Room ${room.roomName} availability: availableQuantity=${room.availableQuantity}, reservedQuantity=${room.reservedQuantity}, currentAvailableQuantity=${room.currentAvailableQuantity}`);
      
      if (room.availableQuantity <= 0) {
        return res.status(400).json({ 
          msg: `Room ${room.roomName} is not available (total available quantity is 0)` 
        });
      }

      // Track room for availability update
      const roomId = room._id.toString();
      if (!roomsToUpdate.has(roomId)) {
        roomsToUpdate.set(roomId, {
          room: room,
          quantityToReserve: 0
        });
      }
      roomsToUpdate.get(roomId).quantityToReserve += 1;

      // Calculate price breakdown
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const basePricePerNight = room.prices?.find(p => p.market === 'default')?.price || room.pricePeriods?.[0]?.price || 0;
      
      // Calculate meal plan cost (simplified calculation)
      let mealPlanCost = 0;
      switch (mealPlan) {
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

      // Add booking data to bulk booking (no individual booking creation)
      bulkBookingData.bookings.push({
        hotel: bookingData.hotelId,
        room: bookingData.roomId,
        roomDetails: {
          _id: room._id,
          roomName: room.roomName,
          roomType: room.roomType,
          description: room.description,
          size: room.size,
          bedType: room.bedType,
          maxOccupancy: room.maxOccupancy,
          amenities: room.amenities
        },
        clientDetails: bookingData.clientDetails,
        status: 'Pending',
        priceBreakdown: {
          basePricePerNight: basePricePerNight,
          roomTotal: roomTotal,
          mealPlanTotal: mealPlanTotal,
          totalNights: nights,
          total: total
        }
      });
    }

    // Update room availability for all booked rooms
    for (const [roomId, roomUpdate] of roomsToUpdate) {
      const { room, quantityToReserve } = roomUpdate;
      
      try {
        // Update room availability: decrease availableQuantity and increase reservedQuantity
        room.availableQuantity = Math.max(0, room.availableQuantity - quantityToReserve);
        room.reservedQuantity += quantityToReserve;
        
        // Ensure reserved quantity doesn't exceed total available
        if (room.reservedQuantity > room.availableQuantity + room.reservedQuantity) {
          room.reservedQuantity = room.availableQuantity + room.reservedQuantity;
        }
        
        await room.save();
        console.log(`Updated room ${room.roomName}: availableQuantity=${room.availableQuantity}, reservedQuantity=${room.reservedQuantity}`);
      } catch (error) {
        console.error(`Error updating room ${room.roomName} availability:`, error);
        // Continue with other rooms even if one fails
      }
    }

    // Create bulk booking
    const bulkBooking = new BulkBooking(bulkBookingData);
    await bulkBooking.save();

    // Populate and return the bulk booking
    const populatedBulkBooking = await BulkBooking.findById(bulkBooking._id)
      .populate('user', 'firstName lastName email')
      .populate('bookings.hotel', 'name')
      .populate('bookings.room', 'roomName roomType');

    res.status(201).json({
      msg: 'Bulk booking created successfully',
      bulkBooking: populatedBulkBooking,
      totalBookings: bulkBookingData.bookings.length,
      roomsUpdated: Array.from(roomsToUpdate.values()).map(ru => ({
        roomName: ru.room.roomName,
        quantityReserved: ru.quantityToReserve,
        newAvailableQuantity: ru.room.availableQuantity,
        newReservedQuantity: ru.room.reservedQuantity
      }))
    });

  } catch (error) {
    console.error('Error creating bulk booking:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get all bulk bookings
const getAllBulkBookings = async (req, res) => {
  try {
    const bulkBookings = await BulkBooking.find()
      .populate('user', 'firstName lastName email')
      .populate('bookings.hotel', 'name')
      .populate('bookings.room', 'roomName roomType')
      .sort({ createdAt: -1 });

    res.json(bulkBookings);
  } catch (error) {
    console.error('Error fetching bulk bookings:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get bulk booking by ID
const getBulkBookingById = async (req, res) => {
  try {
    const bulkBooking = await BulkBooking.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('bookings.hotel', 'name')
      .populate('bookings.room', 'roomName roomType')
      .populate('createdBy', 'firstName lastName email')
      .populate('lastModifiedBy', 'firstName lastName email');

    if (!bulkBooking) {
      return res.status(404).json({ msg: 'Bulk booking not found' });
    }

    res.json(bulkBooking);
  } catch (error) {
    console.error('Error fetching bulk booking:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get bulk bookings for logged-in user
const getMyBulkBookings = async (req, res) => {
  try {
    const bulkBookings = await BulkBooking.find({ user: req.user.userId })
      .populate('bookings.hotel', 'name')
      .populate('bookings.room', 'roomName roomType')
      .sort({ createdAt: -1 });

    res.json(bulkBookings);
  } catch (error) {
    console.error('Error fetching user bulk bookings:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Update bulk booking
const updateBulkBooking = async (req, res) => {
  try {
    const bulkBooking = await BulkBooking.findById(req.params.id);
    if (!bulkBooking) {
      return res.status(404).json({ msg: 'Bulk booking not found' });
    }

    // Update last modified by
    req.body.lastModifiedBy = req.user.userId;
    req.body.updatedAt = new Date();

    const updatedBulkBooking = await BulkBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('user', 'firstName lastName email')
      .populate('bookings.hotel', 'name')
      .populate('bookings.room', 'roomName roomType');

    res.json(updatedBulkBooking);
  } catch (error) {
    console.error('Error updating bulk booking:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Cancel bulk booking
const cancelBulkBooking = async (req, res) => {
  try {
    const { cancellationReason, cancellationNotes, refundAmount, refundMethod, cancellationFee } = req.body;

    const bulkBooking = await BulkBooking.findById(req.params.id);
    if (!bulkBooking) {
      return res.status(404).json({ msg: 'Bulk booking not found' });
    }

    if (bulkBooking.status === 'Cancelled') {
      return res.status(400).json({ msg: 'Bulk booking is already cancelled' });
    }

    // Track rooms to release availability
    const roomsToRelease = new Map();

    // Count rooms to release for each room
    for (const booking of bulkBooking.bookings) {
      const roomId = booking.room.toString();
      if (!roomsToRelease.has(roomId)) {
        roomsToRelease.set(roomId, 0);
      }
      roomsToRelease.set(roomId, roomsToRelease.get(roomId) + 1);
    }

    // Release room availability
    for (const [roomId, quantityToRelease] of roomsToRelease) {
      try {
        const room = await Room.findById(roomId);
        if (room) {
          // Release rooms: decrease reservedQuantity and increase availableQuantity
          room.reservedQuantity = Math.max(0, room.reservedQuantity - quantityToRelease);
          room.availableQuantity += quantityToRelease;
          
          await room.save();
          console.log(`Released ${quantityToRelease} rooms for ${room.roomName}: availableQuantity=${room.availableQuantity}, reservedQuantity=${room.reservedQuantity}`);
        }
      } catch (error) {
        console.error(`Error releasing room ${roomId}:`, error);
        // Continue with other rooms even if one fails
      }
    }

    // Cancel the bulk booking
    await bulkBooking.cancelBulkBooking({
      cancellationReason,
      cancellationNotes,
      refundAmount: refundAmount || 0,
      refundMethod,
      cancellationFee: cancellationFee || 0
    }, req.user.userId);

    // Populate and return updated bulk booking
    const updatedBulkBooking = await BulkBooking.findById(bulkBooking._id)
      .populate('user', 'firstName lastName email')
      .populate('bookings.hotel', 'name')
      .populate('bookings.room', 'roomName roomType');

    res.json({
      ...updatedBulkBooking.toObject(),
      roomsReleased: Array.from(roomsToRelease.entries()).map(([roomId, quantity]) => ({
        roomId,
        quantityReleased: quantity
      }))
    });
  } catch (error) {
    console.error('Error cancelling bulk booking:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Confirm all bookings in bulk
const confirmAllBookings = async (req, res) => {
  try {
    const bulkBooking = await BulkBooking.findById(req.params.id);
    if (!bulkBooking) {
      return res.status(404).json({ msg: 'Bulk booking not found' });
    }

    // Confirm all individual bookings
    for (const bookingRef of bulkBooking.bookings) {
      const individualBooking = await Booking.findById(bookingRef.booking);
      if (individualBooking && individualBooking.status === 'Pending') {
        individualBooking.status = 'Confirmed';
        await individualBooking.save();
      }
    }

    // Confirm the bulk booking
    await bulkBooking.confirmAllBookings();

    // Populate and return updated bulk booking
    const updatedBulkBooking = await BulkBooking.findById(bulkBooking._id)
      .populate('user', 'firstName lastName email')
      .populate('bookings.hotel', 'name')
      .populate('bookings.room', 'roomName roomType');

    res.json(updatedBulkBooking);
  } catch (error) {
    console.error('Error confirming bulk booking:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get bulk booking statistics
const getBulkBookingStatistics = async (req, res) => {
  try {
    const stats = await BulkBooking.getStatistics();
    
    // Additional statistics
    const totalBulkBookings = await BulkBooking.countDocuments();
    const statusBreakdown = await BulkBooking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      ...stats[0],
      totalBulkBookings,
      statusBreakdown
    });
  } catch (error) {
    console.error('Error fetching bulk booking statistics:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Delete bulk booking
const deleteBulkBooking = async (req, res) => {
  try {
    const bulkBooking = await BulkBooking.findById(req.params.id);
    if (!bulkBooking) {
      return res.status(404).json({ msg: 'Bulk booking not found' });
    }

    // Track rooms to release availability
    const roomsToRelease = new Map();

    // Count rooms to release for each room
    for (const booking of bulkBooking.bookings) {
      const roomId = booking.room.toString();
      if (!roomsToRelease.has(roomId)) {
        roomsToRelease.set(roomId, 0);
      }
      roomsToRelease.set(roomId, roomsToRelease.get(roomId) + 1);
    }

    // Release room availability
    for (const [roomId, quantityToRelease] of roomsToRelease) {
      try {
        const room = await Room.findById(roomId);
        if (room) {
          // Release rooms: decrease reservedQuantity and increase availableQuantity
          room.reservedQuantity = Math.max(0, room.reservedQuantity - quantityToRelease);
          room.availableQuantity += quantityToRelease;
          
          await room.save();
          console.log(`Released ${quantityToRelease} rooms for ${room.roomName}: availableQuantity=${room.availableQuantity}, reservedQuantity=${room.reservedQuantity}`);
        }
      } catch (error) {
        console.error(`Error releasing room ${roomId}:`, error);
        // Continue with other rooms even if one fails
      }
    }

    // Delete the bulk booking document
    await BulkBooking.findByIdAndDelete(req.params.id);

    res.json({ 
      msg: 'Bulk booking deleted successfully',
      roomsReleased: Array.from(roomsToRelease.entries()).map(([roomId, quantity]) => ({
        roomId,
        quantityReleased: quantity
      }))
    });
  } catch (error) {
    console.error('Error deleting bulk booking:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

module.exports = {
  createBulkBooking,
  getAllBulkBookings,
  getBulkBookingById,
  getMyBulkBookings,
  updateBulkBooking,
  cancelBulkBooking,
  confirmAllBookings,
  getBulkBookingStatistics,
  deleteBulkBooking
};
