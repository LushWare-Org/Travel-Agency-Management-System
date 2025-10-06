const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Helper function to compute room price 
const getRoomPrice = (room, market, checkIn, checkOut) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let price = null;

  console.log(`\nCalculating price for Room ${room._id}...`);

  if (!room) {
    console.error('No room data provided');
    return 0;
  }

  try {
    const checkInDate = checkIn ? new Date(checkIn) : null;
    const checkOutDate = checkOut ? new Date(checkOut) : null;

    if (checkInDate && checkOutDate && !isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
      if (room.pricePeriods?.length > 0) {
        // First pass: find direct period matches
        const directPeriods = room.pricePeriods
          .filter(period => {
            const periodStart = new Date(period.startDate);
            const periodEnd = new Date(period.endDate);
            periodStart.setHours(0, 0, 0, 0);
            periodEnd.setHours(23, 59, 59, 999);

            const isValid = (
              periodStart <= checkOutDate &&
              periodEnd >= checkInDate &&
              period.price != null && period.price >= 0
            );

            if (isValid) {
              console.log(`Found valid period: ${periodStart.toLocaleDateString()} - ${periodEnd.toLocaleDateString()} (Price: $${period.price})`);
            }
            return isValid;
          })
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        if (directPeriods.length > 0) {
          price = directPeriods[0].price;
          console.log(`Using price from direct period match: $${price}`);
        } else {
          // Second pass: find future periods if no direct match
          const futurePeriods = room.pricePeriods
            .filter(period => {
              const periodStart = new Date(period.startDate);
              return periodStart > today && period.price != null && period.price >= 0;
            })
            .sort((a, b) => new Date(a.startDate) - new Date(a.startDate));

          if (futurePeriods.length > 0) {
            price = futurePeriods[0].price;
            console.log(`Using price from future period: $${price}`);
          }
        }
      }
    } else {
      console.log('Invalid or missing check-in/check-out dates');
    }

    if (price === null) {
      console.log('No valid price period found for these dates');
      price = 0;
    }

    // Only use market for surcharge, no nationality logic
    const surcharge = room.marketPrices?.find(p => p.market === market)?.price || 0;
    console.log(`Applied market surcharge: $${surcharge} for ${market || 'none'}`);

    const finalPrice = Number(price) + surcharge;
    console.log(`Final calculated price: $${finalPrice}\n`);
    return finalPrice;

  } catch (error) {
    console.error('Error calculating room price:', error);
    return 0;
  }
};

// Create a new room (admin only)
router.post('/', auth, async (req, res) => {
  try {
    console.log('Incoming prices:', req.body.prices);
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
    console.log('Created room:', room._id);
  } catch (err) {
    console.error('Error creating room:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all rooms with hotel info
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('hotel', 'name location')
      .lean();
    res.json(rooms);
    console.log(`Fetched ${rooms.length} rooms`);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get rooms for a specific hotel
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    
    let rooms = await Room.find({ hotel: req.params.hotelId })
      .populate('hotel', 'name location')
      .lean();

    // If dates are provided, filter by availability
    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      
      rooms = rooms.filter(room => {
        return !room.availabilityCalendar.some(period => {
          const periodStart = new Date(period.startDate);
          const periodEnd = new Date(period.endDate);
          
          return (startDate >= periodStart && startDate <= periodEnd) ||
                 (endDate >= periodStart && endDate <= periodEnd) ||
                 (startDate <= periodStart && endDate >= periodEnd);
        });
      });
    }

    res.json(rooms);
    console.log(`Fetched ${rooms.length} rooms for hotel ${req.params.hotelId}${checkIn && checkOut ? ' (filtered by availability)' : ''}`);
  } catch (err) {
    console.error('Error fetching rooms for hotel:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Get available rooms for bulk booking (simplified endpoint for frontend)
router.get('/available', async (req, res) => {
  try {
    const { checkIn, checkOut, adults, children } = req.query;

    console.log('\n=== Available Rooms Request ===');
    console.log('Parameters:', { checkIn, checkOut, adults, children });

    // Validate inputs
    if (!checkIn || !checkOut) {
      return res.status(400).json({ msg: 'Missing required parameters: checkIn, checkOut' });
    }

    const inD = new Date(checkIn);
    const outD = new Date(checkOut);

    // Validate dates
    if (isNaN(inD.getTime()) || isNaN(outD.getTime())) {
      return res.status(400).json({ msg: 'Invalid date format' });
    }

    if (inD >= outD) {
      return res.status(400).json({ msg: 'Check-out date must be after check-in date' });
    }

    // Normalize dates
    inD.setHours(0, 0, 0, 0);
    outD.setHours(23, 59, 59, 999);

    // Get all rooms with hotel info
    const rooms = await Room.find({})
      .populate('hotel', 'name location')
      .lean();

    console.log(`Found ${rooms.length} rooms to check`);

    // Filter available rooms - ONLY check date range conflicts
    const availableRooms = await Promise.all(
      rooms.map(async (room) => {
        try {
          console.log(`\nProcessing Room ${room._id}: ${room.roomName}`);

          // Check room availability based on quantity
          if (room.currentAvailableQuantity <= 0) {
            console.log(`Room ${room._id} NOT available: No available quantity (${room.currentAvailableQuantity})`);
            return null;
          }

          // ONLY CHECK: Date range conflicts with existing bookings
          const overlappingBooking = await mongoose.model('Booking').findOne({
            room: room._id,
            status: { $in: ['Confirmed', 'Paid'] },
            $or: [
              { checkIn: { $lt: outD }, checkOut: { $gt: inD } }
            ]
          });

          if (overlappingBooking) {
            console.log(`Room ${room._id} NOT available: Date conflict with existing booking`);
            return null;
          }

          // CHECK: Date range conflicts with bulk bookings
          const overlappingBulkBooking = await mongoose.model('BulkBooking').findOne({
            'bookings.room': room._id,
            status: { $in: ['Confirmed', 'Paid', 'Pending'] },
            $or: [
              { checkIn: { $lt: outD }, checkOut: { $gt: inD } }
            ]
          });

          if (overlappingBulkBooking) {
            console.log(`Room ${room._id} NOT available: Date conflict with bulk booking`);
            return null;
          }

          // Get room price (simplified)
          let roomPrice = 0;
          if (room.pricePeriods && room.pricePeriods.length > 0) {
            roomPrice = room.pricePeriods[0].price;
          } else if (room.prices && room.prices.length > 0) {
            roomPrice = room.prices[0].price;
          }

          // Calculate nights and total price
          const nights = Math.ceil((outD - inD) / (1000 * 60 * 60 * 24));
          const totalPrice = roomPrice * nights;

          // Return room data
          const enrichedRoom = {
            _id: room._id,
            hotelId: room.hotel._id,
            hotel: {
              _id: room.hotel._id,
              name: room.hotel.name,
              location: room.hotel.location
            },
            roomName: room.roomName,
            roomType: room.roomType,
            description: room.description,
            size: room.size,
            bedType: room.bedType,
            maxOccupancy: room.maxOccupancy,
            capacity: room.maxOccupancy?.adults || 2,
            amenities: room.amenities || [],
            gallery: room.gallery || [],
            transportations: room.transportations || [],
            price: roomPrice,
            totalPrice: totalPrice,
            nights: nights,
            availableQuantity: room.availableQuantity,
            reservedQuantity: room.reservedQuantity,
            currentAvailableQuantity: room.currentAvailableQuantity
          };

          console.log(`Room ${room._id} AVAILABLE: ${room.roomName} - $${roomPrice}/night`);
          return enrichedRoom;
        } catch (err) {
          console.error(`Error processing room ${room._id}:`, err);
          return null;
        }
      })
    );

    // Filter out null values
    const filteredRooms = availableRooms.filter(room => room !== null);

    console.log(`\n=== Results ===`);
    console.log(`Total rooms checked: ${rooms.length}`);
    console.log(`Available rooms: ${filteredRooms.length}`);

    res.json({
      success: true,
      data: filteredRooms,
      summary: {
        totalRooms: rooms.length,
        availableRooms: filteredRooms.length,
        checkIn: checkIn,
        checkOut: checkOut,
        nights: Math.ceil((outD - inD) / (1000 * 60 * 60 * 24))
      }
    });
  } catch (err) {
    console.error('Error fetching available rooms:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Server error', 
      error: err.message 
    });
  }
});

// Check room availability for specific dates
router.get('/availability', async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut, market } = req.query;

    console.log('\n=== Availability Check Request ===');
    console.log('Parameters:', { hotelId, checkIn, checkOut, market });
    // Validate inputs
    if (!hotelId || !checkIn || !checkOut) {
      console.error('Missing required parameters:', { hotelId, checkIn, checkOut });
      return res.status(400).json({ msg: 'Missing required parameters' });
    }

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      console.error('Invalid hotelId format:', hotelId);
      return res.status(400).json({ msg: 'Invalid hotel ID format' });
    }

    const inD = new Date(checkIn);
    const outD = new Date(checkOut);

    // Validate dates
    if (isNaN(inD.getTime()) || isNaN(outD.getTime())) {
      console.error('Invalid date format:', { checkIn, checkOut });
      return res.status(400).json({ msg: 'Invalid date format' });
    }

    if (inD >= outD) {
      console.error('Invalid date range:', { checkIn, checkOut });
      return res.status(400).json({ msg: 'Check-out date must be after check-in date' });
    }

    // Normalize dates
    inD.setHours(0, 0, 0, 0);
    outD.setHours(23, 59, 59, 999);

    // Check if hotel exists
    const hotelExists = await mongoose.model('Hotel').exists({ _id: hotelId });
    if (!hotelExists) {
      console.error('Hotel not found:', hotelId);
      return res.status(404).json({ msg: 'Hotel not found' });
    }

    // Get all rooms for the hotel
    const rooms = await Room.find({ hotel: hotelId }).lean();

    console.log(`Found ${rooms.length} rooms for hotel ${hotelId}`);

    // Filter rooms based on availability
    const availableRooms = await Promise.all(
      rooms.map(async (room) => {
        try {
          console.log(`\nProcessing Room ${room._id}: ${room.roomName}`);

          // Check for overlapping bookings
          const overlappingBooking = await mongoose.model('Booking').findOne({
            room: room._id,
            status: 'Confirmed',
            $or: [
              { checkIn: { $lt: outD }, checkOut: { $gt: inD } },
              { checkIn: { $gte: inD, $lt: outD } },
              { checkOut: { $gt: inD, $lte: outD } },
            ],
          });

          if (overlappingBooking) {
            console.log(`Room ${room._id} NOT available due to booking:`, {
              bookingId: overlappingBooking._id,
              bookingDates: `${new Date(overlappingBooking.checkIn).toISOString()} to ${new Date(overlappingBooking.checkOut).toISOString()}`,
            });
            return null;
          }

          // Check for overlapping bulk bookings
          const overlappingBulkBooking = await mongoose.model('BulkBooking').findOne({
            'bookings.room': room._id,
            status: { $in: ['Confirmed', 'Paid', 'Pending'] },
            $or: [
              { checkIn: { $lt: outD }, checkOut: { $gt: inD } },
              { checkIn: { $gte: inD, $lt: outD } },
              { checkOut: { $gt: inD, $lte: outD } },
            ],
          });

          if (overlappingBulkBooking) {
            console.log(`Room ${room._id} NOT available due to bulk booking:`, {
              bulkBookingId: overlappingBulkBooking._id,
              bookingDates: `${new Date(overlappingBulkBooking.checkIn).toISOString()} to ${new Date(overlappingBulkBooking.checkOut).toISOString()}`,
            });
            return null;
          }          // Check pricing
          let hasValidPricing = false;
          
          // First check if there are any valid price periods
          if (room.pricePeriods && Array.isArray(room.pricePeriods) && room.pricePeriods.length > 0) {
            // Check for direct period matches
            const directPeriods = room.pricePeriods.filter(period => {
              if (!period?.startDate || !period?.endDate || period.price == null || period.price < 0) {
                return false;
              }
              
              const periodStart = new Date(period.startDate);
              const periodEnd = new Date(period.endDate);
              periodStart.setHours(0, 0, 0, 0);
              periodEnd.setHours(23, 59, 59, 999);

              const isValid = periodStart <= outD && periodEnd >= inD;
              
              if (isValid) {
                console.log(`Room ${room._id}: Found valid period ${periodStart.toLocaleDateString()} - ${periodEnd.toLocaleDateString()} (Price: $${period.price})`);
              }
              return isValid;
            });

            // If no direct matches, check for future periods
            if (directPeriods.length === 0) {
              const futurePeriods = room.pricePeriods.filter(period => {
                if (!period?.startDate || period.price == null || period.price < 0) {
                  return false;
                }
                const periodStart = new Date(period.startDate);
                return periodStart > today;
              });

              if (futurePeriods.length > 0) {
                console.log(`Room ${room._id}: Found ${futurePeriods.length} future price periods`);
                hasValidPricing = true;
              }
            } else {
              console.log(`Room ${room._id}: Found ${directPeriods.length} directly applicable price periods`);
              hasValidPricing = true;
            }
          }

          // Fallback to base price if no valid periods found
          if (!hasValidPricing && room.basePrice != null && room.basePrice >= 0) {
            console.log(`Room ${room._id}: Using base price $${room.basePrice}`);
            hasValidPricing = true;
          }

          if (!hasValidPricing) {
            console.log(`Room ${room._id} NOT available: No valid pricing found`);
            return null;
          }

          // Enrich room with price
          const enrichedRoom = {
            ...room,
            basePrice: getRoomPrice(room, market || '', inD, outD),
          };

          console.log(`Room ${room._id} AVAILABLE: Price $${enrichedRoom.basePrice}`);
          return enrichedRoom;
        } catch (err) {
          console.error(`Error processing room ${room._id}:`, err);
          return null;
        }
      })
    );

    // Filter out null values
    const filteredAvailableRooms = availableRooms.filter((room) => room !== null);

    console.log('\n=== Availability Results ===');
    console.log(`Total rooms checked: ${rooms.length}`);
    console.log(`Available rooms: ${filteredAvailableRooms.length}`);
    console.log('Available room IDs:', filteredAvailableRooms.map((r) => r._id));

    res.json(filteredAvailableRooms);
  } catch (err) {
    console.error('Error checking availability:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get all unique markets from all rooms
router.get('/markets', async (req, res) => {
  try {
    const rooms = await Room.find({}, 'prices');
    const allMarkets = new Set();
    rooms.forEach(room => {
      (room.prices || []).forEach(p => {
        if (p.market) allMarkets.add(p.market);
      });
    });
    const defaultMarkets = [
      'India',
      'China',
      'Middle East',
      'South East Asia',
      'Asia',
      'Europe',
      'Russia & CIS',
    ];
    defaultMarkets.forEach(m => allMarkets.add(m));
    res.json(Array.from(allMarkets));
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Check bulk availability for multiple rooms
router.get('/bulk-availability', async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut, market = 'default', quantities } = req.query;

    console.log('\n=== Bulk Availability Check Request ===');
    console.log('Parameters:', { hotelId, checkIn, checkOut, market, quantities });

    // Validate inputs
    if (!hotelId || !checkIn || !checkOut) {
      console.error('Missing required parameters:', { hotelId, checkIn, checkOut });
      return res.status(400).json({ msg: 'Missing required parameters' });
    }

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      console.error('Invalid hotelId format:', hotelId);
      return res.status(400).json({ msg: 'Invalid hotel ID format' });
    }

    const inD = new Date(checkIn);
    const outD = new Date(checkOut);

    // Validate dates
    if (isNaN(inD.getTime()) || isNaN(outD.getTime())) {
      console.error('Invalid date format:', { checkIn, checkOut });
      return res.status(400).json({ msg: 'Invalid date format' });
    }

    if (inD >= outD) {
      console.error('Invalid date range:', { checkIn, checkOut });
      return res.status(400).json({ msg: 'Check-out date must be after check-in date' });
    }

    // Normalize dates
    inD.setHours(0, 0, 0, 0);
    outD.setHours(23, 59, 59, 999);

    // Check if hotel exists
    const hotelExists = await mongoose.model('Hotel').exists({ _id: hotelId });
    if (!hotelExists) {
      console.error('Hotel not found:', hotelId);
      return res.status(404).json({ msg: 'Hotel not found' });
    }

    // Get all rooms for the hotel that allow bulk booking
    const rooms = await Room.find({ 
      hotel: hotelId,
      isActive: true,
      'bulkBookingSettings.allowBulkBooking': true
    }).lean();

    console.log(`Found ${rooms.length} bulk-booking-enabled rooms for hotel ${hotelId}`);

    // Process each room for bulk availability
    const availableRooms = await Promise.all(
      rooms.map(async (room) => {
        try {
          console.log(`\nProcessing Room ${room._id}: ${room.roomName}`);

          // Check if room has enough quantity available
          if (room.reservedQuantity >= room.availableQuantity) {
            console.log(`Room ${room._id} NOT available: All rooms reserved`);
            return null;
          }

          // Check for overlapping bookings
          const overlappingBookings = await mongoose.model('Booking').find({
            room: room._id,
            status: { $in: ['Confirmed', 'Paid'] },
            $or: [
              { checkIn: { $lt: outD }, checkOut: { $gt: inD } },
              { checkIn: { $gte: inD, $lt: outD } },
              { checkOut: { $gt: inD, $lte: outD } },
            ],
          });

          // Check for overlapping bulk bookings
          const overlappingBulkBookings = await mongoose.model('BulkBooking').find({
            'bookings.room': room._id,
            status: { $in: ['Confirmed', 'Paid', 'Pending'] },
            $or: [
              { checkIn: { $lt: outD }, checkOut: { $gt: inD } },
              { checkIn: { $gte: inD, $lt: outD } },
              { checkOut: { $gt: inD, $lte: outD } },
            ],
          });

          // Calculate total rooms needed by existing bookings
          let totalReservedByBookings = 0;
          overlappingBookings.forEach(booking => {
            totalReservedByBookings += booking.rooms || 1;
          });

          overlappingBulkBookings.forEach(bulkBooking => {
            const roomBooking = bulkBooking.bookings.find(rb => 
              rb.room.toString() === room._id.toString()
            );
            if (roomBooking) {
              totalReservedByBookings += 1; // Each booking in bulk booking represents 1 room
            }
          });

          const availableQuantity = room.availableQuantity - totalReservedByBookings;

          if (availableQuantity <= 0) {
            console.log(`Room ${room._id} NOT available: All rooms reserved by existing bookings`);
            return null;
          }

          // Check bulk booking constraints
          const availability = room.isAvailableForBulkBooking(1, checkIn, checkOut);
          if (!availability.available) {
            console.log(`Room ${room._id} NOT available: ${availability.reason}`);
            return null;
          }

          // Check pricing
          let hasValidPricing = false;
          
          if (room.pricePeriods && Array.isArray(room.pricePeriods) && room.pricePeriods.length > 0) {
            const directPeriods = room.pricePeriods.filter(period => {
              if (!period?.startDate || !period?.endDate || period.price == null || period.price < 0) {
                return false;
              }
              
              const periodStart = new Date(period.startDate);
              const periodEnd = new Date(period.endDate);
              periodStart.setHours(0, 0, 0, 0);
              periodEnd.setHours(23, 59, 59, 999);

              return periodStart <= outD && periodEnd >= inD;
            });

            if (directPeriods.length > 0) {
              hasValidPricing = true;
            } else {
              const futurePeriods = room.pricePeriods.filter(period => {
                if (!period?.startDate || period.price == null || period.price < 0) {
                  return false;
                }
                const periodStart = new Date(period.startDate);
                return periodStart > new Date();
              });

              if (futurePeriods.length > 0) {
                hasValidPricing = true;
              }
            }
          }

          if (!hasValidPricing) {
            console.log(`Room ${room._id} NOT available: No valid pricing found`);
            return null;
          }

          // Calculate bulk discount
          const bulkDiscount = room.calculateBulkDiscount(1, market);

          // Enrich room with bulk-specific data
          const enrichedRoom = {
            ...room,
            availableQuantity,
            currentAvailableQuantity: availableQuantity,
            utilizationPercentage: Math.round((room.reservedQuantity / room.availableQuantity) * 100),
            basePrice: getRoomPrice(room, market || '', inD, outD),
            bulkDiscount,
            timeConstraints: room.timeConstraints,
            bulkBookingSettings: room.bulkBookingSettings,
            pricing: {
              basePrice: getRoomPrice(room, market || '', inD, outD),
              mealPlanOptions: [
                { type: 'Half Board', price: 50 },
                { type: 'Full Board', price: 75 },
                { type: 'All-Inclusive', price: 100 }
              ]
            }
          };

          console.log(`Room ${room._id} AVAILABLE for bulk booking: ${availableQuantity} rooms, Price $${enrichedRoom.basePrice}`);
          return enrichedRoom;
        } catch (err) {
          console.error(`Error processing room ${room._id}:`, err);
          return null;
        }
      })
    );

    // Filter out null values
    const filteredAvailableRooms = availableRooms.filter((room) => room !== null);

    console.log('\n=== Bulk Availability Results ===');
    console.log(`Total bulk-enabled rooms checked: ${rooms.length}`);
    console.log(`Available rooms for bulk booking: ${filteredAvailableRooms.length}`);

    res.json({
      message: 'Bulk availability check completed',
      availableRooms: filteredAvailableRooms,
      summary: {
        totalRooms: rooms.length,
        availableRooms: filteredAvailableRooms.length,
        checkIn: checkIn,
        checkOut: checkOut,
        nights: Math.ceil((outD - inD) / (1000 * 60 * 60 * 24))
      }
    });
  } catch (err) {
    console.error('Error checking bulk availability:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Check specific room availability for bulk booking
router.get('/:roomId/bulk-availability', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { checkIn, checkOut, quantity = 1, market = 'default' } = req.query;

    console.log('\n=== Single Room Bulk Availability Check ===');
    console.log('Parameters:', { roomId, checkIn, checkOut, quantity, market });

    // Validate inputs
    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ msg: 'Missing required parameters' });
    }

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ msg: 'Invalid room ID format' });
    }

    const inD = new Date(checkIn);
    const outD = new Date(checkOut);

    // Validate dates
    if (isNaN(inD.getTime()) || isNaN(outD.getTime())) {
      return res.status(400).json({ msg: 'Invalid date format' });
    }

    if (inD >= outD) {
      return res.status(400).json({ msg: 'Check-out date must be after check-in date' });
    }

    // Normalize dates
    inD.setHours(0, 0, 0, 0);
    outD.setHours(23, 59, 59, 999);

    // Find the room
    const room = await Room.findById(roomId).lean();
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    // Check bulk booking availability
    const availability = room.isAvailableForBulkBooking(parseInt(quantity), checkIn, checkOut);
    
    if (!availability.available) {
      return res.json({
        available: false,
        reason: availability.reason,
        room: {
          _id: room._id,
          roomName: room.roomName,
          roomType: room.roomType
        }
      });
    }

    // Calculate pricing and discounts
    const basePrice = getRoomPrice(room, market, inD, outD);
    const bulkDiscount = room.calculateBulkDiscount(parseInt(quantity), market);
    
    // Calculate total price
    const totalPrice = basePrice * parseInt(quantity);
    const discountAmount = bulkDiscount.discountType === 'percentage' 
      ? (totalPrice * bulkDiscount.discountPercentage / 100)
      : bulkDiscount.discountValue;
    const finalPrice = totalPrice - discountAmount;

    res.json({
      available: true,
      room: {
        _id: room._id,
        roomName: room.roomName,
        roomType: room.roomType,
        maxOccupancy: room.maxOccupancy,
        amenities: room.amenities,
        availableQuantity: room.currentAvailableQuantity,
        timeConstraints: room.timeConstraints,
        bulkBookingSettings: room.bulkBookingSettings
      },
      pricing: {
        basePrice: basePrice,
        quantity: parseInt(quantity),
        totalPrice: totalPrice,
        bulkDiscount: bulkDiscount,
        discountAmount: discountAmount,
        finalPrice: finalPrice,
        mealPlanOptions: [
          { type: 'Half Board', price: 50 },
          { type: 'Full Board', price: 75 },
          { type: 'All-Inclusive', price: 100 }
        ]
      },
      availability: {
        checkIn: checkIn,
        checkOut: checkOut,
        nights: Math.ceil((outD - inD) / (1000 * 60 * 60 * 24)),
        canBeBooked: true
      }
    });
  } catch (err) {
    console.error('Error checking single room bulk availability:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update room availability (admin only)
router.put('/:roomId/availability', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { availableQuantity, reservedQuantity } = req.body;

    console.log(`\n=== Updating Room Availability ===`);
    console.log('Parameters:', { roomId, availableQuantity, reservedQuantity });

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ msg: 'Invalid room ID format' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    // Update availability
    if (availableQuantity !== undefined) {
      room.availableQuantity = availableQuantity;
    }
    
    if (reservedQuantity !== undefined) {
      room.reservedQuantity = reservedQuantity;
    }

    await room.save();

    res.json({
      message: 'Room availability updated successfully',
      room: {
        _id: room._id,
        roomName: room.roomName,
        availableQuantity: room.availableQuantity,
        reservedQuantity: room.reservedQuantity,
        currentAvailableQuantity: room.currentAvailableQuantity,
        utilizationPercentage: room.utilizationPercentage
      }
    });
  } catch (err) {
    console.error('Error updating room availability:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel', 'name location');
    if (!room) return res.status(404).json({ msg: 'Room not found' });
    res.json(room);
  } catch (err) {
    console.error('Error fetching room:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update room (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('Incoming prices:', req.body.prices);
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ msg: 'Room not found' });
    res.json(room);
    console.log('Updated room:', room._id);
  } catch (err) {
    console.error('Error updating room:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete room (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ msg: 'Room not found' });
    res.json({ msg: 'Room deleted' });
    console.log('Deleted room:', room._id);
  } catch (err) {
    console.error('Error deleting room:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;