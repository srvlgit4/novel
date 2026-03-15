const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Novel = require('../models/Novel');

// Configure Cloudinary
cloudinary.config(process.env.CLOUDINARY_URL);

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// POST add new novel with dual image upload
router.post('/add', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'qrImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    if (!title || !description || !category || !price || !req.files.coverImage) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, price, and cover image are required'
      });
    }

    // Upload cover image to Cloudinary
    const coverImageResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: 'image',
          folder: 'novel-covers',
          public_id: `${title.toLowerCase().replace(/\s+/g, '-')}-cover-${Date.now()}`
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.files.coverImage[0].buffer);
    });

    // Upload QR image to Cloudinary (optional)
    let qrImageUrl = null;
    if (req.files.qrImage && req.files.qrImage[0]) {
      const qrImageResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            resource_type: 'image',
            folder: 'novel-qr-codes',
            public_id: `${title.toLowerCase().replace(/\s+/g, '-')}-qr-${Date.now()}`
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.files.qrImage[0].buffer);
      });
      qrImageUrl = qrImageResult.secure_url;
    }

    const novel = new Novel({
      title,
      description,
      category,
      price: parseInt(price),
      coverImageUrl: coverImageResult.secure_url,
      qrImageUrl
    });

    await novel.save();
    
    res.status(201).json({
      success: true,
      data: novel,
      message: 'Novel added successfully'
    });
  } catch (error) {
    console.error('Error adding novel:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding novel: ' + error.message
    });
  }
});

module.exports = router;
