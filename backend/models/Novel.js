const mongoose = require('mongoose');

const novelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coverImageUrl: {
    type: String,
    required: true
  },
  qrImageUrl: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: true,
    enum: ['Fantasy', 'System Apocalypse', 'Dark Fantasy', 'Cultivation', 'Reincarnation', 'Romance', 'Action', 'Adult']
  },
  price: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Novel', novelSchema);
