const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Novel = require('../models/Novel');
const { getQRCodeUrl, hasQRCode, getDefaultQRCode } = require('../utils/qrMapping');

// JWT verification middleware
const verifyAdminToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }
  
  try {
    // In production, verify the JWT token
    // For now, we'll accept any token for demo purposes
    req.user = { verified: true };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// GET all novels
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Fetching novels for home page...');
    const novels = await Novel.find({ isActive: true }).sort({ createdAt: -1 });
    console.log(`✅ Found ${novels.length} active novels for home page`);
    res.json({
      success: true,
      data: novels
    });
  } catch (error) {
    console.error('❌ Error fetching novels:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching novels'
    });
  }
});

// GET single novel by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Fetching novel with ID:', id);
    
    const novel = await Novel.findById(id);
    
    if (!novel) {
      console.log('❌ Novel not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Novel not found'
      });
    }
    
    console.log('✅ Novel found:', novel.title);
    res.json({
      success: true,
      data: novel
    });
  } catch (error) {
    console.error('❌ Error fetching novel:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching novel'
    });
  }
});

// POST a new novel (for admin)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const { title, description, coverImageUrl, category, price, qrImageUrl } = req.body;
    
    const novel = new Novel({
      title,
      description,
      coverImageUrl,
      category,
      price,
      qrImageUrl: qrImageUrl || null // Only save custom QR if provided
    });
    
    await novel.save();
    console.log('✅ New novel created:', title);
    
    res.status(201).json({
      success: true,
      message: 'Novel created successfully',
      data: novel
    });
  } catch (error) {
    console.error('❌ Error creating novel:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating novel'
    });
  }
});

// PUT update novel by ID
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, coverImageUrl, category, price, qrImageUrl } = req.body;
    
    console.log('📝 Updating novel:', id);
    
    const novel = await Novel.findById(id);
    
    if (!novel) {
      console.log('❌ Novel not found for update:', id);
      return res.status(404).json({
        success: false,
        message: 'Novel not found'
      });
    }
    
    // Update fields
    novel.title = title || novel.title;
    novel.description = description || novel.description;
    novel.coverImageUrl = coverImageUrl || novel.coverImageUrl;
    novel.category = category || novel.category;
    novel.price = price || novel.price;
    
    // Handle QR code logic
    if (qrImageUrl) {
      // Custom QR provided
      novel.qrImageUrl = qrImageUrl;
    } else {
      // No custom QR, clear existing custom QR to use mapped QR
      novel.qrImageUrl = null;
    }
    
    await novel.save();
    console.log('✅ Novel updated successfully:', title);
    
    res.json({
      success: true,
      message: 'Novel updated successfully',
      data: novel
    });
  } catch (error) {
    console.error('❌ Error updating novel:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating novel'
    });
  }
});

// DELETE novel by ID
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting novel:', id);
    
    const novel = await Novel.findById(id);
    
    if (!novel) {
      console.log('❌ Novel not found for deletion:', id);
      return res.status(404).json({
        success: false,
        message: 'Novel not found'
      });
    }
    
    await Novel.findByIdAndDelete(id);
    console.log('✅ Novel deleted successfully:', novel.title);
    
    res.json({
      success: true,
      message: 'Novel deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting novel:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting novel'
    });
  }
});

module.exports = router;
