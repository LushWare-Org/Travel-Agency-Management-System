const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// POST /api/upload
// Upload single image to Cloudinary
router.post('/', uploadController.uploadImage);

module.exports = router;
