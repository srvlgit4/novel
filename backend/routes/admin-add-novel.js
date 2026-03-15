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
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// POST add new novel
router.post('/novels/add', upload.single('image'), async (req, res) => {
  try {
    console.log('📝 Adding new novel...');
    const { title, description, category, price } = req.body;

    if (!title || !description || !category || !price || !req.file) {
      console.log('❌ Missing required fields:', { title: !!title, description: !!description, category: !!category, price: !!price, file: !!req.file });
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    console.log('📤 Uploading image to Cloudinary...');
    
    // Upload image to Cloudinary
    const imageResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: 'image',
          folder: 'novel-covers',
          public_id: `${title.toLowerCase().replace(/\s+/g, '-')}-cover-${Date.now()}`
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload successful:', result.secure_url);
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    // Create novel with proper field names
    const novel = new Novel({
      title,
      description,
      coverImageUrl: imageResult.secure_url,
      category,
      price: parseInt(price),
      isActive: true
    });

    console.log('💾 Saving novel to database...');
    await novel.save();
    console.log('✅ Novel saved successfully:', novel.title);
    
    res.status(201).json({
      success: true,
      data: novel,
      message: 'Novel added successfully'
    });
  } catch (error) {
    console.error('❌ Error adding novel:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding novel: ' + error.message
    });
  }
});

module.exports = router;
