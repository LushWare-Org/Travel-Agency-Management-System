// models/AgencyProfile.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddressSchema = new Schema({
  street:   String,
  city:     String,
  zipCode:  String,
  state:    String,
  country:  String,
});

const AgencyProfileSchema = new Schema({
  user:                { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username:            { type: String, required: true },
  agencyName:          { type: String, required: true },
  corporateName:       String,
  taxRegistrationNo:   { type: String, required: true },
  contactPerson:       { type: String, required: true },
  address:             AddressSchema,
  phoneNumber:         String,
  phoneNumber2:        String,
  mobilePhone:         String,
  fax:                 String,
  invoicingContact:    String,
  billingAgencyName:   String,
  billingEmail:        String,
  billingAddress:      AddressSchema,
  billingPhoneNumber:  String,
  remarks:             String,
}, { timestamps: true });

module.exports = mongoose.model('AgencyProfile', AgencyProfileSchema);
