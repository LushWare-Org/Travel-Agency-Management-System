// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username:      { type: String, required: true, unique: true },
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  country:       { type: String, required: true },
  phoneNumber:   { type: String, required: true },
  password:      { type: String, required: true },
  role:          { type: String, enum: ['agent','admin','pending'], default: 'pending' },
  agencyProfile: { type: Schema.Types.ObjectId, ref: 'AgencyProfile' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
