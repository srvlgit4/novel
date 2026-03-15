# Web Novel Membership Site - MERN Stack MVP

A functional MERN stack web novel membership platform with manual payment verification.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Cloudinary account
- Telegram Bot

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/web-novel-mvp

# Cloudinary
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
ADMIN_CHAT_ID=your_admin_chat_id
GROUP_INVITE_LINK=https://t.me/your_group_invite_link

# Server
PORT=5000
```

Seed the database with sample novels:
```bash
node seed.js
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm start
```

## 📁 Project Structure

```
web-novel-mvp/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── server.js        # Express server
│   ├── seed.js          # Database seeder
│   └── .env             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.tsx      # Main app component
│   │   └── index.css    # Tailwind CSS
│   └── tailwind.config.js
└── README.md
```

## ✨ Features

### Frontend
- **Dark Theme UI** - Deep slate/black background with emerald/blue accents
- **Novel List Page** - Responsive grid of novels with images and buy buttons
- **Manual Payment Flow** - QR code display, form submission, and file upload
- **Success State** - Telegram group link display after payment
- **Admin Dashboard** - Transaction management and statistics

### Backend
- **Express API** - RESTful endpoints for novels, transactions, and admin
- **MongoDB Integration** - Mongoose models for data persistence
- **Cloudinary Storage** - Payment screenshot uploads
- **Telegram Notifications** - Bot API integration for admin alerts
- **30-day Membership** - Automatic expiry date calculation

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Axios
- **Backend**: Node.js, Express, Mongoose, Multer
- **Database**: MongoDB
- **Storage**: Cloudinary
- **Notifications**: Telegram Bot API

## 📱 Usage

### User Flow
1. Browse novels on the main page
2. Click "Buy Access" on any novel
3. Scan GPay QR code and pay
4. Upload payment screenshot and enter Telegram username
5. Receive confirmation and Telegram group link

### Admin Flow
1. Visit `/admin` to view dashboard
2. Monitor transactions and user activity
3. View payment screenshots
4. Manage novel inventory

## 🔧 API Endpoints

### Novels
- `GET /api/novels` - Get all active novels
- `POST /api/novels` - Create new novel (admin)

### Transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get transaction by ID

### Admin
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/novels` - Get all novels
- `GET /api/admin/dashboard` - Get dashboard stats
- `DELETE /api/admin/transactions/:id` - Delete transaction

## 🚀 Deployment

### Backend (Render/Heroku)
1. Deploy backend to your preferred platform
2. Set environment variables in deployment dashboard
3. Ensure MongoDB is accessible (Atlas recommended)

### Frontend (Vercel/Netlify)
1. Build frontend: `npm run build`
2. Deploy static files to your preferred platform
3. Update API base URL in components for production

## 📄 License

MIT
