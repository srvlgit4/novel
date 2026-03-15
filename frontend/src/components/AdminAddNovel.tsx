import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminAddNovel: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Fantasy',
    price: 100
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [qrImage, setQrImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const categories = ['Fantasy', 'System Apocalypse', 'Dark Fantasy', 'Cultivation', 'Reincarnation', 'Romance', 'Action'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description || !coverImage) {
      setError('Title, description, and cover image are required');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('price', formData.price.toString());
      data.append('coverImage', coverImage);
      if (qrImage) {
        data.append('qrImage', qrImage);
      }

      const response = await axios.post('http://localhost:5000/api/novels/add', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess('Novel added successfully!');
        setFormData({ title: '', description: '', category: 'Fantasy', price: 100 });
        setCoverImage(null);
        setQrImage(null);
        // Reset file inputs
        const coverInput = document.getElementById('cover-input') as HTMLInputElement;
        const qrInput = document.getElementById('qr-input') as HTMLInputElement;
        if (coverInput) coverInput.value = '';
        if (qrInput) qrInput.value = '';
        
        // Redirect to admin dashboard after successful addition
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to add novel');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error adding novel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-dark p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Add New Novel</h1>
          <p className="text-gray-400">Upload a new novel with cover image and optional QR code</p>
        </div>

        <div className="bg-slate-darker rounded-xl p-8">
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-dark border border-emerald text-white px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-dark border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-emerald"
                  placeholder="Enter novel title"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-dark border border-gray-600 rounded-md text-white focus:outline-none focus:border-emerald"
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-dark border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-emerald h-32"
                placeholder="Enter novel description"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-dark border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-emerald"
                placeholder="100"
                min="1"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Novel Cover Image *
                </label>
                <input
                  id="cover-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 bg-slate-dark border border-gray-600 rounded-md text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-emerald file:text-white hover:file:bg-emerald-dark cursor-pointer"
                  required
                />
                {coverImage && (
                  <p className="text-gray-400 text-sm mt-2">
                    Selected: {coverImage.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Payment QR Image (Optional)
                </label>
                <input
                  id="qr-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setQrImage(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 bg-slate-dark border border-gray-600 rounded-md text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-emerald file:text-white hover:file:bg-emerald-dark cursor-pointer"
                />
                {qrImage && (
                  <p className="text-gray-400 text-sm mt-2">
                    Selected: {qrImage.name}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald hover:bg-emerald-dark text-white font-bold py-3 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Novel...' : 'Add Novel'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/admin')}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            ← Back to Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddNovel;
