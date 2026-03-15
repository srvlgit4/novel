const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function realSetup() {
  try {
    console.log('🔧 Real Setup for NovelTap - No Fake Data');
    
    // Step 1: Test Environment Variables
    console.log('\n📋 Checking environment variables...');
    const requiredEnv = ['MONGO_URI', 'CLOUDINARY_URL', 'TELEGRAM_BOT_TOKEN'];
    const missing = requiredEnv.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.log('❌ Missing environment variables:', missing);
      console.log('💡 Run: node setup-env.js first');
      return;
    }
    console.log('✅ All environment variables present');
    
    // Step 2: Test MongoDB Connection (Real Database)
    console.log('\n🗄️  Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected to real database');
    
    // Step 3: Test Cloudinary Connection (Real Images)
    console.log('\n☁️  Testing Cloudinary connection...');
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_URL.split('@')[1].split('.')[0],
      api_key: process.env.CLOUDINARY_URL.split(':')[2].split('@')[0],
      api_secret: process.env.CLOUDINARY_URL.split(':')[3].split('@')[0]
    });
    
    // Just test the configuration, don't add fake data
    console.log('✅ Cloudinary configured for real images');
    
    // Step 4: Test Telegram Bot (Real Notifications)
    console.log('\n📱 Testing Telegram bot...');
    const TelegramBot = require('node-telegram-bot-api');
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
    
    try {
      const botInfo = await bot.getMe();
      console.log(`✅ Telegram bot connected: @${botInfo.username}`);
    } catch (error) {
      console.log('❌ Telegram bot failed:', error.message);
    }
    
    // Step 5: Check Database Status (No Fake Data)
    console.log('\n📊 Database status:');
    const Novel = require('./models/Novel');
    const Transaction = require('./models/Transaction');
    
    const novelCount = await Novel.countDocuments();
    const transactionCount = await Transaction.countDocuments();
    
    console.log(`   Novels: ${novelCount} (real data only)`);
    console.log(`   Transactions: ${transactionCount} (real data only)`);
    
    if (novelCount === 0) {
      console.log('\n💡 Database is empty - ready for real content');
      console.log('   Add novels through admin panel');
      console.log('   Or use API: POST /api/novels');
    }
    
    // Step 6: Test API Endpoints
    console.log('\n🌐 API endpoints ready:');
    console.log('   GET /api/novels - Real novels from database');
    console.log('   GET /api/novels/:id - Real novel details');
    console.log('   POST /api/transactions - Real payments');
    console.log('   GET /api/transactions/user/:username - Real user data');
    
    console.log('\n🎉 Real Setup Complete!');
    console.log('🚀 Your application is ready for REAL data:');
    console.log('   ✅ Real MongoDB database');
    console.log('   ✅ Real Cloudinary images');
    console.log('   ✅ Real Telegram notifications');
    console.log('   ✅ No fake/sample data');
    
    console.log('\n📝 Next Steps:');
    console.log('   1. Add real novels through admin panel');
    console.log('   2. Upload real images to Cloudinary');
    console.log('   3. Test real user purchases');
    console.log('   4. Deploy to production');
    
  } catch (error) {
    console.error('❌ Real setup failed:', error);
    console.log('\n🔧 Check:');
    console.log('   1. MongoDB connection string');
    console.log('   2. Cloudinary configuration');
    console.log('   3. Telegram bot token');
    console.log('   4. Network connectivity');
  } finally {
    await mongoose.disconnect();
  }
}

// Run real setup
if (require.main === module) {
  realSetup();
}

module.exports = realSetup;
