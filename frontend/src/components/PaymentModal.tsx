import React, { useState } from 'react';
import axios from 'axios';
import { getQRCodeUrl, hasQRCode, getDefaultQRCode } from '../utils/qrMapping';
import { API_URL } from '../config/api';

interface Plan {
  name: string;
  price: number;
  duration: string;
}

interface Novel {
  _id: string;
  title: string;
  price: number;
  qrImageUrl: string;
  coverImageUrl?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Novel | Plan | null;
  type: 'novel' | 'membership';
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, item, type }) => {
  const [telegramUsername, setTelegramUsername] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const price = item ? item.price : 0;
  
  // Determine QR image source with priority system
  let qrImageSource: string;
  
  // Priority 1: Custom QR from novel (if exists)
  if (type === 'novel' && item && 'qrImageUrl' in item && (item as Novel).qrImageUrl) {
    qrImageSource = (item as Novel).qrImageUrl;
  }
  // Priority 2: Mapped QR from price
  else if (hasQRCode(price)) {
    qrImageSource = getQRCodeUrl(price) || getDefaultQRCode();
  }
  // Priority 3: Default QR code
  else {
    qrImageSource = getDefaultQRCode();
  }

  const handleDownloadQR = async () => {
    try {
      // Fetch the image as a blob
      const response = await fetch(qrImageSource);
      const blob = await response.blob();
      
      // Create a blob URL and download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_Code_${type === 'novel' ? (item as Novel).title : (item as Plan).name}.png`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(qrImageSource, '_blank');
    }
  };

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
      formData.append('amount', price.toString());
      formData.append('type', type === 'novel' ? 'Novel' : 'Membership');
      formData.append('planName', type === 'novel' ? (item as Novel).title : (item as Plan).name);
      formData.append('screenshot', screenshot);

      const response = await axios.post(`${API_URL}/transactions`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Emit success event
        const event = new CustomEvent('paymentSuccess', { 
          detail: { 
            groupLink: response.data.data.groupLink,
            expiryDate: response.data.data.expiryDate 
          } 
        });
        window.dispatchEvent(event);
        onClose();
      } else {
        setError(response.data.message || 'Payment failed');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl w-full max-w-6xl my-8 shadow-2xl border border-slate-700/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 px-6 py-4 border-b border-slate-700/50 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center">
              <span className="mr-3">🔒</span>
              Secure Payment
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[600px] max-h-[80vh] overflow-y-auto">
          {/* Left Side - Item Details */}
          <div className="lg:w-1/2 p-6 lg:p-8 border-r border-slate-700/50 bg-gradient-to-b from-slate-800/30 to-slate-900/30">
            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold mb-4">
                {type === 'novel' ? '📚 Novel Purchase' : '💎 Membership'}
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
                {type === 'novel' ? (item as Novel)?.title : (item as Plan)?.name}
              </h2>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl lg:text-4xl font-bold text-emerald-400">₹{price}</span>
                <span className="text-gray-400 text-lg">One-time payment</span>
              </div>
            </div>

            {/* Novel/Membership Image */}
            <div className="mb-8">
              {type === 'novel' && item && 'coverImageUrl' in item ? (
                <div className="relative group">
                  <img
                    src={(item as Novel).coverImageUrl}
                    alt={(item as Novel).title}
                    className="w-full h-48 lg:h-64 object-cover rounded-2xl shadow-xl transform transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/1e40af/ffffff?text=Novel+Cover';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </div>
              ) : (
                <div className="w-full h-48 lg:h-64 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                  <div className="text-center text-white relative z-10">
                    <div className="text-5xl lg:text-7xl mb-4 animate-bounce">📚</div>
                    <p className="text-xl lg:text-2xl font-bold">Premium Membership</p>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What you'll get:
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm">Instant access after payment</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm">Secure payment processing</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm">24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Form */}
          <div className="lg:w-1/2 p-6 lg:p-8 bg-gradient-to-b from-slate-900/30 to-slate-800/30">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Complete Your Purchase</h3>
                <p className="text-gray-400">Fill in your details and upload payment screenshot</p>
              </div>

              {/* QR Code Section */}
              <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 mb-6 border border-slate-700/50">
                <h4 className="text-lg font-semibold text-white mb-4 text-center flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  Scan to Pay with GPay
                </h4>
                
                {/* QR Code in Enhanced Frame */}
                <div className="bg-white rounded-2xl p-6 mb-4 shadow-inner">
                  <img
                    src={qrImageSource}
                    alt="Payment QR Code"
                    className="w-full max-w-xs mx-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/250x250/f3f4f6/374151?text=QR+Code';
                    }}
                  />
                </div>

                {/* Download QR Button */}
                <button
                  onClick={handleDownloadQR}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center mb-4 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download QR to Pay
                </button>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-semibold mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Telegram Username *
                  </label>
                  <input
                    type="text"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="@username"
                    className="w-full px-4 py-4 bg-slate-800/50 backdrop-blur border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Screenshot *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                      className="w-full px-4 py-4 bg-slate-800/50 backdrop-blur border border-slate-600/50 rounded-xl text-white file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600 cursor-pointer focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-lg"
                      required
                    />
                    {!screenshot && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {screenshot && (
                    <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl flex items-center">
                      <svg className="w-5 h-5 text-emerald-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-emerald-400 text-sm font-medium">Screenshot uploaded successfully</span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-extrabold py-4 px-6 rounded-xl 
                           uppercase tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.4)] 
                           hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] 
                           hover:scale-105 active:scale-95 
                           transition-all duration-300 ease-in-out text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <span className="mr-2">🚀</span>
                      Complete Payment
                    </>
                  )}
                </button>
              </form>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-slate-800/50 backdrop-blur rounded-full border border-slate-700/50">
                  <svg className="w-4 h-4 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-gray-400 text-sm">Secure & Encrypted Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
