import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

interface Novel {
  _id: string;
  title: string;
  price: number;
}

interface PaymentFormProps {
  novel: Novel;
  onClose: () => void;
  onSuccess: (groupLink: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ novel, onClose, onSuccess }) => {
  const [telegramUsername, setTelegramUsername] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!telegramUsername || !screenshot) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('telegramUsername', telegramUsername);
      formData.append('amount', novel.price.toString());
      formData.append('screenshot', screenshot);

      const response = await axios.post(`${API_URL}/transactions`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onSuccess(response.data.data.groupLink);
      } else {
        setError(response.data.message || 'Payment failed');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-darker rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">{novel.title}</h3>
          <p className="text-emerald font-bold">Amount: ₹{novel.price}</p>
        </div>

        {/* QR Code Placeholder */}
        <div className="mb-4 text-center">
          <div className="bg-gray-700 rounded-lg p-4 mb-2">
            <img
              src="https://via.placeholder.com/150x150/10b981/ffffff?text=GPay+QR"
              alt="GPay QR Code"
              className="mx-auto rounded"
            />
          </div>
          <p className="text-gray-400 text-sm">Scan QR code to pay</p>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              Telegram Username
            </label>
            <input
              type="text"
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value)}
              placeholder="@username"
              className="w-full px-3 py-2 bg-slate-dark border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-emerald"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              Payment Screenshot
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 bg-slate-dark border border-gray-600 rounded-md text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-emerald file:text-white hover:file:bg-emerald-dark cursor-pointer"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald hover:bg-emerald-dark text-white font-bold py-3 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Submit Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
