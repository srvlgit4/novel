#!/bin/bash

# Web Novel MVP Deployment Script
# This script helps deploy the project to GitHub, Vercel, and Render

echo "🚀 Web Novel MVP Deployment Script"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please run 'git init' first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    echo "❌ Not in the project root directory. Please run from project root."
    exit 1
fi

echo "✅ Project structure validated"

# Add all files and commit changes
echo "📝 Adding files to git..."
git add .

echo "📦 Creating commit..."
git commit -m "Deploy: Ready for Vercel and Render deployment

🎯 Features:
- Complete MERN stack web novel platform
- JWT-protected admin dashboard
- Novel and transaction management
- Payment verification system
- Responsive glass-morphism UI

🚀 Deployment Ready:
- Frontend: Vercel compatible
- Backend: Render compatible
- Database: MongoDB Atlas ready
- Environment: Production configs included"

echo "🔗 Pushing to GitHub..."
git push origin main

echo ""
echo "🎉 Successfully pushed to GitHub!"
echo ""
echo "📋 Next Steps for Deployment:"
echo "============================="
echo ""
echo "1. 🌐 Deploy Backend to Render:"
echo "   - Visit: https://render.com"
echo "   - Connect your GitHub repository"
echo "   - Configure environment variables"
echo "   - Deploy as Web Service"
echo ""
echo "2. 🎨 Deploy Frontend to Vercel:"
echo "   - Visit: https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Configure build settings"
echo "   - Deploy as Static Site"
echo ""
echo "3. ⚙️ Environment Variables Needed:"
echo "   Backend (Render):"
echo "   - MONGO_URI=mongodb+srv://..."
echo "   - CLOUDINARY_URL=cloudinary://..."
echo "   - TELEGRAM_BOT_TOKEN=..."
echo "   - ADMIN_CHAT_ID=..."
echo "   - GROUP_INVITE_LINK=..."
echo ""
echo "   Frontend (Vercel):"
echo "   - REACT_APP_API_URL=https://your-backend.onrender.com"
echo ""
echo "4. 🔄 Update CORS in backend/server.js:"
echo "   - Add your Vercel URL to cors origins"
echo ""
echo "📚 For detailed instructions, check README.md"
echo ""
echo "🎯 Your project is ready for production deployment!"
