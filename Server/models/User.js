// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['agent','admin','pending'], default: 'pending' },
  agencyProfile: { type: Schema.Types.ObjectId, ref: 'AgencyProfile' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
