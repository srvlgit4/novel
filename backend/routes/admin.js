const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Transaction = require('../models/Transaction');
const Novel = require('../models/Novel');

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

// GET all transactions for admin
router.get('/transactions', verifyAdminToken, async (req, res) => {
  try {
    console.log('🔍 Fetching transactions from database...');
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${transactions.length} transactions`);
    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('❌ Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions'
    });
  }
});

// GET all novels for admin
router.get('/novels', verifyAdminToken, async (req, res) => {
  try {
    console.log('🔍 Fetching novels from database...');
    const novels = await Novel.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${novels.length} novels`);
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

// GET dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const activeTransactions = await Transaction.countDocuments({ 
      status: 'confirmed',
      expiryDate: { $gt: new Date() }
    });
    const totalNovels = await Novel.countDocuments({ isActive: true });
    
    // Recent transactions (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentTransactions = await Transaction.find({
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        totalTransactions,
        activeTransactions,
        totalNovels,
        recentTransactions: recentTransactions.length,
        recentActivity: recentTransactions.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats'
    });
  }
});

// DELETE transaction
router.delete('/transactions/:id', verifyAdminToken, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting transaction'
    });
  }
});

module.exports = router;
