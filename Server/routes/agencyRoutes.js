const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const auth    = require('../middleware/auth');
const Agency  = require('../models/AgencyProfile');
const User     = require('../models/User');

// @route   GET /agency
// @desc    List all agencies
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const agencies = await Agency.find().populate('user', 'email');
    res.json(agencies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /agency
// @desc    Create new agency
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newAgency = new Agency({
      user: req.user.id,
      ...req.body
    });
    const saved = await newAgency.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Bad request' });
  }
});

// @route   PUT /agency/:id
// @desc    Update agency
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Agency.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Update failed' });
  }
});

// @route   DELETE /agency/:id
// @desc    Delete agency
// @access  Private
// DELETE /agency/:id
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
  
    // 1️⃣ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid agency ID' });
    }
  
    try {
      // 2️⃣ Load the agency doc
      const agency = await Agency.findById(id);
      if (!agency) {
        return res.status(404).json({ msg: 'Agency not found' });
      }
  
      // 3️⃣ Cascade user delete
      await User.deleteMany({ agencyProfile: id });
      console.log(`Deleted users for agency ${id}`);
  
      // 4️⃣ Delete the agency itself
      // Option A: use the newer static method
      await Agency.findByIdAndDelete(id);
  
      // —OR— Option B: call the document’s remove()
      // await agency.remove();
  
      return res.json({ msg: 'Agency + its users deleted successfully' });
    } catch (err) {
      console.error('❌ Delete agency error:', err);
      return res
        .status(500)
        .json({ msg: 'Server error while deleting agency', error: err.message });
    }
  });

  router.put('/:id', auth, async (req, res) => {
    try {
      const agencyId = req.params.id;
      const updates = req.body;           // assume front‑end sends all editable fields
      // Optionally: filter out fields you don’t want to allow clients to change
  
      const updatedAgency = await Agency.findByIdAndUpdate(
        agencyId,
        { $set: updates },
        { new: true, runValidators: true }
      );
  
      if (!updatedAgency) {
        return res.status(404).json({ msg: 'Agency not found' });
      }
      res.json(updatedAgency);
    } catch (err) {
      console.error('PUT /agency/:id error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  });
  

module.exports = router;
