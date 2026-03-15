const mongoose = require('mongoose');
const Novel = require('./models/Novel');
require('dotenv').config();

const seedNovels = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing novels
    await Novel.deleteMany({});
    console.log('Cleared existing novels');

    // Sample novels with working placeholder images
    const novels = [
      {
        title: "Supreme Magus",
        description: "A story about a young mage who seeks revenge and power in a world filled with magic and danger.",
        coverImageUrl: "https://picsum.photos/seed/supreme-magus/200/300.jpg",
        qrImageUrl: "https://picsum.photos/seed/qr-supreme/150/150.jpg",
        category: "Fantasy",
        price: 100
      },
      {
        title: "Doomsday System",
        description: "When the world ends, a system awakens. Follow the journey of survivors in a post-apocalyptic world.",
        coverImageUrl: "https://picsum.photos/seed/doomsday-system/200/300.jpg",
        qrImageUrl: "https://picsum.photos/seed/qr-doomsday/150/150.jpg",
        category: "System Apocalypse",
        price: 100
      },
      {
        title: "Shadow Slave",
        description: "A dark fantasy tale of a boy who becomes a shadow slave in a world of nightmares and monsters.",
        coverImageUrl: "https://picsum.photos/seed/shadow-slave/200/300.jpg",
        qrImageUrl: "https://picsum.photos/seed/qr-shadow/150/150.jpg",
        category: "Dark Fantasy",
        price: 200
      },
      {
        title: "Heavenly Jewel Change",
        description: "A cultivation story about a young man who gains the power of jewels and seeks to become the strongest.",
        coverImageUrl: "https://picsum.photos/seed/heavenly-jewel/200/300.jpg",
        qrImageUrl: "https://picsum.photos/seed/qr-jewel/150/150.jpg",
        category: "Cultivation",
        price: 100
      },
      {
        title: "Rebirth of the Malicious",
        description: "Reincarnated with memories of his past life, a young man seeks revenge and redemption in a new world.",
        coverImageUrl: "https://picsum.photos/seed/rebirth-malicious/200/300.jpg",
        qrImageUrl: "https://picsum.photos/seed/qr-rebirth/150/150.jpg",
        category: "Reincarnation",
        price: 200
      }
    ];

    await Novel.insertMany(novels);
    console.log('Sample novels created successfully');

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedNovels();
