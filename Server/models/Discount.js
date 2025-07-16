const mongoose = require('mongoose');
const { Schema } = mongoose;

const DiscountSchema = new Schema(
  {
    discountType: { 
      type: String, 
      enum: ['percentage', 'seasonal', 'exclusive', 'transportation', 'libert'], 
      required: true 
    },
    value: { type: Number },
    discountValues: [
      {
        market: { type: String, required: true },
        value: { type: Number, required: true },
        type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' }
      }
    ],
    description: { type: String, required: true },
    conditions: {
      minNights: Number,
      bookingWindow: {
        start: Date,
        end: Date
      },
      stayPeriod: {
        start: Date,
        end: Date
      },
      bookingVolume: Number,
      minStayDays: Number,
      minBookings: Number,
      isDefault: { type: Boolean, default: false },
      seasonalMonths: [Number]
    },
    applicableHotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
    active: { type: Boolean, default: true },
    imageURL: String,
    eligibleAgents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    usedAgents: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Discount', DiscountSchema);