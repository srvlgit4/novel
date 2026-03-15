const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
require('dotenv').config();

const seedTransactions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing transactions
    await Transaction.deleteMany({});
    console.log('Cleared existing transactions');

    // Sample transactions
    const transactions = [
      {
        type: 'Membership',
        planName: 'Basic',
        amount: 100,
        telegramUsername: 'testuser1',
        screenshotUrl: 'https://picsum.photos/seed/payment1/300/200.jpg',
        status: 'confirmed',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        telegramNotified: true
      },
      {
        type: 'Membership',
        planName: 'Premium',
        amount: 299,
        telegramUsername: 'testuser2',
        screenshotUrl: 'https://picsum.photos/seed/payment2/300/200.jpg',
        status: 'confirmed',
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        telegramNotified: true
      },
      {
        type: 'Novel',
        planName: 'Shadow Slave',
        amount: 200,
        telegramUsername: 'testuser3',
        screenshotUrl: 'https://picsum.photos/seed/payment3/300/200.jpg',
        status: 'confirmed',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        telegramNotified: true
      },
      {
        type: 'Membership',
        planName: 'Trial',
        amount: 59,
        telegramUsername: 'god',
        screenshotUrl: 'https://picsum.photos/seed/payment-god/300/200.jpg',
        status: 'confirmed',
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        telegramNotified: true
      }
    ];

    await Transaction.insertMany(transactions);
    console.log('Sample transactions created successfully');

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding transactions:', error);
    process.exit(1);
  }
};

seedTransactions();
