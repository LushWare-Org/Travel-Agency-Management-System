const express = require('express');
const router = express.Router();
const Discount = require('../models/Discount');
const auth = require('../middleware/auth');

// Validate discount data
const validateDiscount = (data, isUpdate = false) => {
  const errors = [];
  const validTypes = ['percentage', 'seasonal', 'exclusive', 'transportation', 'libert'];

  // Required fields for create or if provided during update
  if (!isUpdate || data.discountType) {
    if (!validTypes.includes(data.discountType)) {
      errors.push('Discount type must be one of: percentage, seasonal, exclusive, transportation, libert');
    }
  }


  if (!isUpdate || data.value !== undefined) {
    if (typeof data.value !== 'number' || data.value <= 0 || isNaN(data.value)) {
      errors.push('Value must be a positive number');
    }
  }
  if (data.discountValues) {
    if (!Array.isArray(data.discountValues)) {
      errors.push('discountValues must be an array');
    } else {
      data.discountValues.forEach((d, idx) => {
        if (!d.market || typeof d.market !== 'string') {
          errors.push(`discountValues[${idx}].market is required and must be a string`);
        }
        if (typeof d.value !== 'number' || d.value <= 0 || isNaN(d.value)) {
          errors.push(`discountValues[${idx}].value must be a positive number`);
        }
        if (d.type && !['percentage', 'fixed'].includes(d.type)) {
          errors.push(`discountValues[${idx}].type must be 'percentage' or 'fixed'`);
        }
      });
    }
  }

  if (!isUpdate || data.description) {
    if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
      errors.push('Description is required and must be a non-empty string');
    }
  }

  // Optional fields
  if (data.imageURL && !/^(https?:\/\/)/.test(data.imageURL)) {
    errors.push('Image URL must be a valid URL');
  }

  if (data.eligibleAgents && !Array.isArray(data.eligibleAgents)) {
    errors.push('Eligible agents must be an array');
  }

  if (data.usedAgents && !Array.isArray(data.usedAgents)) {
    errors.push('Used agents must be an array');
  }

  // Conditions validation
  if (data.conditions) {
    if (data.discountType === 'transportation') {
      if (!data.conditions.minStayDays || data.conditions.minStayDays < 1 || isNaN(data.conditions.minStayDays)) {
        errors.push('Minimum stay days must be a positive integer for transportation offer');
      }
    }
    if (data.discountType === 'exclusive') {
      if (!data.conditions.minBookings || data.conditions.minBookings < 1 || isNaN(data.conditions.minBookings)) {
        errors.push('Minimum bookings must be a positive integer for exclusive offer');
      }
    }
    if (data.discountType === 'seasonal') {
      if (!data.conditions.seasonalMonths || !Array.isArray(data.conditions.seasonalMonths) || data.conditions.seasonalMonths.length === 0) {
        errors.push('At least one seasonal month is required for seasonal offer');
      } else if (data.conditions.seasonalMonths.some(m => m < 1 || m > 12 || isNaN(m))) {
        errors.push('Seasonal months must be integers between 1 and 12');
      }
    }
    if (data.discountType === 'libert') {
      if (!data.conditions.isDefault) {
        errors.push('Libert offer must have isDefault set to true');
      }
    }
    if (data.conditions.minNights && (data.conditions.minNights < 1 || isNaN(data.conditions.minNights))) {
      errors.push('Minimum nights must be a positive integer');
    }
    if (data.conditions.bookingVolume && (data.conditions.bookingVolume < 1 || isNaN(data.conditions.bookingVolume))) {
      errors.push('Booking volume must be a positive integer');
    }
  } else if (!isUpdate) {
    errors.push('Conditions object is required');
  }

  return errors;
};

// Create a discount (admin only)
router.post('/', auth, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' });
  }

  try {

    const {
      discountType,
      value,
      discountValues,
      description,
      conditions,
      applicableHotels,
      active,
      validFrom,
      validTo,
      imageURL,
      eligibleAgents,
      usedAgents
    } = req.body;

    // Validate input
    const errors = validateDiscount(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Create discount

    const discount = new Discount({
      discountType,
      value,
      discountValues: discountValues || [],
      description,
      conditions,
      applicableHotels: applicableHotels || [],
      active: active !== undefined ? active : true,
      validFrom,
      validTo,
      imageURL,
      eligibleAgents: eligibleAgents || [],
      usedAgents: usedAgents || []
    });

    await discount.save();
    return res.status(201).json(discount);
  } catch (err) {
    console.error('Error creating discount:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Get all discounts (public, used by OfferCard)
router.get('/', async (req, res) => {
  try {
    const discounts = await Discount.find({});
    return res.json(discounts);
  } catch (err) {
    console.error('Error fetching discounts:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Update a discount (admin only)
router.patch('/:id', auth, async (req, res) => {
  if (!Array.isArray(req.body.usedAgents)) {
    return res.status(400).json({ msg: 'usedAgents must be an array' });
  }
  try {
    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { usedAgents: { $each: req.body.usedAgents } } },
      { new: true }
    );
    if (!discount) {
      return res.status(404).json({ msg: 'Discount not found' });
    }
    return res.json(discount);
  } catch (err) {
    console.error('Error updating discount:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// PUT: Full update (admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' });
  }
  try {
    const {
      discountType,
      value,
      discountValues,
      description,
      conditions,
      applicableHotels,
      active,
      validFrom,
      validTo,
      imageURL,
      eligibleAgents,
      usedAgents
    } = req.body;

    // Validate input
    const errors = validateDiscount(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Prepare update data
    const updateData = {
      discountType,
      value,
      discountValues: discountValues || [],
      description,
      conditions,
      applicableHotels: applicableHotels || [],
      active: active !== undefined ? active : true,
      validFrom,
      validTo,
      imageURL
    };
    if (typeof eligibleAgents !== 'undefined') {
      updateData.eligibleAgents = eligibleAgents;
    }
    if (typeof usedAgents !== 'undefined') {
      updateData.usedAgents = usedAgents;
    }
    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    const discount = await Discount.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!discount) {
      return res.status(404).json({ msg: 'Discount not found' });
    }
    return res.json(discount);
  } catch (err) {
    console.error('Error updating discount:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a discount (admin only)
router.delete('/:id', auth, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' });
  }

  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) {
      return res.status(404).json({ msg: 'Discount not found' });
    }
    return res.json({ msg: 'Discount deleted' });
  } catch (err) {
    console.error('Error deleting discount:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;