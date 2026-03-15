const Novel = require('./models/Novel');

// Create sample novels in memory for testing
const createSampleNovels = () => {
  const novels = [
    {
      _id: "1",
      title: "Supreme Magus",
      description: "A story about a young mage who seeks revenge and power in a world filled with magic and danger.",
      coverImageUrl: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773466974/a2_vbslw4.png",
      qrImageUrl: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773466974/qr_supreme.png",
      category: "Fantasy",
      price: 100,
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: "2",
      title: "Doomsday System",
      description: "When the world ends, a system awakens. Follow the journey of survivors in a post-apocalyptic world.",
      coverImageUrl: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773466974/b2_torwey.png",
      qrImageUrl: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773466974/qr_doomsday.png",
      category: "System Apocalypse",
      price: 100,
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: "3",
      title: "Shadow Slave",
      description: "A dark fantasy tale of a boy who becomes a shadow slave in a world of nightmares and monsters.",
      coverImageUrl: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773466967/a1_omgjf8.png",
      qrImageUrl: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773466967/qr_shadow.png",
      category: "Dark Fantasy",
      price: 200,
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: "4",
      title: "Heavenly Jewel Change",
      description: "A cultivation story about a young man who gains the power of jewels and seeks to become the strongest.",
      coverImageUrl: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773466974/c3_jewel.png",
      qrImageUrl: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773466974/qr_jewel.png",
      category: "Cultivation",
      price: 100,
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: "5",
      title: "Rebirth of the Malicious",
      description: "Reincarnated with memories of his past life, a young man seeks revenge and redemption in a new world.",
      coverImageUrl: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773466974/d4_rebirth.png",
      qrImageUrl: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773466974/qr_rebirth.png",
      category: "Reincarnation",
      price: 200,
      isActive: true,
      createdAt: new Date()
    }
  ];

  console.log('Sample novels created successfully');
  return novels;
};

module.exports = { createSampleNovels };
