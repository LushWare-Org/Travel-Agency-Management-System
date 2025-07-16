const express = require('express');
const auth = require('../middleware/auth');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { bookingId, amount, currency, method, transactionId } = req.body;

    // 1️⃣ validate booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    // 2️⃣ create payment
    const payment = await Payment.create({
      booking: bookingId,
      agent: req.user.id,
      amount,
      currency,
      method,
      status: 'completed', // or 'pending' until gateway callback
      transactionId,
    });

    // 3️⃣ (optional) mark booking as “Paid”
    booking.status = 'Paid';
    await booking.save();

    res.status(201).json(payment);
  } catch (err) {
    console.error('POST /payments error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ agent: req.user.id })
      .populate('booking', 'bookingReference hotel')
      .sort('-createdAt');
    res.json(payments);
  } catch (err) {
    console.error('GET /payments/my error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .populate('agent', 'email name');
    if (!payment) return res.status(404).json({ msg: 'Payment not found' });

    // only admin or owner can view
    if (!req.user.isAdmin && payment.agent.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    res.json(payment);
  } catch (err) {
    console.error('GET /payments/:id error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;