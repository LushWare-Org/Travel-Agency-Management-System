// models/Inquiry.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Base inquiry schema with common fields
const baseInquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending'
    },
  },
  {
    timestamps: true,
    discriminatorKey: 'inquiry_type'
  }
);

// Tour inquiry schema - extends base
const tourInquirySchema = new Schema({
  travel_date: { type: Date, required: true },
  traveller_count: { type: Number, required: true },
  tour: { type: String, required: true },
  final_price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  selected_nights_key: { type: Number, default: 0 },
  selected_nights_option: { type: String, default: '' },
  selected_food_category: { type: String, default: '' },
});

// Room inquiry schema - extends base
const roomInquirySchema = new Schema({
  guest_count: { type: Number, required: true },
  room_id: { type: String, required: true },
  hotel_id: { type: String, required: true },
  room_name: { type: String, required: true },
  hotel_name: { type: String, required: true },
  base_price_per_night: { type: Number, required: true },
  meal_plan: { type: String, default: null },
  market: { type: String, default: null },
  check_in: { type: Date, required: true },
  check_out: { type: Date, required: true },
});

// Create the base model
const Inquiry = mongoose.model('Inquiry', baseInquirySchema);

// Create discriminator models
const TourInquiry = Inquiry.discriminator('tour', tourInquirySchema);
const RoomInquiry = Inquiry.discriminator('room', roomInquirySchema);

module.exports = {
  Inquiry,
  TourInquiry,
  RoomInquiry
};