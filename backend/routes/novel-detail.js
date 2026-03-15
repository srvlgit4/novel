const express = require('express');
const router = express.Router();
const Novel = require('../models/Novel');

// GET single novel by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Novel ID is required'
      });
    }

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

module.exports = router;
