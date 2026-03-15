# Web Novel Membership Site - MERN Stack MVP

A fully functional MERN stack web novel membership platform with admin dashboard, JWT authentication, and manual payment verification.

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
│   ├── models/          # MongoDB models (Novel, Transaction)
│   ├── routes/          # API routes with JWT middleware
│   ├── utils/           # QR code mapping utilities
│   ├── server.js        # Express server
│   ├── seed.js          # Database seeder
│   └── .env             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (Admin, User, UI)
│   │   ├── utils/       # Frontend utilities
│   │   ├── App.tsx      # Main app component
│   │   └── index.css    # Tailwind CSS
│   └── tailwind.config.js
└── README.md
```

## ✨ Features

### Frontend
- **🎨 Modern UI** - Glass-morphism design with dark theme
- **📱 Responsive Design** - Mobile-first approach with Tailwind CSS
- **📚 Novel Management** - Browse, filter, and purchase novels
- **💳 Payment System** - QR code integration with manual verification
- **👤 User Experience** - Success states and Telegram integration
- **🔐 Admin Dashboard** - Secure admin panel with JWT authentication
- **📊 Analytics** - Revenue tracking and user statistics
- **🔍 Search & Filter** - Real-time transaction and novel filtering

### Backend
- **🔒 Security** - JWT authentication and route protection
- **📡 RESTful API** - Well-structured endpoints for all operations
- **💾 MongoDB** - Mongoose models with proper validation
- **☁️ Cloudinary** - Payment screenshot storage
- **🤖 Telegram Bot** - Automated notifications and group management
- **⏰ Membership System** - Automatic expiry date calculation
- **📈 Admin Operations** - Full CRUD operations for novels and transactions

### Novel Categories
- Fantasy
- System Apocalypse
- Dark Fantasy
- Cultivation
- Reincarnation
- Romance
- Action
- Adult

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Axios
- **Backend**: Node.js, Express, Mongoose, JWT
- **Database**: MongoDB
- **Storage**: Cloudinary
- **Notifications**: Telegram Bot API
- **Authentication**: JWT tokens
- **Deployment**: Vercel (Frontend), Render (Backend)

## 📱 Usage

### User Flow
1. Browse novels by category on the main page
2. Click "Buy Access" on any novel or purchase membership
3. Scan QR code and complete payment
4. Upload payment screenshot with Telegram username
5. Receive confirmation and Telegram group invite
6. Enjoy premium access to novels

### Admin Flow
1. Login at `/admin-login` with password: `admin123`
2. View dashboard with statistics and analytics
3. Manage novels (Add, Edit, Delete)
4. Monitor transactions and user activity
5. Review payment screenshots
6. Delete transactions and manage users

## 🔧 API Endpoints

### Novels
- `GET /api/novels` - Get all active novels
- `POST /api/novels` - Create new novel (admin, JWT protected)
- `PUT /api/novels/:id` - Update novel (admin, JWT protected)
- `DELETE /api/novels/:id` - Delete novel (admin, JWT protected)

### Transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get transaction by ID

### Admin (JWT Protected)
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/novels` - Get all novels
- `GET /api/admin/dashboard` - Get dashboard stats
- `DELETE /api/admin/transactions/:id` - Delete transaction

## 🚀 Deployment

### Backend (Render)
1. **Create Render Account**: Sign up at [render.com](https://render.com)
2. **Fork Repository**: Fork this repo to your GitHub account
3. **Connect to Render**: Link your GitHub repository
4. **Configure Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/web-novel-mvp
   CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   ADMIN_CHAT_ID=your_admin_chat_id
   GROUP_INVITE_LINK=https://t.me/your_group_invite_link
   PORT=5000
   ```
5. **Deploy**: Click "Deploy Web Service"
6. **Get URL**: Copy your backend URL for frontend configuration

### Frontend (Vercel)
1. **Create Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Import Project**: Connect your GitHub repository
3. **Configure Build Settings**:
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `cd frontend && npm install`
4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```
5. **Deploy**: Click "Deploy"

### Important Deployment Notes
- **MongoDB Atlas**: Use MongoDB Atlas for production database
- **Environment Variables**: Never commit `.env` files to Git
- **CORS**: Update CORS settings in `backend/server.js` for production URL
- **Build Process**: Frontend builds to static files for optimal performance

## 🔐 Security Features

- **JWT Authentication**: Secure admin panel access
- **Route Protection**: All admin APIs require valid tokens
- **Input Validation**: Mongoose schema validation
- **CORS Configuration**: Proper cross-origin resource sharing
- **Environment Variables**: Sensitive data in environment files
- **Password Protection**: Admin login with secure password

## 📊 Admin Dashboard Features

- **📈 Statistics**: Total revenue, novels, and active users
- **📚 Novel Management**: Add, edit, and delete novels
- **💰 Transaction Management**: View and manage user transactions
- **🔍 Search**: Real-time search by Telegram username
- **📱 Responsive**: Works perfectly on mobile and desktop
- **🎨 Modern UI**: Glass-morphism design with smooth animations

## 🌟 Live Demo

- **Frontend**: [Your Vercel URL]
- **Backend API**: [Your Render URL]
- **Admin Panel**: [Your Vercel URL]/admin

## 📄 License

MIT License - feel free to use this project for your own web novel platform!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions:
- Create an issue in this repository
- Contact the development team

---

**⚡ Ready to deploy your own web novel membership platform!**
