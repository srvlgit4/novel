const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Novel', 'Membership']
  },
  planName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  telegramUsername: {
    type: String,
    required: true,
    trim: true
  },
  screenshotUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'expired'],
    default: 'pending'
  },
  expiryDate: {
    type: Date,
    required: true
  },
  telegramNotified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate expiry date before saving
transactionSchema.pre('save', function(next) {
  if (!this.expiryDate) {
    this.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
