const mongoose = require('mongoose');

const ActivityBookingSchema = new mongoose.Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: [true, 'Activity is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      // User is required only for bookings, not for inquiries
      return this.type === 'booking';
    }
  },
  bookingReference: {
    type: String,
    required: [true, 'Booking reference is required'],
    unique: true
  },
  type: {
    type: String,
    enum: ['inquiry', 'booking'],
    default: 'inquiry',
    required: [true, 'Booking type is required']
  },
  customerDetails: {
    fullName: {
      type: String,
      required: [true, 'Full name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    }
  },
  bookingDetails: {
    date: {
      type: Date,
      required: [true, 'Activity date is required']
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest is required']
    },
    specialRequests: {
      type: String,
      default: ''
    }
  },
  pricing: {
    pricePerPerson: {
      type: Number,
      required: [true, 'Price per person is required']
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required']
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'Waiting List'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending'
  },
  notes: {
    type: String,
    default: ''
  },
  confirmedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt field before saving
ActivityBookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Set confirmed/cancelled timestamps when status changes
ActivityBookingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'Confirmed' && !this.confirmedAt) {
      this.confirmedAt = new Date();
    } else if (this.status === 'Cancelled' && !this.cancelledAt) {
      this.cancelledAt = new Date();
    }
  }
  next();
});

module.exports = mongoose.model('ActivityBooking', ActivityBookingSchema);
