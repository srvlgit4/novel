# Setup Instructions

## 1. Install MongoDB
```bash
# Windows
# Download and install MongoDB Community Server from https://www.mongodb.com/try/download/community

# After installation, start MongoDB service:
net start MongoDB

# Or run it manually:
mongod
```

## 2. Backend Setup
```bash
cd backend
npm install
```

## 3. Environment Variables
Copy `.env.example` to `.env` and update with your values:
```env
MONGO_URI=mongodb://127.0.0.1:27017/web-novel-mvp
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
ADMIN_CHAT_ID=your_admin_chat_id
GROUP_INVITE_LINK=https://t.me/your_group_invite_link
PORT=5000
```

## 4. Seed Database
```bash
# Make sure MongoDB is running first!
node seed.js
```

## 5. Start Backend
```bash
npm run dev
```

## 6. Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 7. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Admin Panel: http://localhost:3000/admin

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running: `mongod`
- Check if MongoDB service is running: `net start MongoDB`
- Try different URI: `mongodb://127.0.0.1:27017/web-novel-mvp`

### Frontend Build Issues
- Install PostCSS dependencies: `npm install @tailwindcss/postcss postcss autoprefixer`
- Clear cache: `npm run build -- --reset-cache`
