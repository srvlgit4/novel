const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const novelRoutes = require('./routes/novels');
const transactionRoutes = require('./routes/transactions');
const adminRoutes = require('./routes/admin');
const adminAddNovelRoutes = require('./routes/admin-add-novel');
const novelsAddRoutes = require('./routes/novels-add');
const novelDetailRoutes = require('./routes/novel-detail');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/novels', novelRoutes);
app.use('/api/novels', novelsAddRoutes);
app.use('/api/novels', novelDetailRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminAddNovelRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Web Novel MVP API is running' });
});

// Serve static files from frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong on the server' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API: http://localhost:${PORT}/api`);
});
