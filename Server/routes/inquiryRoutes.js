const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const { Inquiry, TourInquiry, RoomInquiry } = require('../models/inquirySubmission');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();
const auth = require('../middleware/auth');
const { generateCustomerQuote } = require('../utils/customerQuotePdfGenerator');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'shaliniavindya@gmail.com',
    pass: 'yznmifeajrkjkfxk',
  }
});

// Function to send admin email for tour inquiries
const sendAdminTourInquiryEmail = async (inquiryData) => {
  const {
    name,
    email,
    phone_number,
    travel_date,
    traveller_count,
    message,
    tour,
    final_price,
    currency,
    selected_nights_key,
    selected_nights_option,
    selected_food_category
  } = inquiryData;

  const htmlContent = `
    <h2>New Travel Inquiry</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone_number}</p>
    <p><strong>Travel Date:</strong> ${travel_date}</p>
    <p><strong>Traveller Count:</strong> ${traveller_count}</p>
    ${tour ? `<p><strong>Tour ID:</strong> ${tour}</p>` : ''}
    ${final_price ? `<p><strong>Final Price:</strong> ${final_price}</p>` : ''}
    ${currency ? `<p><strong>Currency:</strong> ${currency}</p>` : ''}
    ${selected_nights_key ? `<p><strong>Selected Nights:</strong> ${selected_nights_key}</p>` : ''}
    ${selected_nights_option ? `<p><strong>Selected Nights Option:</strong> ${selected_nights_option}</p>` : ''}
    ${selected_food_category ? `<p><strong>Selected Food Category:</strong> ${selected_food_category}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  const mailOptionsAdmin = {
    from: 'shaliniavindya@gmail.com',
    to: 'shaliniavindya@gmail.com',
    subject: `New Travel Inquiry from ${name}`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptionsAdmin);
};

// Function to send admin email for room inquiries
const sendAdminRoomInquiryEmail = async (inquiryData) => {
  const {
    name,
    email,
    phone_number,
    guest_count,
    message,
    room_name,
    hotel_name,
    base_price_per_night,
    meal_plan,
    market,
    check_in,
    check_out
  } = inquiryData;

  const nights = check_in && check_out ?
    Math.ceil((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = nights * (base_price_per_night || 0);

  const htmlContent = `
    <h2>New Room Inquiry</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone_number}</p>
    <p><strong>Guest Count:</strong> ${guest_count}</p>
    <p><strong>Room:</strong> ${room_name}</p>
    <p><strong>Hotel:</strong> ${hotel_name}</p>
    <p><strong>Check-in:</strong> ${check_in ? new Date(check_in).toLocaleDateString() : 'N/A'}</p>
    <p><strong>Check-out:</strong> ${check_out ? new Date(check_out).toLocaleDateString() : 'N/A'}</p>
    <p><strong>Nights:</strong> ${nights}</p>
    <p><strong>Price per Night:</strong> $${base_price_per_night}</p>
    <p><strong>Total Price:</strong> $${totalPrice}</p>
    <p><strong>Meal Plan:</strong> ${meal_plan || 'Not selected'}</p>
    <p><strong>Market:</strong> ${market || 'Not selected'}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  const mailOptionsAdmin = {
    from: 'shaliniavindya@gmail.com',
    to: 'shaliniavindya@gmail.com',
    subject: `New Room Inquiry from ${name}`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptionsAdmin);
};

// Function to send user inquiry email for tour inquiries
const sendUserTourInquiryEmail = async (inquiryData) => {
  const {
    name,
    email,
    phone_number,
    travel_date,
    traveller_count,
    message,
    tour,
    final_price,
    currency,
    selected_nights_key,
    selected_nights_option,
    selected_food_category
  } = inquiryData;

  const htmlContent = `
    <h2>New Travel Inquiry</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone_number}</p>
    <p><strong>Travel Date:</strong> ${travel_date}</p>
    <p><strong>Traveller Count:</strong> ${traveller_count}</p>
    ${tour ? `<p><strong>Tour ID:</strong> ${tour}</p>` : ''}
    ${final_price ? `<p><strong>Final Price:</strong> ${final_price}</p>` : ''}
    ${currency ? `<p><strong>Currency:</strong> ${currency}</p>` : ''}
    ${selected_nights_key ? `<p><strong>Selected Nights:</strong> ${selected_nights_key}</p>` : ''}
    ${selected_nights_option ? `<p><strong>Selected Nights Option:</strong> ${selected_nights_option}</p>` : ''}
    ${selected_food_category ? `<p><strong>Selected Food Category:</strong> ${selected_food_category}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  const mailOptionsUser = {
    from: 'shaliniavindya@gmail.com',
    to: email,
    subject: 'Thank you for your inquiry!',
    html: `
      <h2>Thank you for your inquiry, ${name}!</h2>
      <p>We have received your travel inquiry and will get back to you shortly.</p>
      <p>Here are the details you provided:</p>
      ${htmlContent}
    `,
  };

  return transporter.sendMail(mailOptionsUser);
};

// Function to send user inquiry email for room inquiries
const sendUserRoomInquiryEmail = async (inquiryData) => {
  const {
    name,
    email,
    phone_number,
    guest_count,
    message,
    room_name,
    hotel_name,
    base_price_per_night,
    meal_plan,
    market,
    check_in,
    check_out
  } = inquiryData;

  const nights = check_in && check_out ?
    Math.ceil((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = nights * (base_price_per_night || 0);

  const htmlContent = `
    <h2>New Room Inquiry</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone_number}</p>
    <p><strong>Guest Count:</strong> ${guest_count}</p>
    <p><strong>Room:</strong> ${room_name}</p>
    <p><strong>Hotel:</strong> ${hotel_name}</p>
    <p><strong>Check-in:</strong> ${check_in ? new Date(check_in).toLocaleDateString() : 'N/A'}</p>
    <p><strong>Check-out:</strong> ${check_out ? new Date(check_out).toLocaleDateString() : 'N/A'}</p>
    <p><strong>Nights:</strong> ${nights}</p>
    <p><strong>Price per Night:</strong> $${base_price_per_night}</p>
    <p><strong>Total Price:</strong> $${totalPrice}</p>
    <p><strong>Meal Plan:</strong> ${meal_plan || 'Not selected'}</p>
    <p><strong>Market:</strong> ${market || 'Not selected'}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  const mailOptionsUser = {
    from: 'shaliniavindya@gmail.com',
    to: email,
    subject: 'Thank you for your inquiry!',
    html: `
      <h2>Thank you for your inquiry, ${name}!</h2>
      <p>We have received your room inquiry and will get back to you shortly.</p>
      <p>Here are the details you provided:</p>
      ${htmlContent}
    `,
  };

  return transporter.sendMail(mailOptionsUser);
};

// Function to send confirmation email for tour inquiries
const sendTourConfirmationEmail = async (inquiry) => {
  const {
    name,
    email,
    tour,
    travel_date,
    traveller_count,
    final_price,
    currency
  } = inquiry;

  const htmlContent = `
    <h2>Tour Inquiry Confirmation</h2>
    <p>Dear ${name},</p>
    <p>Your tour inquiry has been confirmed!</p>
    <p><strong>Tour:</strong> ${tour || 'N/A'}</p>
    <p><strong>Travel Date:</strong> ${travel_date}</p>
    <p><strong>Traveller Count:</strong> ${traveller_count}</p>
    <p><strong>Final Price:</strong> ${final_price} ${currency}</p>
    <p>We look forward to assisting you with your travel plans.</p>
    <p>Best regards,<br>Travel Agency Team</p>
  `;

  const mailOptions = {
    from: 'shaliniavindya@gmail.com',
    to: email,
    subject: `Tour Inquiry Confirmation for ${name}`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

// Function to send confirmation email for room inquiries
const sendRoomConfirmationEmail = async (inquiry) => {
  const {
    name,
    email,
    guest_count,
    room_name,
    hotel_name,
    check_in,
    check_out,
    base_price_per_night
  } = inquiry;

  const nights = check_in && check_out ?
    Math.ceil((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = nights * (base_price_per_night || 0);

  const htmlContent = `
    <h2>Room Inquiry Confirmation</h2>
    <p>Dear ${name},</p>
    <p>Your room inquiry has been confirmed!</p>
    <p><strong>Room:</strong> ${room_name || 'N/A'}</p>
    <p><strong>Hotel:</strong> ${hotel_name || 'N/A'}</p>
    <p><strong>Check-in:</strong> ${check_in ? new Date(check_in).toLocaleDateString() : 'N/A'}</p>
    <p><strong>Check-out:</strong> ${check_out ? new Date(check_out).toLocaleDateString() : 'N/A'}</p>
    <p><strong>Nights:</strong> ${nights}</p>
    <p><strong>Guest Count:</strong> ${guest_count}</p>
    <p><strong>Price per Night:</strong> $${base_price_per_night}</p>
    <p><strong>Total Price:</strong> $${totalPrice}</p>
    <p>We look forward to assisting you with your accommodation plans.</p>
    <p>Best regards,<br>Travel Agency Team</p>
  `;

  const mailOptions = {
    from: 'shaliniavindya@gmail.com',
    to: email,
    subject: `Room Inquiry Confirmation for ${name}`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

// POST / - Save inquiry and send emails
router.post('/', async (req, res) => {
  const {
    name,
    email,
    phone_number,
    message,
    inquiry_type,
    // Tour fields
    travel_date,
    traveller_count,
    tour,
    final_price,
    currency,
    selected_nights_key,
    selected_nights_option,
    selected_food_category,
    // Room fields
    guest_count,
    room_id,
    hotel_id,
    room_name,
    hotel_name,
    base_price_per_night,
    meal_plan,
    market,
    check_in,
    check_out
  } = req.body;

  // Validation based on inquiry type
  if (!name || !email || !phone_number) {
    return res.status(400).json({ message: 'Name, email, and phone number are required.' });
  }

  let newInquiry;
  let inquiryData;

  try {
    if (inquiry_type === 'room') {
      // Room inquiry validation
      if (!guest_count || !room_id || !hotel_id || !check_in || !check_out) {
        return res.status(400).json({ message: 'Guest count, room ID, hotel ID, check-in and check-out dates are required for room inquiries.' });
      }

      newInquiry = new RoomInquiry({
        name,
        email,
        phone_number,
        message,
        guest_count,
        room_id,
        hotel_id,
        room_name,
        hotel_name,
        base_price_per_night,
        meal_plan,
        market,
        check_in: new Date(check_in),
        check_out: new Date(check_out),
      });

      inquiryData = {
        name,
        email,
        phone_number,
        guest_count,
        message,
        room_name,
        hotel_name,
        base_price_per_night,
        meal_plan,
        market,
        check_in,
        check_out
      };

      await Promise.all([
        sendAdminRoomInquiryEmail(inquiryData),
        sendUserRoomInquiryEmail(inquiryData)
      ]);
    } else {
      // Tour inquiry validation
      if (!travel_date || !traveller_count || !tour) {
        return res.status(400).json({ message: 'Travel date, traveller count, and tour are required for tour inquiries.' });
      }

      newInquiry = new TourInquiry({
        name,
        email,
        phone_number,
        message,
        travel_date: new Date(travel_date),
        traveller_count,
        tour,
        final_price,
        currency,
        selected_nights_key,
        selected_nights_option,
        selected_food_category,
      });

      inquiryData = {
        name,
        email,
        phone_number,
        travel_date,
        traveller_count,
        message,
        tour,
        final_price,
        currency,
        selected_nights_key,
        selected_nights_option,
        selected_food_category
      };

      await Promise.all([
        sendAdminTourInquiryEmail(inquiryData),
        sendUserTourInquiryEmail(inquiryData)
      ]);
    }

    await newInquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully!', inquiry: newInquiry });
  } catch (error) {
    console.error('Error processing inquiry submission:', error);
    res.status(500).json({ message: 'Error: Unable to submit your inquiry.', error: error.message });
  }
});

// GET / - Fetch all inquiries or filter by type
router.get('/', async (req, res) => {
  try {
    const { inquiry_type } = req.query;
    let query = {};

    if (inquiry_type) {
      query.inquiry_type = inquiry_type;
    }

    const inquiries = await Inquiry.find(query);
    console.log('Fetched inquiries:', inquiries.map(i => ({ id: i._id, status: i.status, type: i.inquiry_type })));
    const validInquiries = inquiries.filter(inquiry =>
      ['Pending', 'Confirmed', 'Cancelled'].includes(inquiry.status)
    );
    res.json(validInquiries);
  } catch (error) {
    console.error('Error retrieving inquiries:', error);
    res.status(500).json({ message: 'Error retrieving inquiries.', error: error.message });
  }
});

// GET /my - Fetch inquiries for the logged-in agent only
router.get('/my', auth, async (req, res) => {
  try {
    const { inquiry_type } = req.query;
    let query = { email: req.user.email };

    if (inquiry_type) {
      query.inquiry_type = inquiry_type;
    }

    const inquiries = await Inquiry.find(query);
    const validInquiries = inquiries.filter(inquiry =>
      ['Pending', 'Confirmed', 'Cancelled'].includes(inquiry.status)
    );
    res.json(validInquiries);
  } catch (error) {
    console.error('Error retrieving agent inquiries:', error);
    res.status(500).json({ message: 'Error retrieving agent inquiries.', error: error.message });
  }
});

// GET /:id - Fetch a single inquiry by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    res.json(inquiry);
  } catch (error) {
    console.error('Error retrieving inquiry:', error);
    res.status(500).json({ message: 'Error retrieving inquiry.', error: error.message });
  }
});

// DELETE /:id - Delete a specific inquiry
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Inquiry.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted successfully.' });
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    res.status(500).json({ message: 'Error deleting inquiry.' });
  }
});

// PUT /:id/confirm - Confirm an inquiry
router.put('/:id/confirm', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    if (inquiry.status !== 'Pending') return res.status(400).json({ message: 'Only pending inquiries can be confirmed.' });

    inquiry.status = 'Confirmed';
    await inquiry.save();

    // Send appropriate confirmation email based on inquiry type
    if (inquiry.inquiry_type === 'room') {
      await sendRoomConfirmationEmail(inquiry);
    } else {
      await sendTourConfirmationEmail(inquiry);
    }

    res.json({ message: 'Inquiry confirmed successfully.', inquiry });
  } catch (error) {
    console.error('Error confirming inquiry:', error);
    res.status(500).json({ message: 'Error confirming inquiry.', error: error.message });
  }
});

// PUT /:id/cancel - Cancel an inquiry
router.put('/:id/cancel', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    if (inquiry.status === 'Cancelled') return res.status(400).json({ message: 'Inquiry is already cancelled.' });

    inquiry.status = 'Cancelled';
    await inquiry.save();

    res.json({ message: 'Inquiry cancelled successfully.', inquiry });
  } catch (error) {
    console.error('Error cancelling inquiry:', error);
    res.status(500).json({ message: 'Error cancelling inquiry.', error: error.message });
  }
});

// PUT /:id/reconfirm - Reconfirm a cancelled inquiry
router.put('/:id/reconfirm', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    if (inquiry.status !== 'Cancelled') return res.status(400).json({ message: 'Only cancelled inquiries can be reconfirmed.' });

    inquiry.status = 'Confirmed';
    await inquiry.save();

    // Send appropriate confirmation email based on inquiry type
    if (inquiry.inquiry_type === 'room') {
      await sendRoomConfirmationEmail(inquiry);
    } else {
      await sendTourConfirmationEmail(inquiry);
    }

    res.json({ message: 'Inquiry reconfirmed successfully.', inquiry });
  } catch (error) {
    console.error('Error reconfirming inquiry:', error);
    res.status(500).json({ message: 'Error reconfirming inquiry.', error: error.message });
  }
});

// Generate customer quote PDF for a tour inquiry
router.post('/:id/customer-quote', auth, async (req, res) => {
  try {
    console.log('Starting quote generation for inquiry:', req.params.id);
    
    // Input validation
    const { profitMargin, marginType = 'percentage' } = req.body;
    if (typeof profitMargin !== 'number' || profitMargin < 0) {
      console.log('Invalid profit margin:', profitMargin);
      return res.status(400).json({ msg: 'Invalid profit margin' });
    }
    
    // Find and validate inquiry
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      console.log('Inquiry not found:', req.params.id);
      return res.status(404).json({ msg: 'Inquiry not found' });
    }

    // Check inquiry status
    if (inquiry.status !== 'Confirmed') {
      console.log('Invalid inquiry status:', inquiry.status);
      return res.status(403).json({ msg: 'Inquiry must be confirmed to generate a quote' });
    }

    // Validate ownership
    if (!req.user || inquiry.email !== req.user.email) {
      console.log('Authorization failed. User:', req.user?.email, 'Inquiry owner:', inquiry.email);
      return res.status(403).json({ msg: 'Not authorized to generate quote for this inquiry' });
    }

    // Find user and agency profile
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found:', req.user.userId);
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get agency profile with proper population
    const agencyProfile = await mongoose.model('AgencyProfile').findOne({ user: user._id });
    if (!agencyProfile) {
      console.log('Agency profile not found for user:', user._id);
      return res.status(404).json({ msg: 'Agency profile not found. Please complete your profile before generating quotes.' });
    }

    // Validate inquiry data
    if (!inquiry.final_price && !inquiry.priceBreakdown?.basePrice) {
      console.log('Missing price information for inquiry:', inquiry._id);
      return res.status(400).json({ msg: 'No price information available for this inquiry' });
    }

    // Prepare agent info with validation
    const agent = {
      name: agencyProfile.username || user.email,
      email: user.email,
      agency: agencyProfile.agencyName || 'Independent Agent',
      phone: agencyProfile.phoneNumber || agencyProfile.mobilePhone || '+960 9385050',
      country: agencyProfile.address?.country || 'Maldives'
    };

    // Log details for debugging
    console.log('Generating quote with agent info:', JSON.stringify(agent));
    console.log('Inquiry details:', JSON.stringify({
      tour: inquiry.tour,
      travel_date: inquiry.travel_date,
      traveller_count: inquiry.traveller_count,
      final_price: inquiry.final_price,
      selected_nights_key: inquiry.selected_nights_key,
      selected_food_category: inquiry.selected_food_category
    }));

    // Generate PDF
    let pdfPath;
    try {
      pdfPath = await generateCustomerQuote(inquiry, agent, profitMargin, marginType);
    } catch (pdfError) {
      console.error('PDF Generation Error:', pdfError);
      return res.status(500).json({ 
        msg: 'Failed to generate quote PDF',
        error: pdfError.message 
      });
    }

    // Send the generated PDF
    console.log('Quote generated successfully:', pdfPath);
    res.download(pdfPath, `customer-quote-${inquiry._id}.pdf`);

  } catch (error) {
    console.error('Quote generation failed:', error);
    res.status(500).json({ 
      msg: 'Failed to generate quote. Please try again or contact support.',
      error: error.message
    });
  }
});

module.exports = router;