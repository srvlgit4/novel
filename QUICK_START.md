# 🚀 NovelTap Quick Start Guide

## ⚡ One-Command Setup

### **Option 1: Complete Fresh Start**
```bash
cd backend
npm run setup
npm run quick-start
npm start
```

### **Option 2: Reset Everything**
```bash
cd backend
npm run quick-reset
npm start
```

### **Option 3: Just Reseed Data**
```bash
cd backend
npm run quick-start
npm start
```

## 📋 Step-by-Step Instructions

### **1. Environment Setup**
```bash
# Create environment files automatically
node setup-env.js
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Database Setup**
```bash
# Seed novels and transactions
node quick-start.js
```

### **4. Start Server**
```bash
npm start
# or for development
npm run dev
```

## 🔧 What the Scripts Do

### **setup-env.js**
- ✅ Creates `.env` file with production settings
- ✅ Creates `.env.local` file with development settings
- ✅ Configures MongoDB, Cloudinary, and Telegram

### **quick-start.js**
- ✅ Connects to MongoDB (online or local)
- ✅ Clears existing data (optional)
- ✅ Seeds 6 sample novels
- ✅ Seeds 3 sample transactions
- ✅ Provides setup summary

### **quick-reset.js**
- ✅ Clears all existing data
- ✅ Runs fresh setup
- ✅ Reseeds with sample data

## 🗄️ Database Connection

### **Online Database (Primary)**
```
MONGO_URI=mongodb+srv://rvl741065_db_user:b9SajGm59AJq64r9@cluster0.iovwpqm.mongodb.net/novel_db
```

### **Local Database (Fallback)**
```
MONGO_URI_LOCAL=mongodb://localhost:27017/novel_db
```

## 📚 Sample Data Included

### **Novels (6 items)**
- The Last Dragon (Fantasy) - ₹100
- Love in Tokyo (Romance) - ₹80
- The Mystery Mansion (Mystery) - ₹120
- Sci-Fi Revolution (Sci-Fi) - ₹150
- The Warrior's Path (Action) - ₹90
- Echoes of the Past (Thriller) - ₹110

### **Transactions (3 items)**
- Basic Plan Membership - ₹299
- The Last Dragon Novel - ₹100
- Premium Plan Membership - ₹599

## 🌐 Available Endpoints

### **Novels**
- `GET /api/novels` - Get all novels
- `GET /api/novels/:id` - Get single novel
- `POST /api/novels` - Add new novel (admin)

### **Transactions**
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/user/:username` - Get user status
- `GET /api/transactions` - Get all transactions (admin)

### **Admin**
- `GET /api/admin/novels` - Admin novels
- `GET /api/admin/transactions` - Admin transactions
- `GET /api/admin/stats` - Dashboard stats

## 🔍 Troubleshooting

### **MongoDB Connection Issues**
```bash
# Check if MongoDB is running locally
mongod

# Or use online database (already configured)
# Connection string in .env files
```

### **Image Loading Issues**
```bash
# Uses Cloudinary + fallback images
# Fallback: https://picsum.photos/seed/[seed]/[width]/[height]
```

### **Telegram Bot Issues**
```bash
# Check bot token in .env files
# Group ID: -1003207362309
# Admin ID: 7424872418
```

## 🚀 Frontend Setup

```bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
# Backend runs on http://localhost:5000
```

## 📱 Testing the Application

1. **Visit**: http://localhost:3000
2. **Browse**: View novels on home page
3. **Click**: Any novel to see detail page
4. **Purchase**: Click "Get Full Access Now"
5. **Test**: Fill payment form and submit
6. **Check**: Telegram group for notifications

## 🎯 Quick Verification

```bash
# Test API endpoints
curl http://localhost:5000/api/novels
curl http://localhost:5000/api/health

# Check database connection
node -e "require('./quick-start.js')"
```

## 🚨 Common Issues & Solutions

### **"Cannot connect to MongoDB"**
- Use online database (configured in .env)
- Or start local MongoDB: `mongod`

### **"No novels found"**
- Run: `npm run quick-start`
- Check: `curl http://localhost:5000/api/novels`

### **"Images not loading"**
- Uses Cloudinary + picsum.photos fallbacks
- Check internet connection

### **"Telegram notifications not working"**
- Verify bot token in .env
- Check group ID: -1003207362309

## 🎉 Ready in 5 Minutes!

```bash
# Complete setup
cd backend
npm run setup
npm run quick-start
npm start

# Frontend (new terminal)
cd frontend
npm start
```

**Your NovelTap application is now running! 🚀**
