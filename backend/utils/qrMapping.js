// QR Code Price Mapping for NovelTap
const qrCodeMapping = {
  29: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773552850/qr-29_vyzqew.jpg",
  39: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773552850/qr-39_xijji5.jpg",
  49: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773552850/qr-49_qp2b9x.jpg",
  59: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773552852/qr-59_qd3aar.jpg",
  100: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773552852/qr-100_grazu9.jpg",
  195: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773552851/qr-195_ucc5er.jpg",
  285: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773552852/qr-285_tfni4c.jpg",
  565: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773552850/qr-565_fwryrr.jpg",
  1125: "https://res.cloudinary.com/dkzkcygim/image/upload/v1773552850/qr-1125_prxolq.jpg"
};

// Get QR code URL based on price
function getQRCodeUrl(price) {
  // Convert price to number for comparison
  const numericPrice = parseInt(price);
  
  // Return mapped QR code if exists, otherwise return default
  return qrCodeMapping[numericPrice] || null;
}

// Get all available price options
function getPriceOptions() {
  return Object.keys(qrCodeMapping).map(price => ({
    price: parseInt(price),
    qrUrl: qrCodeMapping[price]
  })).sort((a, b) => a.price - b.price);
}

// Check if price has QR code
function hasQRCode(price) {
  return qrCodeMapping.hasOwnProperty(parseInt(price));
}

// Get default QR code (for fallback)
function getDefaultQRCode() {
  return "https://res.cloudinary.com/dkzkcygim/image/upload/v1773552852/qr-100_grazu9.jpg"; // ₹100 as default
}

module.exports = {
  getQRCodeUrl,
  getPriceOptions,
  hasQRCode,
  getDefaultQRCode,
  qrCodeMapping
};
