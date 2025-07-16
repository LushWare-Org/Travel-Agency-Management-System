// routes/hotelRoutes.js
const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const auth = require('../middleware/auth');

// Create a new hotel (admin only – add role check in production)
router.post('/', auth, async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all hotels (for search and filter)
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    res.json(hotels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get hotel by id
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ msg: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update hotel (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hotel) return res.status(404).json({ msg: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    console.log('Adding review:', req.user);
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ msg: 'Hotel not found' });

    const review = {
      user: req.user.userId,         // or pull from auth middleware
      rating,
      comment
    };
    hotel.reviews.push(review);
    await hotel.save();
    // Return the populated review (include user name if populated)
    const savedReview = hotel.reviews[hotel.reviews.length - 1];
    res.status(201).json(savedReview);
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete hotel (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).json({ msg: 'Hotel not found' });
    res.json({ msg: 'Hotel deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
