const express = require('express');
const router = express.Router();
const multer = require('multer');
const Transaction = require('../models/Transaction');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

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

// POST create new transaction
router.post('/', upload.single('screenshot'), async (req, res) => {
  try {
    const { telegramUsername, amount, type, planName } = req.body;

    if (!telegramUsername || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: 'Telegram username, amount, and type are required'
      });
    }

    // Calculate expiry date based on amount for memberships
    let expiryDate = null;
    if (type === 'Membership') {
      const amountNum = parseInt(amount);
      const now = new Date();
      
      switch (amountNum) {
        case 59:
          expiryDate = new Date(now.getTime() + (15 * 24 * 60 * 60 * 1000)); // 15 days
          break;
        case 100:
          expiryDate = new Date(now.setMonth(now.getMonth() + 1)); // 1 month
          break;
        case 195:
          expiryDate = new Date(now.setMonth(now.getMonth() + 2)); // 2 months
          break;
        case 285:
          expiryDate = new Date(now.setMonth(now.getMonth() + 3)); // 3 months
          break;
        case 565:
          expiryDate = new Date(now.setMonth(now.getMonth() + 6)); // 6 months
          break;
        case 1125:
          expiryDate = new Date(now.setFullYear(now.getFullYear() + 1)); // 1 year
          break;
        default:
          expiryDate = new Date(now.setMonth(now.getMonth() + 1)); // Default 1 month
      }
    } else if (type === 'Novel') {
      // For single novel purchases, set expiry to 3 months from current date
      const now = new Date();
      expiryDate = new Date(now.setMonth(now.getMonth() + 3));
    }

    // Upload screenshot to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: 'image',
          folder: 'payment-screenshots',
          public_id: `${telegramUsername}-${Date.now()}`
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    const transaction = new Transaction({
      type: type || 'Membership',
      planName: planName || 'Custom Plan',
      telegramUsername: telegramUsername.replace('@', ''),
      screenshotUrl: result.secure_url,
      amount: parseInt(amount),
      expiryDate,
      status: 'confirmed'
    });

    await transaction.save();

    // Send Telegram notification
    await sendTelegramNotification(transaction, type);

    res.status(201).json({
      success: true,
      data: {
        transactionId: transaction._id,
        expiryDate: transaction.expiryDate,
        groupLink: process.env.GROUP_INVITE_LINK
      },
      message: 'Payment confirmed successfully'
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating transaction: ' + error.message
    });
  }
});

// Send Telegram notification
async function sendTelegramNotification(transaction, type) {
  try {
    const TelegramBot = require('node-telegram-bot-api');
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
    const userGroupChatId = '-1003207362309'; // Send ONLY to this group

    let message;
    if (type === 'novel') {
      message = '📚 Novel Purchase Completed!\n\n🔹 Novel: ' + transaction.planName + '\n🔹 Price: ₹' + transaction.amount + '\n🔹 User: @' + transaction.telegramUsername + '\n🔹 Status: ✅ Active Access\n🔹 Purchase Date: ' + new Date(transaction.createdAt).toLocaleString() + '\n\n🎉 Thank you for purchasing from NovelTap!';
    } else {
      message = '💎 Membership Activated!\n\n🔹 Plan: ' + transaction.planName + '\n🔹 Price: ₹' + transaction.amount + '\n🔹 User: @' + transaction.telegramUsername + '\n🔹 Status: ✅ Active Membership\n🔹 Start Date: ' + new Date(transaction.createdAt).toLocaleString() + '\n🔹 Expires: ' + new Date(transaction.expiryDate).toLocaleDateString() + '\n\n🎉 Welcome to NovelTap Premium!';
    }

    // Send ONLY to user group - no admin notifications
    await bot.sendMessage(userGroupChatId, message);
    console.log('📤 Notification sent to group -1003207362309: ' + (type === 'novel' ? 'Novel Purchase' : 'Membership'));

    // Send screenshot to user group if available
    if (transaction.screenshotUrl) {
      try {
        await bot.sendPhoto(userGroupChatId, transaction.screenshotUrl, {
          caption: '💳 Payment proof for @' + transaction.telegramUsername + ' - ' + (type === 'novel' ? 'Novel Purchase' : 'Membership Activation')
        });

        console.log('📸 Payment screenshot sent to group -1003207362309');
      } catch (photoError) {
        console.error('Failed to send photo:', photoError);
        // Fallback: send URL if photo fails
        const fallbackMessage = '📸 Payment Screenshot: ' + transaction.screenshotUrl + '\nFrom: @' + transaction.telegramUsername;
        await bot.sendMessage(userGroupChatId, fallbackMessage);
      }
    }

    // Mark as notified
    transaction.telegramNotified = true;
    await transaction.save();
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
}

// GET transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction'
    });
  }
});

// GET user status by Telegram username
router.get('/user/:username', async (req, res) => {
  try {
    let { username } = req.params;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }
    
    // Decode URL-encoded characters and clean username
    username = decodeURIComponent(username);
    const cleanUsername = username.replace('@', '').trim();
    console.log('🔍 Searching for username:', cleanUsername);
    
    // Use exact case-insensitive regex as requested
    const transaction = await Transaction.findOne({
      telegramUsername: { $regex: new RegExp('^' + cleanUsername + '$', 'i') }
    }).sort({ createdAt: -1 });

    console.log('📋 Found transaction:', transaction);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'No membership found for this username. Please make a purchase first.',
        suggestion: 'Visit the home page to buy a membership or novel.'
      });
    }

    // Calculate days remaining
    const today = new Date();
    const expiryDate = new Date(transaction.expiryDate);
    const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    const isExpired = daysRemaining < 0;

    console.log(`📅 Status for ${cleanUsername}: ${isExpired ? 'Expired' : 'Active'}, Days remaining: ${daysRemaining}`);

    res.json({
      success: true,
      data: {
        ...transaction.toObject(),
        daysRemaining,
        isExpired,
        status: isExpired ? 'Expired' : 'Active'
      }
    });
  } catch (error) {
    console.error('❌ Error fetching user status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user status. Please try again later.'
    });
  }
});

module.exports = router;
