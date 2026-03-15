import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentModal from './PaymentModal';
import { API_URL } from '../config/api';

interface Novel {
  _id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  qrImageUrl: string;
  category: string;
  price: number;
}

const NovelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const response = await axios.get(`${API_URL}/novels/${id}`);
        setNovel(response.data.data);
      } catch (error: any) {
        console.error('Error fetching novel:', error);
        setError('Novel not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNovel();
    }
  }, [id]);

  const handleGetAccess = () => {
    setShowPayment(true);
  };

  const handleClosePayment = () => {
    setShowPayment(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading novel details...</div>
      </div>
    );
  }

  if (error || !novel) {
    return (
      <div className="min-h-screen bg-slate-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">{error || 'Novel not found'}</div>
          <button
            onClick={() => navigate('/')}
            className="bg-emerald hover:bg-emerald-dark text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-dark">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-20 pt-8">
        <nav className="flex items-center space-x-2 text-gray-400 text-sm">
          <button
            onClick={() => navigate('/')}
            className="hover:text-white transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-white">{novel.title}</span>
        </nav>
      </div>

      {/* Novel Detail Content */}
      <div className="container mx-auto px-4 md:px-20 py-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Column - Cover Image */}
          <div className="lg:w-2/5">
            <div className="sticky top-8">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <img
                  src={novel.coverImageUrl}
                  alt={novel.title}
                  className="w-full h-auto object-cover transform transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800/1e40af/ffffff?text=Novel+Cover';
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {novel.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Back Button - Mobile & Desktop */}
              <button
                onClick={() => navigate('/')}
                className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center group hover:shadow-lg"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:w-3/5 flex flex-col">
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {novel.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl lg:text-5xl font-bold text-emerald-400">
                    ₹{novel.price}
                  </span>
                  <span className="text-gray-400 text-lg">One-time payment</span>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                About this novel
              </h2>
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                  {novel.description}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mb-10">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What you'll get:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-800/30 backdrop-blur rounded-lg p-4 border border-slate-700 hover:border-emerald-500/50 transition-colors duration-200">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-emerald-400 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Full Access</h4>
                      <p className="text-gray-400 text-sm">Complete novel with all chapters</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/30 backdrop-blur rounded-lg p-4 border border-slate-700 hover:border-emerald-500/50 transition-colors duration-200">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-emerald-400 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Premium Quality</h4>
                      <p className="text-gray-400 text-sm">High-resolution reading experience</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/30 backdrop-blur rounded-lg p-4 border border-slate-700 hover:border-emerald-500/50 transition-colors duration-200">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-emerald-400 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Lifetime Access</h4>
                      <p className="text-gray-400 text-sm">Read anytime, forever</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/30 backdrop-blur rounded-lg p-4 border border-slate-700 hover:border-emerald-500/50 transition-colors duration-200">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-emerald-400 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Multi-Device</h4>
                      <p className="text-gray-400 text-sm">Mobile & desktop reading</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              <button
                onClick={handleGetAccess}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold py-5 px-8 rounded-full 
                         uppercase tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.4)] 
                         hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] 
                         hover:scale-105 active:scale-95 
                         transition-all duration-300 ease-in-out text-xl flex items-center justify-center group"
              >
                <span className="mr-3">🚀</span>
                Get Full Access Now
                <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              <p className="text-center text-gray-400 text-sm mt-4">
                ✨ Instant access after payment • Secure checkout • 24/7 support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && novel && (
        <PaymentModal
          isOpen={showPayment}
          onClose={handleClosePayment}
          item={novel}
          type="novel"
        />
      )}
    </div>
  );
};

export default NovelDetail;
