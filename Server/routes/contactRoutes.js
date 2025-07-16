// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');        // only needed for admin routes
const { sendContactFormNotification, sendContactFormResponse } = require('../utils/emailService');

// Public: submit a new contact form
router.post('/', async (req, res) => {
  try {
    // 1. Save to DB
    const contact = new Contact(req.body);
    await contact.save();

    // 2. Send notifications
    const notificationResult = await sendContactFormNotification(contact);
    
    // 3. Respond to client
    if (notificationResult.error) {
      return res.status(201).json({
        msg: 'Contact submission received, but failed to send notifications',
        contactId: contact._id,
      });
    }
    
    res.status(201).json({
      msg: 'Contact submission received and notifications sent',
      contactId: contact._id,
      twilioSid: notificationResult.twilioSid,
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: list & manage submissions
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ submittedAt: -1 }); // Sort by submission date in descending order
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: update status / reply
router.put('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) return res.status(404).json({ msg: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/:id/sendEmail', auth, async (req, res) => {
  const { response } = req.body;
  if (typeof response !== 'string' || !response.trim()) {
    return res.status(400).json({ msg: 'Response text required' });
  }

  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: 'Not found' });

    const emailResult = await sendContactFormResponse(contact, response);
    
    if (emailResult.error) {
      return res.status(500).json({ msg: emailResult.message });
    }
    
    return res.json({ msg: 'Email sent' });
  } catch (err) {
    console.error('❌ sendEmail error:', err);
    return res.status(500).json({ msg: err.message });
  }
});

// ➁ PUT /api/contacts/:id
//    → Updates the DB record's status & response—no emailing here.
router.put('/:id', auth, async (req, res) => {
  const { status, response } = req.body;
  if (!status && response === undefined) {
    return res.status(400).json({ msg: 'Status or response required' });
  }

  try {
    const update = {};
    if (status)   update.status   = status;
    if (response) update.response = response;

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Not found' });

    console.log(`✏️ Contact ${req.params.id} updated:`, update);
    return res.json(updated);
  } catch (err) {
    console.error('❌ update contact error:', err);
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
