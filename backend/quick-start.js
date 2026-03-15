const mongoose = require('mongoose');
const Novel = require('./models/Novel');
const Transaction = require('./models/Transaction');
require('dotenv').config();

// Sample novels data
const sampleNovels = [
  {
    title: "The Last Dragon",
    description: "An epic tale of a young dragon rider who must save the kingdom from an ancient evil. Follow the journey of courage, friendship, and destiny in this thrilling fantasy adventure.",
    coverImageUrl: "https://picsum.photos/seed/dragon1/400/600",
    qrImageUrl: "https://picsum.photos/seed/qr1/250/250",
    category: "Fantasy",
    price: 100
  },
  {
    title: "Love in Tokyo",
    description: "A heartwarming romance story set in the bustling streets of Tokyo. Two souls from different worlds find love in the most unexpected circumstances.",
    coverImageUrl: "https://picsum.photos/seed/tokyo1/400/600",
    qrImageUrl: "https://picsum.photos/seed/qr2/250/250",
    category: "Romance",
    price: 80
  },
  {
    title: "The Mystery Mansion",
    description: "A gripping mystery novel where detective Sarah Williams uncovers dark secrets hidden within an old Victorian mansion. Every clue leads to more questions.",
    coverImageUrl: "https://picsum.photos/seed/mansion1/400/600",
    qrImageUrl: "https://picsum.photos/seed/qr3/250/250",
    category: "Mystery",
    price: 120
  },
  {
    title: "Sci-Fi Revolution",
    description: "In the year 2150, humanity faces its greatest challenge. A group of rebels must fight against an oppressive AI regime to save the future of mankind.",
    coverImageUrl: "https://picsum.photos/seed/scifi1/400/600",
    qrImageUrl: "https://picsum.photos/seed/qr4/250/250",
    category: "Sci-Fi",
    price: 150
  },
  {
    title: "The Warrior's Path",
    description: "Ancient martial arts meets modern adventure in this action-packed novel. Follow the journey of a young warrior mastering the art of combat.",
    coverImageUrl: "https://picsum.photos/seed/warrior1/400/600",
    qrImageUrl: "https://picsum.photos/seed/qr5/250/250",
    category: "Action",
    price: 90
  },
  {
    title: "Echoes of the Past",
    description: "A psychological thriller that will keep you on the edge of your seat. Detective Morgan must solve a series of murders that mirror a 20-year-old case.",
    coverImageUrl: "https://picsum.photos/seed/thriller1/400/600",
    qrImageUrl: "https://picsum.photos/seed/qr6/250/250",
    category: "Thriller",
    price: 110
  }
];

// Sample transactions data
const sampleTransactions = [
  {
    type: "Membership",
    planName: "Basic Plan",
    amount: 299,
    telegramUsername: "testuser1",
    status: "completed",
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  {
    type: "Novel",
    planName: "The Last Dragon",
    amount: 100,
    telegramUsername: "testuser2",
    status: "completed",
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
  },
  {
    type: "Membership",
    planName: "Premium Plan",
    amount: 599,
    telegramUsername: "testuser3",
    status: "completed",
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
  }
];

async function quickStart() {
  try {
    console.log('🚀 Starting Quick Setup for NovelTap...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URI_LOCAL);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await Novel.deleteMany({});
    await Transaction.deleteMany({});
    console.log('✅ Cleared existing data');
    
    // Seed novels
    console.log('📚 Seeding novels...');
    const novels = await Novel.insertMany(sampleNovels);
    console.log(`✅ Created ${novels.length} novels`);
    
    // Seed transactions
    console.log('💳 Seeding transactions...');
    const transactions = await Transaction.insertMany(sampleTransactions);
    console.log(`✅ Created ${transactions.length} transactions`);
    
    // Display summary
    console.log('\n🎉 Quick Setup Complete!');
    console.log('📊 Summary:');
    console.log(`   - Novels: ${novels.length}`);
    console.log(`   - Transactions: ${transactions.length}`);
    console.log('\n🔗 Available endpoints:');
    console.log('   - GET /api/novels (Get all novels)');
    console.log('   - GET /api/novels/:id (Get single novel)');
    console.log('   - POST /api/transactions (Create transaction)');
    console.log('   - GET /api/transactions/user/:username (Get user status)');
    console.log('   - GET /api/admin/* (Admin endpoints)');
    
    console.log('\n🚀 You can now start the server with: npm start');
    
  } catch (error) {
    console.error('❌ Quick setup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run quick start
if (require.main === module) {
  quickStart();
}

module.exports = quickStart;
