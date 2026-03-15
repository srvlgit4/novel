import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getQRCodeUrl, hasQRCode, getDefaultQRCode, getPriceOptions } from '../utils/qrMapping';

interface Novel {
  _id?: string;
  title: string;
  description: string;
  coverImageUrl: string;
  qrImageUrl?: string;
  category: string;
  price: number;
}

const AdminAddNovelEnhanced: React.FC = () => {
  const [novel, setNovel] = useState<Novel>({
    title: '',
    description: '',
    coverImageUrl: '',
    qrImageUrl: '',
    category: '',
    price: 100
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [qrPreview, setQrPreview] = useState<string>('');
  const [useCustomQR, setUseCustomQR] = useState(false);

  // Price options for quick select
  const priceOptions = getPriceOptions();

  useEffect(() => {
    // Update QR preview when price changes
    if (!useCustomQR) {
      if (hasQRCode(novel.price)) {
        setQrPreview(getQRCodeUrl(novel.price) || '');
      } else {
        setQrPreview(getDefaultQRCode());
      }
    }
  }, [novel.price, useCustomQR]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      const numericValue = parseInt(value) || 0;
      setNovel({ ...novel, [name]: numericValue });
    } else {
      setNovel({ ...novel, [name]: value });
    }
  };

  const handlePriceSelect = (price: number) => {
    setNovel({ ...novel, price });
    setUseCustomQR(false); // Use mapped QR when selecting from dropdown
  };

  const handleCustomQRToggle = () => {
    setUseCustomQR(!useCustomQR);
    if (!useCustomQR) {
      setQrPreview(''); // Clear preview when enabling custom QR
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const novelData = {
        ...novel,
        // Always include qrImageUrl - either custom or mapped
        qrImageUrl: useCustomQR ? novel.qrImageUrl : (hasQRCode(novel.price) ? getQRCodeUrl(novel.price) : getDefaultQRCode())
      };

      if (novel._id) {
        // Update existing novel
        await axios.put(`http://localhost:5000/api/novels/${novel._id}`, novelData, config);
        setMessage('Novel updated successfully!');
      } else {
        // Add new novel
        await axios.post('http://localhost:5000/api/novels', novelData, config);
        setMessage('Novel added successfully!');
      }

      // Reset form
      setNovel({
        title: '',
        description: '',
        coverImageUrl: '',
        qrImageUrl: '',
        category: '',
        price: 100
      });
      setQrPreview('');
      setUseCustomQR(false);

    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error adding novel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-dark p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          {novel._id ? 'Edit Novel' : 'Add New Novel'} - NovelTap Admin
        </h1>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-center ${
            message.includes('success') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-darker rounded-lg p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Novel Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={novel.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={novel.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="System Apocalypse">System Apocalypse</option>
                  <option value="Dark Fantasy">Dark Fantasy</option>
                  <option value="Cultivation">Cultivation</option>
                  <option value="Reincarnation">Reincarnation</option>
                  <option value="Romance">Romance</option>
                  <option value="Action">Action</option>
                  <option value="Adult">Adult</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Price (₹) *
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    name="price"
                    value={novel.price}
                    onChange={handleInputChange}
                    min="1"
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <select
                    value={hasQRCode(novel.price) ? novel.price.toString() : ''}
                    onChange={(e) => handlePriceSelect(parseInt(e.target.value))}
                    className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Quick Select</option>
                    {priceOptions.map(option => (
                      <option key={option.price} value={option.price}>
                        ₹{option.price}
                      </option>
                    ))}
                  </select>
                </div>
                {hasQRCode(novel.price) && (
                  <p className="text-emerald-400 text-sm">
                    ✅ QR code available for ₹{novel.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  name="coverImageUrl"
                  value={novel.coverImageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="https://res.cloudinary.com/..."
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={novel.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* QR Code Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-white text-sm font-medium">
                    QR Code Settings
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="useCustomQR"
                      checked={useCustomQR}
                      onChange={handleCustomQRToggle}
                      className="mr-2"
                    />
                    <label htmlFor="useCustomQR" className="text-white text-sm">
                      Use Custom QR
                    </label>
                  </div>
                </div>

                {useCustomQR ? (
                  <div>
                    <input
                      type="url"
                      name="qrImageUrl"
                      value={novel.qrImageUrl || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="https://res.cloudinary.com/..."
                    />
                  </div>
                ) : (
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-3">
                      Using mapped QR code for ₹{novel.price}
                    </p>
                    {qrPreview && (
                      <div className="flex justify-center">
                        <img
                          src={qrPreview}
                          alt="QR Code Preview"
                          className="w-32 h-32 bg-white rounded-lg p-2"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* QR Preview */}
              {qrPreview && (
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">QR Code Preview</h4>
                  <div className="flex justify-center">
                    <img
                      src={qrPreview}
                      alt="QR Code Preview"
                      className="w-40 h-40 bg-white rounded-lg p-2 shadow-lg"
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-2 text-center">
                    {useCustomQR ? 'Custom QR Code' : 'Mapped QR Code'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {novel._id ? 'Update Novel' : 'Add Novel'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddNovelEnhanced;
