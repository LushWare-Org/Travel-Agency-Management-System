// models/Booking.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    mealPlan: { type: String, enum: ['Full Board', 'Half Board', 'All-Inclusive'], required: true },
    adults: { type: Number, required: true },
    children: [
      {
        age: { type: Number, required: true }
      }
    ],    clientDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
    },
    passengerDetails: [
      {
        name: { type: String },
        passport: { type: String },
        country: { type: String },
        arrivalFlightNumber: { type: String },
        arrivalTime: { type: String },
        departureFlightNumber: { type: String },
        departureTime: { type: String },
        type: { type: String, enum: ['adult', 'child'], default: 'adult' }
      }
    ],
    additionalServices: [String],
    transportations: [
      {
        type: { type: String },
        method: { type: String }
      }
    ],
    priceBreakdown: {
      basePricePerNight: { type: Number },
      roomTotal: { type: Number },
      mealPlan: {
        type: {
          type: String
        },
        price: Number,
        total: Number
      },
      marketSurcharge: {
        type: {
          type: String
        },
        price: Number,
        total: Number
      },
      discounts: [
        {
          type: { type: String },
          value: Schema.Types.Mixed,
          description: String
        }
      ],
      total: { type: Number }
    },
    paymentMethod: { type: String },
    bookingReference: { type: String, unique: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Modified', 'Paid'], default: 'Pending' },
    rooms: { type: Number, required: true },
    nights: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    paidAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);
