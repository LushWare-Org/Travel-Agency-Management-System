const mongoose = require('mongoose');
const { Schema } = mongoose;

const BulkBookingSchema = new Schema({
  // Bulk booking metadata
  bulkBookingReference: { 
    type: String, 
    unique: true, 
    required: true 
  },
  groupName: {
    type: String,
    required: true,
    trim: true
  },
  
  // User who created the bulk booking
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Bulk booking common details
  checkIn: { 
    type: Date, 
    required: true 
  },
  checkOut: { 
    type: Date, 
    required: true 
  },
  checkInTime: { 
    type: String, 
    default: '14:00' // Format: HH:MM
  },
  checkOutTime: { 
    type: String, 
    default: '12:00' // Format: HH:MM
  },
  
  // Guest details
  adults: { 
    type: Number, 
    required: true,
    min: 1
  },
  children: { 
    type: Number, 
    default: 0,
    min: 0
  },
  
  // Meal plan
  mealPlan: { 
    type: String, 
    enum: ['Room Only', 'Bed & Breakfast', 'Half Board', 'Full Board', 'All-Inclusive'], 
    required: true 
  },
  
  // Individual bookings within this bulk booking
  bookings: [{
    // Room details for this specific booking
    hotel: { 
      type: Schema.Types.ObjectId, 
      ref: 'Hotel', 
      required: true 
    },
    room: { 
      type: Schema.Types.ObjectId, 
      ref: 'Room', 
      required: true 
    },
    
    // Room details (embedded for easy access)
    roomDetails: {
      _id: { type: Schema.Types.ObjectId },
      roomName: { type: String },
      roomType: { type: String },
      description: { type: String },
      size: { type: Number },
      bedType: { type: String },
      maxOccupancy: {
        adults: { type: Number },
        children: { type: Number }
      },
      amenities: [{ type: String }]
    },
    
    // Client details for this specific booking
    clientDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      companyName: { type: String }
    },
    
    // Booking status
    status: { 
      type: String, 
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Modified', 'Paid'], 
      default: 'Pending' 
    },
    
    // Price details for this booking
    priceBreakdown: {
      basePricePerNight: { type: Number },
      roomTotal: { type: Number },
      mealPlanTotal: { type: Number },
      totalNights: { type: Number },
      total: { type: Number }
    }
  }],
  
  // Bulk booking status
  status: { 
    type: String, 
    enum: ['Draft', 'Pending', 'Confirmed', 'Partially Confirmed', 'Cancelled', 'Completed'], 
    default: 'Pending' 
  },
  
  // Bulk booking summary
  summary: {
    totalBookings: { type: Number, default: 0 },
    confirmedBookings: { type: Number, default: 0 },
    cancelledBookings: { type: Number, default: 0 },
    totalRooms: { type: Number, default: 0 },
    totalNights: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    averagePricePerRoom: { type: Number, default: 0 }
  },
  
  // Bulk booking settings
  settings: {
    allowPartialConfirmation: { type: Boolean, default: true },
    requireAllConfirmation: { type: Boolean, default: false },
    autoConfirmOnPayment: { type: Boolean, default: false },
    sendBulkNotifications: { type: Boolean, default: true }
  },
  
  // Payment details
  payment: {
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    paymentMethod: { type: String },
    paymentStatus: { 
      type: String, 
      enum: ['Pending', 'Partial', 'Paid', 'Refunded'], 
      default: 'Pending' 
    },
    paymentReference: { type: String }
  },
  
  // Special requests or notes for the entire bulk booking
  specialRequests: { type: String },
  notes: { type: String },
  
  // Cancellation details for bulk booking
  cancellationDetails: {
    cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
    cancelledAt: { type: Date },
    cancellationReason: { 
      type: String,
      enum: ['Customer Request', 'No Show', 'Payment Failed', 'Hotel Issue', 'Weather', 'Force Majeure', 'Other']
    },
    refundAmount: { type: Number, default: 0 },
    refundMethod: { 
      type: String,
      enum: ['Bank Transfer', 'Credit Card', 'Cash', 'No Refund']
    },
    refundProcessedAt: { type: Date },
    cancellationNotes: { type: String },
    cancellationFee: { type: Number, default: 0 }
  },
  
  // Audit trail
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  lastModifiedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for nights calculation
BulkBookingSchema.virtual('nights').get(function() {
  if (this.checkIn && this.checkOut) {
    const checkInDate = new Date(this.checkIn);
    const checkOutDate = new Date(this.checkOut);
    return Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual for completion percentage
BulkBookingSchema.virtual('completionPercentage').get(function() {
  if (this.summary.totalBookings === 0) return 0;
  return Math.round((this.summary.confirmedBookings / this.summary.totalBookings) * 100);
});

// Pre-save middleware to generate bulk booking reference
BulkBookingSchema.pre('save', function(next) {
  if (!this.bulkBookingReference) {
    this.bulkBookingReference = 'BB-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  
  // Update summary
  this.summary.totalBookings = this.bookings.length;
  this.summary.confirmedBookings = this.bookings.filter(b => b.status === 'Confirmed').length;
  this.summary.cancelledBookings = this.bookings.filter(b => b.status === 'Cancelled').length;
  this.summary.totalRooms = this.bookings.length;
  this.summary.totalNights = this.nights;
  
  // Calculate total amount
  this.summary.totalAmount = this.bookings.reduce((total, booking) => {
    return total + (booking.priceBreakdown?.total || 0);
  }, 0);
  
  // Calculate average price per room
  if (this.summary.totalRooms > 0) {
    this.summary.averagePricePerRoom = this.summary.totalAmount / this.summary.totalRooms;
  }
  
  // Update payment pending amount
  this.payment.pendingAmount = this.payment.totalAmount - this.payment.paidAmount;
  
  // Update bulk booking status based on individual bookings
  if (this.summary.cancelledBookings === this.summary.totalBookings) {
    this.status = 'Cancelled';
  } else if (this.summary.confirmedBookings === this.summary.totalBookings) {
    this.status = 'Confirmed';
  } else if (this.summary.confirmedBookings > 0) {
    this.status = 'Partially Confirmed';
  } else {
    this.status = 'Pending';
  }
  
  next();
});

// Method to add a booking to the bulk booking
BulkBookingSchema.methods.addBooking = function(bookingData) {
  this.bookings.push({
    booking: bookingData.bookingId,
    hotel: bookingData.hotelId,
    room: bookingData.roomId,
    clientDetails: bookingData.clientDetails,
    status: 'Pending',
    priceBreakdown: bookingData.priceBreakdown
  });
  
  return this.save();
};

// Method to update booking status within bulk booking
BulkBookingSchema.methods.updateBookingStatus = function(bookingIndex, newStatus) {
  if (bookingIndex >= 0 && bookingIndex < this.bookings.length) {
    this.bookings[bookingIndex].status = newStatus;
    return this.save();
  }
  throw new Error('Invalid booking index');
};

// Method to cancel bulk booking
BulkBookingSchema.methods.cancelBulkBooking = function(cancellationDetails, userId) {
  this.status = 'Cancelled';
  this.cancellationDetails = {
    ...cancellationDetails,
    cancelledBy: userId,
    cancelledAt: new Date()
  };
  
  // Cancel all individual bookings
  this.bookings.forEach(booking => {
    if (booking.status !== 'Cancelled') {
      booking.status = 'Cancelled';
    }
  });
  
  return this.save();
};

// Method to confirm all bookings in bulk
BulkBookingSchema.methods.confirmAllBookings = function() {
  this.bookings.forEach(booking => {
    if (booking.status === 'Pending') {
      booking.status = 'Confirmed';
    }
  });
  
  this.status = 'Confirmed';
  return this.save();
};

// Static method to find bulk bookings by date range
BulkBookingSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    checkIn: { $gte: new Date(startDate) },
    checkOut: { $lte: new Date(endDate) }
  }).populate('user').populate('bookings.booking');
};

// Static method to get bulk booking statistics
BulkBookingSchema.statics.getStatistics = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalBulkBookings: { $sum: 1 },
        totalIndividualBookings: { $sum: '$summary.totalBookings' },
        totalRevenue: { $sum: '$summary.totalAmount' },
        averageBulkSize: { $avg: '$summary.totalBookings' },
        confirmedBulkBookings: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Confirmed'] }, 1, 0]
          }
        },
        pendingBulkBookings: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0]
          }
        }
      }
    }
  ]);
};

// Indexes for better query performance
BulkBookingSchema.index({ bulkBookingReference: 1 });
BulkBookingSchema.index({ user: 1, createdAt: -1 });
BulkBookingSchema.index({ status: 1 });
BulkBookingSchema.index({ checkIn: 1, checkOut: 1 });
BulkBookingSchema.index({ 'bookings.booking': 1 });

module.exports = mongoose.model('BulkBooking', BulkBookingSchema);
