const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

const priceSchema = new mongoose.Schema({
  market: { type: String, required: true }, 
  price: { type: Number, required: true }
});

const pricePeriodSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  price: { type: Number, required: true }
});

// Bulk pricing schema for quantity-based discounts
const bulkPricingSchema = new mongoose.Schema({
  minQuantity: { type: Number, required: true, min: 1 },
  maxQuantity: { type: Number, min: 1 },
  discountType: { 
    type: String, 
    enum: ['percentage', 'fixed', 'tiered'], 
    required: true 
  },
  discountValue: { type: Number, required: true },
  description: { type: String },
  market: { type: String }, // Optional: market-specific bulk pricing
  validFrom: { type: Date },
  validTo: { type: Date }
});

// Check-in/out time constraints
const timeConstraintSchema = new mongoose.Schema({
  checkInTime: { 
    type: String, 
    required: true,
    default: '14:00' // Format: HH:MM
  },
  checkOutTime: { 
    type: String, 
    required: true,
    default: '12:00' // Format: HH:MM
  },
  earlyCheckInAllowed: { type: Boolean, default: false },
  lateCheckOutAllowed: { type: Boolean, default: false },
  earlyCheckInFee: { type: Number, default: 0 },
  lateCheckOutFee: { type: Number, default: 0 },
  flexibleCheckIn: { type: Boolean, default: false }, // Allow any time check-in
  flexibleCheckOut: { type: Boolean, default: false } // Allow any time check-out
});

const transportationSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['arrival', 'departure'] },
  method: { type: String, required: true }
});

const roomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  roomName: { type: String, required: true },
  roomType: { type: String, required: true },
  description: { type: String },
  size: { type: Number },
  bedType: { type: String },
  maxOccupancy: {
    adults: { type: Number, required: true },
    children: { type: Number, required: true }
  },
  amenities: [{ type: String }],
  availabilityCalendar: [availabilitySchema],
  gallery: [{ type: String }],
  prices: [priceSchema],
  pricePeriods: [pricePeriodSchema],
  transportations: [transportationSchema],
  
  // Bulk booking enhancements
  availableQuantity: { 
    type: Number, 
    required: true, 
    default: 1,
    min: 1 
  },
  
  // Current reserved quantity for bulk bookings
  reservedQuantity: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  
  // Bulk pricing tiers
  bulkPricing: [bulkPricingSchema],
  
  // Check-in/out time constraints
  timeConstraints: {
    type: timeConstraintSchema,
    default: {
      checkInTime: '14:00',
      checkOutTime: '12:00',
      earlyCheckInAllowed: false,
      lateCheckOutAllowed: false,
      earlyCheckInFee: 0,
      lateCheckOutFee: 0,
      flexibleCheckIn: false,
      flexibleCheckOut: false
    }
  },
  
  // Bulk booking specific settings
  bulkBookingSettings: {
    allowBulkBooking: { type: Boolean, default: true },
    minBulkQuantity: { type: Number, default: 1 },
    maxBulkQuantity: { type: Number, default: 10 },
    requireAdvanceNotice: { type: Number, default: 24 }, // Hours in advance
    bulkDiscountEnabled: { type: Boolean, default: false },
    groupPolicies: {
      allowGroupBookings: { type: Boolean, default: true },
      maxGroupSize: { type: Number, default: 20 },
      groupDiscountThreshold: { type: Number, default: 5 }
    }
  },
  
  // Room status and availability
  isActive: { type: Boolean, default: true },
  maintenanceSchedule: [{
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String },
    isScheduled: { type: Boolean, default: false }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for currently available quantity
roomSchema.virtual('currentAvailableQuantity').get(function() {
  return Math.max(0, this.availableQuantity - this.reservedQuantity);
});

// Virtual for utilization percentage
roomSchema.virtual('utilizationPercentage').get(function() {
  if (this.availableQuantity === 0) return 0;
  return Math.round((this.reservedQuantity / this.availableQuantity) * 100);
});

// Indexes for better query performance
roomSchema.index({ hotel: 1, isActive: 1 });
roomSchema.index({ 'bulkBookingSettings.allowBulkBooking': 1, isActive: 1 });
roomSchema.index({ availableQuantity: 1 });
roomSchema.index({ reservedQuantity: 1 });

// Pre-save middleware to validate quantities
roomSchema.pre('save', function(next) {
  // Ensure reserved quantity doesn't exceed available quantity
  if (this.reservedQuantity > this.availableQuantity) {
    this.reservedQuantity = this.availableQuantity;
  }
  
  // Ensure min bulk quantity doesn't exceed max bulk quantity
  if (this.bulkBookingSettings.minBulkQuantity > this.bulkBookingSettings.maxBulkQuantity) {
    this.bulkBookingSettings.minBulkQuantity = this.bulkBookingSettings.maxBulkQuantity;
  }
  
  // Ensure max bulk quantity doesn't exceed available quantity
  if (this.bulkBookingSettings.maxBulkQuantity > this.availableQuantity) {
    this.bulkBookingSettings.maxBulkQuantity = this.availableQuantity;
  }
  
  next();
});

// Method to check if room is available for bulk booking
roomSchema.methods.isAvailableForBulkBooking = function(quantity, checkIn, checkOut) {
  // Check if bulk booking is allowed
  if (!this.bulkBookingSettings.allowBulkBooking || !this.isActive) {
    return { available: false, reason: 'Bulk booking not allowed or room inactive' };
  }
  
  // Check quantity constraints
  if (quantity < this.bulkBookingSettings.minBulkQuantity) {
    return { available: false, reason: `Minimum quantity is ${this.bulkBookingSettings.minBulkQuantity}` };
  }
  
  if (quantity > this.bulkBookingSettings.maxBulkQuantity) {
    return { available: false, reason: `Maximum quantity is ${this.bulkBookingSettings.maxBulkQuantity}` };
  }
  
  // Check if enough rooms are available
  if (quantity > this.currentAvailableQuantity) {
    return { available: false, reason: `Only ${this.currentAvailableQuantity} rooms available` };
  }
  
  // Check maintenance schedule
  if (this.maintenanceSchedule && this.maintenanceSchedule.length > 0) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    const hasMaintenanceConflict = this.maintenanceSchedule.some(maintenance => {
      const maintenanceStart = new Date(maintenance.startDate);
      const maintenanceEnd = new Date(maintenance.endDate);
      
      return (checkInDate < maintenanceEnd && checkOutDate > maintenanceStart);
    });
    
    if (hasMaintenanceConflict) {
      return { available: false, reason: 'Room under maintenance during requested dates' };
    }
  }
  
  // Check advance notice requirement
  const now = new Date();
  const checkInDate = new Date(checkIn);
  const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);
  
  if (hoursUntilCheckIn < this.bulkBookingSettings.requireAdvanceNotice) {
    return { available: false, reason: `Requires ${this.bulkBookingSettings.requireAdvanceNotice} hours advance notice` };
  }
  
  return { available: true, reason: 'Available for bulk booking' };
};

// Method to calculate bulk discount
roomSchema.methods.calculateBulkDiscount = function(quantity, market = 'default') {
  if (!this.bulkBookingSettings.bulkDiscountEnabled || !this.bulkPricing || this.bulkPricing.length === 0) {
    return { discountType: 'none', discountValue: 0, discountPercentage: 0 };
  }
  
  // Find applicable bulk pricing
  const applicablePricing = this.bulkPricing
    .filter(pricing => {
      // Check market match (if specified)
      if (pricing.market && pricing.market !== market) return false;
      
      // Check date validity
      const now = new Date();
      if (pricing.validFrom && now < pricing.validFrom) return false;
      if (pricing.validTo && now > pricing.validTo) return false;
      
      // Check quantity range
      if (quantity < pricing.minQuantity) return false;
      if (pricing.maxQuantity && quantity > pricing.maxQuantity) return false;
      
      return true;
    })
    .sort((a, b) => b.minQuantity - a.minQuantity)[0]; // Get highest applicable tier
  
  if (!applicablePricing) {
    return { discountType: 'none', discountValue: 0, discountPercentage: 0 };
  }
  
  const { discountType, discountValue } = applicablePricing;
  
  if (discountType === 'percentage') {
    return {
      discountType: 'percentage',
      discountValue: discountValue,
      discountPercentage: discountValue,
      description: applicablePricing.description
    };
  } else if (discountType === 'fixed') {
    return {
      discountType: 'fixed',
      discountValue: discountValue,
      discountPercentage: 0, // Will be calculated based on room price
      description: applicablePricing.description
    };
  }
  
  return { discountType: 'none', discountValue: 0, discountPercentage: 0 };
};

// Method to reserve rooms for bulk booking
roomSchema.methods.reserveRooms = function(quantity) {
  if (quantity > this.currentAvailableQuantity) {
    throw new Error(`Cannot reserve ${quantity} rooms. Only ${this.currentAvailableQuantity} available.`);
  }
  
  this.reservedQuantity += quantity;
  return this.save();
};

// Method to release room reservations
roomSchema.methods.releaseRooms = function(quantity) {
  if (quantity > this.reservedQuantity) {
    throw new Error(`Cannot release ${quantity} rooms. Only ${this.reservedQuantity} reserved.`);
  }
  
  this.reservedQuantity -= quantity;
  return this.save();
};

// Method to update room availability
roomSchema.methods.updateAvailability = function(newAvailableQuantity) {
  if (newAvailableQuantity < this.reservedQuantity) {
    throw new Error(`Cannot set available quantity to ${newAvailableQuantity}. ${this.reservedQuantity} rooms are currently reserved.`);
  }
  
  this.availableQuantity = newAvailableQuantity;
  return this.save();
};

// Static method to find rooms available for bulk booking
roomSchema.statics.findAvailableForBulkBooking = async function(hotelId, quantity, checkIn, checkOut, market = 'default') {
  const rooms = await this.find({
    hotel: hotelId,
    isActive: true,
    'bulkBookingSettings.allowBulkBooking': true,
    availableQuantity: { $gte: quantity }
  });
  
  const availableRooms = [];
  for (const room of rooms) {
    const availability = room.isAvailableForBulkBooking(quantity, checkIn, checkOut);
    if (availability.available) {
      availableRooms.push(room.toObject());
    }
  }
  
  return availableRooms;
};

module.exports = mongoose.model('Room', roomSchema);