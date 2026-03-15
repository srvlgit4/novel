const fs = require('fs');
const path = require('path');

// Default environment configuration
const defaultEnv = `# MongoDB Atlas (Online Database)
MONGO_URI=mongodb+srv://rvl741065_db_user:b9SajGm59AJq64r9@cluster0.iovwpqm.mongodb.net/novel_db

# Local MongoDB (Fallback)
MONGO_URI_LOCAL=mongodb://localhost:27017/novel_db

# Cloudinary (Image Storage)
CLOUDINARY_URL=cloudinary://756732879226259:r2fM4cto3_VdwF54aS0jibif9pg@dkzkcygim

# Telegram Bot
TELEGRAM_BOT_TOKEN=8568787280:AAE1GDhdBAiac9-DqUUAS9fuJWymz9-8es8
ADMIN_CHAT_ID=7424872418
USER_GROUP_CHAT_ID=-1003207362309
GROUP_INVITE_LINK=https://t.me/+E6N6mkDUIrA3ODg1

# Server
PORT=5000
NODE_ENV=development
`;

const defaultEnvLocal = `# Local MongoDB (Primary for development)
MONGO_URI=mongodb://localhost:27017/novel_db

# Cloudinary
CLOUDINARY_URL=cloudinary://756732879226259:r2fM4cto3_VdwF54aS0jibif9pg@dkzkcygim

# Telegram Bot
TELEGRAM_BOT_TOKEN=8568787280:AAE1GDhdBAiac9-DqUUAS9fuJWymz9-8es8
ADMIN_CHAT_ID=7424872418
USER_GROUP_CHAT_ID=-1003207362309
GROUP_INVITE_LINK=https://t.me/+E6N6mkDUIrA3ODg1

# Server
PORT=5000
NODE_ENV=development
`;

function setupEnvironment() {
  try {
    console.log('🔧 Setting up environment files...');
    
    // Create .env file
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
      fs.writeFileSync(envPath, defaultEnv);
      console.log('✅ Created .env file');
    } else {
      console.log('ℹ️  .env file already exists');
    }
    
    // Create .env.local file
    const envLocalPath = path.join(__dirname, '.env.local');
    if (!fs.existsSync(envLocalPath)) {
      fs.writeFileSync(envLocalPath, defaultEnvLocal);
      console.log('✅ Created .env.local file');
    } else {
      console.log('ℹ️  .env.local file already exists');
    }
    
    console.log('\n🎉 Environment setup complete!');
    console.log('📝 Files created:');
    console.log('   - .env (Production settings)');
    console.log('   - .env.local (Development settings)');
    
    console.log('\n🔧 Next steps:');
    console.log('   1. Install dependencies: npm install');
    console.log('   2. Run quick setup: node quick-start.js');
    console.log('   3. Start server: npm start');
    
  } catch (error) {
    console.error('❌ Environment setup failed:', error);
    process.exit(1);
  }
}

// Run setup
if (require.main === module) {
  setupEnvironment();
}

module.exports = setupEnvironment;
