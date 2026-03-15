const mongoose = require('mongoose');
const Novel = require('./models/Novel');
const Transaction = require('./models/Transaction');
require('dotenv').config();

async function quickReset() {
  try {
    console.log('🔄 Quick Reset for NovelTap...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URI_LOCAL);
    console.log('✅ Connected to MongoDB');
    
    // Clear all data
    console.log('🗑️  Clearing all data...');
    const novelCount = await Novel.countDocuments();
    const transactionCount = await Transaction.countDocuments();
    
    await Novel.deleteMany({});
    await Transaction.deleteMany({});
    
    console.log(`✅ Cleared ${novelCount} novels and ${transactionCount} transactions`);
    
    // Run quick start to reseed data
    console.log('🚀 Running quick setup...');
    const quickStart = require('./quick-start');
    await quickStart();
    
  } catch (error) {
    console.error('❌ Quick reset failed:', error);
    process.exit(1);
  }
}

// Run quick reset
if (require.main === module) {
  quickReset();
}

module.exports = quickReset;
